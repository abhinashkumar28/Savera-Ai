import { useEffect, useRef } from "react";
import {
  createOrbitalSphereRenderer,
  ORBITAL_SPHERE_DEFAULTS,
  type OrbitalSphereOptions,
} from "../utils/orbitalSphereRenderer";

export type OrbitalSphereBackgroundProps = Partial<OrbitalSphereOptions> & {
  className?: string;
};

export function OrbitalSphereBackground({
  className = "",
  ...props
}: OrbitalSphereBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef({ ...ORBITAL_SPHERE_DEFAULTS, ...props });

  optionsRef.current = { ...ORBITAL_SPHERE_DEFAULTS, ...props };

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    
    // Defensive check: ensure refs are available before proceeding
    if (!host || !canvas) {
      console.warn('OrbitalSphereBackground: refs not available');
      return undefined;
    }
    
    // Check if canvas context is available
    const testCtx = canvas.getContext('2d');
    if (!testCtx) {
      console.warn('OrbitalSphereBackground: canvas 2d context not available');
      return undefined;
    }

    const renderer = createOrbitalSphereRenderer(
      canvas,
      () => optionsRef.current,
    );

    let frame = 0;
    let visible = true;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      renderer.resize(bounds.width, bounds.height);
      renderer.render();
    };

    const tick = () => {
      renderer.render();
      frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !frame) frame = requestAnimationFrame(tick);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    resizeObserver.observe(host);
    intersection.observe(host);
    resize();
    frame = requestAnimationFrame(tick);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`threeui-background orbital-sphere absolute inset-0 w-full h-full${className ? ` ${className}` : ""}`}
      style={{ backgroundColor: '#080b14' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ filter: `hue-rotate(305deg)` }}
      />
    </div>
  );
}

export default OrbitalSphereBackground;
