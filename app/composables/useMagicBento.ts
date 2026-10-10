import { gsap } from "gsap";

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_GLOW_COLOR = "122, 104, 83"; // Using site accent color

export interface MagicBentoOptions {
  clickEffect?: boolean;
  disableAnimations?: boolean;
  enableMagnetism?: boolean;
  enableTilt?: boolean;
  // RGB triplet, e.g. "122, 104, 83"
  glowColor?: string;
  particleCount?: number;
}

interface MagicBento {
  cardRef: Ref<HTMLElement | null>;
}

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "magic-particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

export const useMagicBento = (options: MagicBentoOptions = {}): MagicBento => {
  const {
    particleCount = DEFAULT_PARTICLE_COUNT,
    glowColor = DEFAULT_GLOW_COLOR,
    enableTilt = true,
    clickEffect = true,
    enableMagnetism = false,
    disableAnimations = false,
  } = options;

  const cardRef = ref<HTMLElement | null>(null);

  // Imperative effect state, never rendered
  let particles: HTMLElement[] = [];
  let timeouts: ReturnType<typeof setTimeout>[] = [];
  let isHovered = false;
  let particleTemplates: HTMLElement[] = [];
  let particlesInitialized = false;
  let magnetismTween: gsap.core.Tween | null = null;

  const initializeParticles = () => {
    if (particlesInitialized || !cardRef.value) return;
    const { width, height } = cardRef.value.getBoundingClientRect();
    particleTemplates = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      )
    );
    particlesInitialized = true;
  };

  const clearAllParticles = () => {
    timeouts.forEach(clearTimeout);
    timeouts = [];
    magnetismTween?.kill();
    particles.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        },
      });
    });
    particles = [];
  };

  const animateParticles = () => {
    if (!cardRef.value || !isHovered) return;
    if (!particlesInitialized) {
      initializeParticles();
    }
    particleTemplates.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHovered || !cardRef.value) return;
        const clone = particle.cloneNode(true) as HTMLElement;
        cardRef.value.appendChild(clone);
        particles.push(clone);
        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);
      timeouts.push(timeoutId);
    });
  };

  const updateGlowProperties = (mouseX: number, mouseY: number) => {
    if (!cardRef.value) return;
    const rect = cardRef.value.getBoundingClientRect();
    const relativeX = ((mouseX - rect.left) / rect.width) * 100;
    const relativeY = ((mouseY - rect.top) / rect.height) * 100;
    cardRef.value.style.setProperty("--glow-x", `${relativeX}%`);
    cardRef.value.style.setProperty("--glow-y", `${relativeY}%`);
  };

  // Effects need a hovering pointer and are skipped for users preferring reduced motion
  const shouldAnimate = () =>
    !disableAnimations &&
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let removeListeners: (() => void) | undefined;

  onMounted(() => {
    if (!cardRef.value || !shouldAnimate()) return;
    const element = cardRef.value;

    const handleMouseEnter = () => {
      isHovered = true;
      animateParticles();
      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };

    const handleMouseLeave = () => {
      isHovered = false;
      clearAllParticles();
      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
      element.style.setProperty("--glow-intensity", "0");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) {
        updateGlowProperties(e.clientX, e.clientY);
        element.style.setProperty("--glow-intensity", "1");
        return;
      }
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      updateGlowProperties(e.clientX, e.clientY);
      element.style.setProperty("--glow-intensity", "1");

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;
        magnetismTween = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.min(
        Math.max(
          Math.hypot(x, y),
          Math.hypot(x - rect.width, y),
          Math.hypot(x, y - rect.height),
          Math.hypot(x - rect.width, y - rect.height)
        ),
        60
      );
      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;
      element.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    removeListeners = () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
    };
  });

  onBeforeUnmount(() => {
    isHovered = false;
    removeListeners?.();
    clearAllParticles();
  });

  return {
    cardRef,
  };
};
