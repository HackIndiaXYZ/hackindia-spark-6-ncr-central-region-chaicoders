"use client";

import { useEffect, useRef } from "react";

type MouseState = { x: number; y: number; radius: number };

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  color: string;
  private ctx: CanvasRenderingContext2D;
  private mouse: MouseState;

  constructor(ctx: CanvasRenderingContext2D, mouse: MouseState, x: number, y: number) {
    this.ctx = ctx;
    this.mouse = mouse;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1.5;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 40 + 5;
    this.color = Math.random() > 0.5 ? "rgba(0, 240, 255, 0.6)" : "rgba(138, 43, 226, 0.6)";
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  update() {
    const dx = this.mouse.x - this.x;
    const dy = this.mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = this.mouse.radius;
    const force = (maxDistance - distance) / maxDistance;
    const directionX = forceDirectionX * force * this.density;
    const directionY = forceDirectionY * force * this.density;

    if (distance < this.mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        const dxFromBase = this.x - this.baseX;
        this.x -= dxFromBase / 15;
      }
      if (this.y !== this.baseY) {
        const dyFromBase = this.y - this.baseY;
        this.y -= dyFromBase / 15;
      }
    }
  }
}

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0, radius: 150 };

    const init = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 4000;
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(ctx, mouse, x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-100"
      style={{ filter: "blur(2px)" }}
    />
  );
}
