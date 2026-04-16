# 🧠 Career Intelligence GPT — Fine-Tuning & Quantization

This folder contains everything you need to fine-tune an open-source LLM (Mistral-7B or Llama-3-8B) on career intelligence data using **QLoRA** — a method that makes GPU-intensive training possible on consumer hardware or a **free Google Colab T4 GPU**.

---

## 📁 Files

| File | Purpose |
|---|---|
| `career_training_data.jsonl` | 20 high-quality training examples (resume analysis, career roadmaps, scholarships, job markets) |
| `quantize.py` | Full pipeline: load 4-bit model → apply LoRA → fine-tune → chat |

---

## ⚙️ Setup

```bash
# 1. Install dependencies (run once)
pip install transformers peft bitsandbytes datasets accelerate trl

# 2. (Optional) Log into HuggingFace if using Llama 3 (gated model)
huggingface-cli login
```

> **Mistral-7B** is publicly accessible with no login required. Recommended for beginners.

---

## 🚀 How to Run

### Step 1 — Fine-tune the model
```bash
cd fine_tuning
python quantize.py --mode finetune
```
- Downloads Mistral-7B in **4-bit quantized** form (~4-5 GB GPU RAM)
- Trains LoRA adapters on `career_training_data.jsonl`
- Saves adapter weights to `./career-gpt-qlora/`
- Takes ~10-20 minutes on Colab T4 / ~5 minutes on RTX 3090

### Step 2 — Chat with your fine-tuned model
```bash
python quantize.py --mode inference
```
- Loads the base model + your LoRA weights
- Opens an interactive chat loop
- Ask it career questions to test quality

---

## 🔢 What Quantization Does

| Without Quantization | With 4-bit (NF4) Quantization |
|---|---|
| 7B model = **~14 GB** VRAM | 7B model = **~4-5 GB** VRAM |
| Requires A100 / H100 | Runs on RTX 3060 / Colab T4 |
| Full float32 precision | NormalFloat4 — near full accuracy |

The script uses **double quantization** for an extra ~0.4 bits/param saving.

---

## 🪢 What LoRA Does

Instead of training all 7 billion parameters (too slow, too expensive), LoRA injects small **adapter matrices** into the attention layers. Only ~20 million parameters are trained — a **99.7% reduction** — while keeping the base model frozen.

---

## ☁️ Running on Google Colab (Free GPU)

1. Open a new [Google Colab](https://colab.research.google.com) notebook
2. Set runtime: `Runtime → Change runtime type → T4 GPU`
3. Upload `career_training_data.jsonl` and `quantize.py`
4. Run the setup and fine-tuning commands above in cells

---

## ➕ Adding More Training Data

Each line in `career_training_data.jsonl` follows this format:
```json
{"messages": [
  {"role": "system", "content": "You are an expert career advisor..."},
  {"role": "user", "content": "Your question here"},
  {"role": "assistant", "content": "The ideal answer here"}
]}
```
Add more examples to improve the model's knowledge on specific topics (e.g., more scholarship data, salary negotiation, resume rewrites). **50-100 examples** is the recommended minimum for visible improvement.

---

## 🔗 Integration with Next.js App

Once fine-tuned, you have two options:
1. **Host locally**: Use `Ollama` or `LM Studio` to serve the model on `localhost:11434`, then call it from your Next.js API routes
2. **Upload to HuggingFace**: Push weights and use the HuggingFace Inference API as a hosted endpoint
