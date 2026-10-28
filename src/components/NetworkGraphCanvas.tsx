import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  z: number;
  radius: number;
  baseRadius: number;
  label: string;
  connections: number[];
  pulsePhase: number;
  pulseSpeed: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  isCentral: boolean;
  opacity: number;
}

interface Connection {
  from: number;
  to: number;
  pulseOffset: number;
  pulseSpeed: number;
  opacity: number;
}

interface Particle {
  connectionIndex: number;
  progress: number;
  speed: number;
  size: number;
}

const COLORS = {
  bg: "#15370D",
  bgDeep: "#0d2408",
  sage: "#728E6D",
  gold: "#E5CD82",
  goldLight: "#FFF2B4",
  text: "#f0ead6",
};

export default function NetworkGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Initialize nodes
    const initGraph = () => {
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) * 0.35;

      const nodes: Node[] = [
        // Central node - Energy Intelligence
        {
          x: centerX,
          y: centerY,
          z: 0,
          radius: 28,
          baseRadius: 28,
          label: "Savera AI",
          connections: [1, 2, 3, 4, 5, 6],
          pulsePhase: 0,
          pulseSpeed: 0.02,
          orbitRadius: 0,
          orbitSpeed: 0,
          orbitAngle: 0,
          isCentral: true,
          opacity: 1,
        },
        // Building A
        {
          x: centerX,
          y: centerY,
          z: 0,
          radius: 14,
          baseRadius: 14,
          label: "Building A",
          connections: [0, 3],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.03,
          orbitRadius: scale * 0.5,
          orbitSpeed: 0.003,
          orbitAngle: 0,
          isCentral: false,
          opacity: 0.9,
        },
        // Building B
        {
          x: centerX,
          y: centerY,
          z: 0,
          radius: 14,
          baseRadius: 14,
          label: "Building B",
          connections: [0, 4],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.025,
          orbitRadius: scale * 0.55,
          orbitSpeed: 0.0025,
          orbitAngle: (Math.PI * 2) / 6,
          isCentral: false,
          opacity: 0.9,
        },
        // Anomaly Detection
        {
          x: centerX,
          y: centerY,
          z: 0,
          radius: 12,
          baseRadius: 12,
          label: "Anomaly Detection",
          connections: [0, 1, 5],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.035,
          orbitRadius: scale * 0.7,
          orbitSpeed: 0.002,
          orbitAngle: (Math.PI * 2 * 2) / 6,
          isCentral: false,
          opacity: 0.85,
        },
        // Forecasting
        {
          x: centerX,
          y: centerY,
          z: 0,
          radius: 12,
          baseRadius: 12,
          label: "Forecasting",
          connections: [0, 2, 6],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.028,
          orbitRadius: scale * 0.75,
          orbitSpeed: 0.0018,
          orbitAngle: (Math.PI * 2 * 3) / 6,
          isCentral: false,
          opacity: 0.85,
        },
        // SMS Alerts
        {
          x: centerX,
          y: centerY,
          z: 0,
          radius: 10,
          baseRadius: 10,
          label: "SMS Alerts",
          connections: [0, 3],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.04,
          orbitRadius: scale * 0.9,
          orbitSpeed: 0.0015,
          orbitAngle: (Math.PI * 2 * 4) / 6,
          isCentral: false,
          opacity: 0.8,
        },
        // Savings
        {
          x: centerX,
          y: centerY,
          z: 0,
          radius: 10,
          baseRadius: 10,
          label: "Savings",
          connections: [0, 4],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.032,
          orbitRadius: scale * 0.85,
          orbitSpeed: 0.0022,
          orbitAngle: (Math.PI * 2 * 5) / 6,
          isCentral: false,
          opacity: 0.8,
        },
      ];

      // Create connections
      const connections: Connection[] = [];
      const connectionSet = new Set<string>();

      nodes.forEach((node, nodeIndex) => {
        node.connections.forEach((targetIndex) => {
          const key = [Math.min(nodeIndex, targetIndex), Math.max(nodeIndex, targetIndex)].join("-");
          if (!connectionSet.has(key)) {
            connectionSet.add(key);
            connections.push({
              from: nodeIndex,
              to: targetIndex,
              pulseOffset: Math.random() * Math.PI * 2,
              pulseSpeed: 0.02 + Math.random() * 0.02,
              opacity: 0.3 + Math.random() * 0.3,
            });
          }
        });
      });

      // Create particles traveling along connections
      const particles: Particle[] = [];
      for (let i = 0; i < 15; i++) {
        particles.push({
          connectionIndex: Math.floor(Math.random() * connections.length),
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          size: 2 + Math.random() * 2,
        });
      }

      nodesRef.current = nodes;
      connectionsRef.current = connections;
      particlesRef.current = particles;
    };

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initGraph();
    };

    const drawNode = (node: Node, time: number) => {
      if (!ctx) return;

      // Update position for orbiting nodes
      if (!node.isCentral) {
        node.orbitAngle += node.orbitSpeed;
        node.x = width / 2 + Math.cos(node.orbitAngle) * node.orbitRadius;
        node.y = height / 2 + Math.sin(node.orbitAngle) * node.orbitRadius * 0.6;
      }

      // Pulse effect
      node.pulsePhase += node.pulseSpeed;
      const pulse = Math.sin(node.pulsePhase) * 0.3 + 1;
      const currentRadius = node.baseRadius * pulse;

      // Outer glow
      const glowRadius = currentRadius * (node.isCentral ? 4 : 2.5);
      const glowGradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, glowRadius
      );

      if (node.isCentral) {
        glowGradient.addColorStop(0, `rgba(229, 205, 130, ${0.4 * node.opacity})`);
        glowGradient.addColorStop(0.3, `rgba(229, 205, 130, ${0.15 * node.opacity})`);
        glowGradient.addColorStop(1, "rgba(229, 205, 130, 0)");
      } else {
        glowGradient.addColorStop(0, `rgba(114, 142, 109, ${0.3 * node.opacity})`);
        glowGradient.addColorStop(0.5, `rgba(114, 142, 109, ${0.1 * node.opacity})`);
        glowGradient.addColorStop(1, "rgba(114, 142, 109, 0)");
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Core node
      const coreGradient = ctx.createRadialGradient(
        node.x - currentRadius * 0.3, node.y - currentRadius * 0.3, 0,
        node.x, node.y, currentRadius
      );

      if (node.isCentral) {
        coreGradient.addColorStop(0, COLORS.goldLight);
        coreGradient.addColorStop(0.6, COLORS.gold);
        coreGradient.addColorStop(1, COLORS.gold);
      } else {
        coreGradient.addColorStop(0, COLORS.sage);
        coreGradient.addColorStop(1, `rgba(114, 142, 109, 0.7)`);
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Border
      ctx.strokeStyle = node.isCentral
        ? `rgba(255, 242, 180, ${0.8 * node.opacity})`
        : `rgba(229, 205, 130, ${0.4 * node.opacity})`;
      ctx.lineWidth = node.isCentral ? 2 : 1;
      ctx.stroke();

      // Label
      if (node.isCentral || currentRadius > 10) {
        ctx.font = node.isCentral ? "bold 14px Inter, sans-serif" : "11px Inter, sans-serif";
        ctx.fillStyle = node.isCentral ? COLORS.goldLight : COLORS.text;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.label, node.x, node.y + currentRadius + 8);
      }
    };

    const drawConnection = (conn: Connection, time: number) => {
      if (!ctx) return;

      const fromNode = nodesRef.current[conn.from];
      const toNode = nodesRef.current[conn.to];
      if (!fromNode || !toNode) return;

      // Pulsing opacity
      conn.pulseOffset += conn.pulseSpeed;
      const pulse = (Math.sin(conn.pulseOffset) + 1) / 2;
      const currentOpacity = conn.opacity * (0.5 + pulse * 0.5);

      // Draw connection line
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = `rgba(229, 205, 130, ${currentOpacity * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw glow along the line
      const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
      gradient.addColorStop(0, `rgba(229, 205, 130, 0)`);
      gradient.addColorStop(0.5, `rgba(229, 205, 130, ${currentOpacity * 0.2})`);
      gradient.addColorStop(1, `rgba(229, 205, 130, 0)`);

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.stroke();
    };

    const drawParticle = (particle: Particle) => {
      if (!ctx) return;

      const conn = connectionsRef.current[particle.connectionIndex];
      if (!conn) return;

      const fromNode = nodesRef.current[conn.from];
      const toNode = nodesRef.current[conn.to];
      if (!fromNode || !toNode) return;

      // Interpolate position
      const x = fromNode.x + (toNode.x - fromNode.x) * particle.progress;
      const y = fromNode.y + (toNode.y - fromNode.y) * particle.progress;

      // Draw particle glow
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 3);
      glowGradient.addColorStop(0, `rgba(255, 242, 180, 0.8)`);
      glowGradient.addColorStop(0.5, `rgba(229, 205, 130, 0.4)`);
      glowGradient.addColorStop(1, "rgba(229, 205, 130, 0)");

      ctx.beginPath();
      ctx.arc(x, y, particle.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Draw particle core
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.goldLight;
      ctx.fill();

      // Update progress
      particle.progress += particle.speed;
      if (particle.progress > 1) {
        particle.progress = 0;
        particle.connectionIndex = Math.floor(Math.random() * connectionsRef.current.length);
      }
    };

    const render = () => {
      if (!ctx) return;

      timeRef.current += 1;
      const time = timeRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.7
      );
      bgGradient.addColorStop(0, "#1a4210");
      bgGradient.addColorStop(0.5, COLORS.bg);
      bgGradient.addColorStop(1, COLORS.bgDeep);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw connections first (behind nodes)
      connectionsRef.current.forEach((conn) => drawConnection(conn, time));

      // Draw particles
      particlesRef.current.forEach((particle) => drawParticle(particle));

      // Draw nodes
      nodesRef.current.forEach((node) => drawNode(node, time));

      animationRef.current = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="network-graph-canvas absolute inset-0 w-full h-full"
      style={{ backgroundColor: COLORS.bgDeep }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
