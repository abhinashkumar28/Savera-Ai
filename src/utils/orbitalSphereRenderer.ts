export interface OrbitalSphereOptions {
  hue: number;
  particleCount: number;
  ringCount: number;
  sphereRadius: number;
  rotationSpeed: number;
  particleSize: number;
  ringOpacity: number;
  particleOpacity: number;
  bgColor: string;
  glowIntensity: number;
  nodeCount: number;
  nodeSize: number;
}

export const ORBITAL_SPHERE_DEFAULTS: OrbitalSphereOptions = {
  hue: 35,
  particleCount: 180,
  ringCount: 5,
  sphereRadius: 160,
  rotationSpeed: 0.003,
  particleSize: 1.8,
  ringOpacity: 0.15,
  particleOpacity: 0.7,
  bgColor: "#080b14",
  glowIntensity: 0.4,
  nodeCount: 12,
  nodeSize: 3,
};

interface Particle {
  theta: number;
  phi: number;
  speed: number;
  radius: number;
  size: number;
  opacity: number;
}

interface Ring {
  radius: number;
  tilt: number;
  rotation: number;
  speed: number;
  opacity: number;
}

interface Node {
  theta: number;
  phi: number;
  pulse: number;
  pulseSpeed: number;
  size: number;
}

export interface OrbitalSphereRenderer {
  resize: (w: number, h: number) => void;
  render: () => void;
  dispose: () => void;
}

export function createOrbitalSphereRenderer(
  canvas: HTMLCanvasElement,
  getOptions: () => OrbitalSphereOptions,
): OrbitalSphereRenderer {
  const ctx = canvas.getContext("2d")!;
  if (!ctx) throw new Error("Canvas 2D context not available");

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;
  let time = 0;
  let animId = 0;

  // Initialize particles
  const opts = getOptions();
  const particles: Particle[] = [];
  const rings: Ring[] = [];
  const nodes: Node[] = [];

  function initParticles() {
    const o = getOptions();
    particles.length = 0;
    for (let i = 0; i < o.particleCount; i++) {
      particles.push({
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(2 * Math.random() - 1),
        speed: (Math.random() - 0.5) * 0.01,
        radius: o.sphereRadius * (0.85 + Math.random() * 0.3),
        size: o.particleSize * (0.5 + Math.random()),
        opacity: o.particleOpacity * (0.3 + Math.random() * 0.7),
      });
    }
    rings.length = 0;
    for (let i = 0; i < o.ringCount; i++) {
      rings.push({
        radius: o.sphereRadius * (0.6 + i * 0.18),
        tilt: (Math.random() - 0.5) * 1.2,
        rotation: Math.random() * Math.PI * 2,
        speed: (Math.random() - 0.5) * 0.005,
        opacity: o.ringOpacity * (0.5 + Math.random() * 0.5),
      });
    }
    nodes.length = 0;
    for (let i = 0; i < o.nodeCount; i++) {
      nodes.push({
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(2 * Math.random() - 1),
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        size: o.nodeSize * (0.8 + Math.random() * 0.4),
      });
    }
  }

  initParticles();

  function project(
    x: number,
    y: number,
    z: number,
  ): { x: number; y: number; z: number; scale: number } {
    const perspective = 600;
    const scale = perspective / (perspective + z);
    return {
      x: x * scale + width / 2,
      y: y * scale + height / 2,
      z,
      scale,
    };
  }

  function rotateY(x: number, y: number, z: number, angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { x: x * cos - z * sin, y, z: x * sin + z * cos };
  }

  function rotateX(x: number, y: number, z: number, angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { x, y: y * cos - z * sin, z: y * sin + z * cos };
  }

  function render() {
    const o = getOptions();
    time += 1;

    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    // Background gradient
    const bgGrad = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * 0.6,
    );
    bgGrad.addColorStop(0, `hsla(${o.hue}, 30%, 8%, 1)`);
    bgGrad.addColorStop(1, o.bgColor);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const rotAngle = time * o.rotationSpeed;

    // Draw rings
    for (const ring of rings) {
      ring.rotation += ring.speed;
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${o.hue}, 60%, 55%, ${ring.opacity})`;
      ctx.lineWidth = 1;

      const segments = 80;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        let x = Math.cos(angle) * ring.radius;
        let y = 0;
        let z = Math.sin(angle) * ring.radius;

        // Apply tilt
        const tilted = rotateX(x, y, z, ring.tilt);
        const rotated = rotateY(tilted.x, tilted.y, tilted.z, rotAngle + ring.rotation);
        const p = project(rotated.x, rotated.y, rotated.z);

        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Draw particles (sorted by z for depth)
    const projectedParticles = particles.map((p) => {
      p.theta += p.speed;
      let x = Math.sin(p.phi) * Math.cos(p.theta) * p.radius;
      let y = Math.cos(p.phi) * p.radius;
      let z = Math.sin(p.phi) * Math.sin(p.theta) * p.radius;

      const rotated = rotateY(x, y, z, rotAngle);
      const proj = project(rotated.x, rotated.y, rotated.z);
      return { ...proj, particle: p };
    });

    projectedParticles.sort((a, b) => a.z - b.z);

    for (const pp of projectedParticles) {
      const depthFade = (pp.z + 200) / 400;
      const alpha = pp.particle.opacity * Math.max(0.1, Math.min(1, depthFade));
      const size = pp.particle.size * pp.scale;

      ctx.beginPath();
      ctx.arc(pp.x, pp.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${o.hue}, 70%, 65%, ${alpha})`;
      ctx.fill();

      // Glow
      if (o.glowIntensity > 0 && size > 1.5) {
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${o.hue}, 60%, 55%, ${alpha * o.glowIntensity * 0.3})`;
        ctx.fill();
      }
    }

    // Draw data nodes (brighter, pulsing)
    for (const node of nodes) {
      node.pulse += node.pulseSpeed;
      const pulseFactor = 0.7 + Math.sin(node.pulse) * 0.3;

      let x = Math.sin(node.phi) * Math.cos(node.theta) * o.sphereRadius;
      let y = Math.cos(node.phi) * o.sphereRadius;
      let z = Math.sin(node.phi) * Math.sin(node.theta) * o.sphereRadius;

      const rotated = rotateY(x, y, z, rotAngle);
      const p = project(rotated.x, rotated.y, rotated.z);
      const size = node.size * p.scale * pulseFactor;

      // Outer glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${o.hue + 20}, 80%, 60%, ${0.08 * pulseFactor})`;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${o.hue + 10}, 80%, 75%, ${0.9 * pulseFactor})`;
      ctx.fill();
    }

    // Center glow
    const centerGlow = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, o.sphereRadius * 0.5,
    );
    centerGlow.addColorStop(0, `hsla(${o.hue}, 50%, 50%, 0.06)`);
    centerGlow.addColorStop(1, `hsla(${o.hue}, 50%, 50%, 0)`);
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  function resize(w: number, h: number) {
    dpr = window.devicePixelRatio || 1;
    width = w;
    height = h;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }

  function dispose() {
    if (animId) cancelAnimationFrame(animId);
    particles.length = 0;
    rings.length = 0;
    nodes.length = 0;
  }

  return { resize, render, dispose };
}
