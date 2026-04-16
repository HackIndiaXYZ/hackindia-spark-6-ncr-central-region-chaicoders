"""
Career Intelligence System - Model Quantization & Fine-Tuning Script
====================================================================
Uses QLoRA (4-bit quantization via bitsandbytes) to fine-tune a
Llama-3 / Mistral model on career intelligence data without needing
a massive GPU. Works on ~10 GB VRAM or Google Colab (free T4 GPU).

Requirements (install once):
    pip install transformers peft bitsandbytes datasets accelerate trl

Usage:
    python quantize.py --mode finetune    # fine-tune on your JSONL data
    python quantize.py --mode inference   # load & chat with the model
"""

import argparse
import json
import torch
from datasets import Dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    pipeline,
)
from peft import LoraConfig, get_peft_model, TaskType, PeftModel
from trl import SFTTrainer

# ---------------------------------------------------------------------------
# CONFIGURATION - edit these to match your setup
# ---------------------------------------------------------------------------
BASE_MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"
# Swap to "meta-llama/Meta-Llama-3-8B-Instruct" if you prefer Llama 3

OUTPUT_DIR  = "./career-gpt-qlora"             # where fine-tuned weights are saved
DATA_FILE   = "./career_training_data.jsonl"   # your training JSONL
MAX_SEQ_LEN = 1024                             # max tokens per training sample
# ---------------------------------------------------------------------------


def build_bnb_config() -> BitsAndBytesConfig:
    """
    4-bit NormalFloat (NF4) quantization.
    Shrinks a 7B-param model from ~14 GB to ~4-5 GB in GPU memory,
    making fine-tuning possible on a single consumer GPU or Colab T4.
    """
    return BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",             # NormalFloat4: best accuracy per bit
        bnb_4bit_compute_dtype=torch.float16,  # compute in fp16 for Ampere+ speed
        bnb_4bit_use_double_quant=True,        # 2nd-level quant saves ~0.4 bits/param
    )


def build_lora_config() -> LoraConfig:
    """
    Low-Rank Adaptation: freeze the base model and only train small
    adapter matrices. Reduces trainable params from 7B to ~20M (99.7%).
    """
    return LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=16,          # rank - higher = more capacity but more memory
        lora_alpha=32, # scaling factor: 2*r is a solid default
        lora_dropout=0.05,
        bias="none",
        target_modules=[
            "q_proj", "k_proj", "v_proj", "o_proj",
            "gate_proj", "up_proj", "down_proj",
        ],
    )


def format_conversation(messages: list) -> str:
    """Convert a list of chat messages into a single ChatML-format string."""
    text = ""
    for msg in messages:
        role    = msg["role"]
        content = msg["content"]
        if role == "system":
            text += "[SYSTEM]\n" + content + "\n"
        elif role == "user":
            text += "[USER]\n" + content + "\n"
        elif role == "assistant":
            text += "[ASSISTANT]\n" + content + "\n[END]\n"
    return text.strip()


def load_jsonl_as_dataset(path: str) -> Dataset:
    """
    Load career_training_data.jsonl and convert each conversation
    into a single 'text' string that the trainer expects.
    """
    records = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            obj = json.loads(line)
            formatted = format_conversation(obj["messages"])
            records.append({"text": formatted})

    print(f"[INFO] Loaded {len(records)} training examples from {path}")
    return Dataset.from_list(records)


def run_finetuning():
    """Full QLoRA fine-tuning pipeline."""
    print("[STEP 1/4] Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_ID, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"

    print("[STEP 2/4] Loading 4-bit quantized base model...")
    bnb_config = build_bnb_config()
    model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL_ID,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True,
    )
    model.config.use_cache = False  # required for gradient checkpointing
    model.config.pretraining_tp = 1

    print("[STEP 3/4] Applying LoRA adapters...")
    lora_config = build_lora_config()
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()  # shows ~0.3% trainable - that's correct

    print("[STEP 4/4] Loading dataset and starting training...")
    dataset = load_jsonl_as_dataset(DATA_FILE)

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=3,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,   # effective batch size = 2 * 4 = 8
        learning_rate=2e-4,
        warmup_ratio=0.03,
        lr_scheduler_type="cosine",
        save_strategy="epoch",
        logging_steps=10,
        fp16=True,                       # mixed precision, faster on Ampere+ GPUs
        optim="paged_adamw_32bit",       # memory-efficient optimizer for QLoRA
        report_to="none",                # set to "wandb" if you have Weights & Biases
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        tokenizer=tokenizer,
        args=training_args,
        dataset_text_field="text",
        max_seq_length=MAX_SEQ_LEN,
        packing=False,
    )

    print("[TRAINING] Starting fine-tuning job...")
    trainer.train()

    print(f"[DONE] Saving LoRA adapter weights to: {OUTPUT_DIR}")
    trainer.model.save_pretrained(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)

    print("\n[SUCCESS] Fine-tuning complete!")
    print(f"Your model is saved at: {OUTPUT_DIR}/")
    print("Next step: run  python quantize.py --mode inference  to chat with it.")


def run_inference():
    """Load the fine-tuned model and start an interactive chat loop."""
    print("[LOADING] Loading 4-bit quantized fine-tuned model for inference...")

    bnb_config = build_bnb_config()
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL_ID,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True,
    )
    model = PeftModel.from_pretrained(base_model, OUTPUT_DIR)
    tokenizer = AutoTokenizer.from_pretrained(OUTPUT_DIR)

    generator = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=512,
        temperature=0.7,
        do_sample=True,
    )

    system_prompt = (
        "You are an expert career advisor specializing in tech roles, "
        "resume analysis, career roadmaps, and job market intelligence. "
        "You provide actionable, data-driven, and personalized career guidance."
    )

    print("\n" + "="*60)
    print("  Career Intelligence GPT (Fine-Tuned)  ")
    print("  Type your question below. Type 'exit' to quit.")
    print("="*60 + "\n")

    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in ("exit", "quit", "q"):
            print("Goodbye!")
            break
        if not user_input:
            continue

        prompt = (
            f"[SYSTEM]\n{system_prompt}\n"
            f"[USER]\n{user_input}\n"
            f"[ASSISTANT]\n"
        )

        output = generator(prompt)[0]["generated_text"]
        # Extract only the assistant's reply
        reply = output.split("[ASSISTANT]\n")[-1].split("[END]")[0].strip()
        print(f"\nCareer Advisor: {reply}\n")


def main():
    parser = argparse.ArgumentParser(
        description="QLoRA fine-tuning & inference for Career Intelligence GPT"
    )
    parser.add_argument(
        "--mode",
        choices=["finetune", "inference"],
        required=True,
        help="'finetune' to train the model, 'inference' to chat with it"
    )
    args = parser.parse_args()

    if args.mode == "finetune":
        run_finetuning()
    else:
        run_inference()


if __name__ == "__main__":
    main()
