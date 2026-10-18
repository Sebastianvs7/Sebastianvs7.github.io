import type { gsap as GsapInstance } from "gsap";

const PARTICLE_COUNT = 10;

interface MagicBento {
  cardRef: Ref<HTMLElement | null>;
}

// Look lives in project-card.scss, only the position is set here
const createParticleElement = (x: number, y: number): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "magic-particle";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  return el;
};

// Glow, tilt, particles and click ripple on a hovered card
export const useMagicBento = (): MagicBento => {
  const cardRef = ref<HTMLElement | null>(null);

  // Imperative effect state, never rendered
  let particles: HTMLElement[] = [];
  let timeouts: ReturnType<typeof setTimeout>[] = [];
  let isHovered = false;
  let particleTemplates: HTMLElement[] = [];
  let particlesInitialized = false;
  // Set on mount before any listener, and particles only exist after that
  let gsap!: typeof GsapInstance;

  const initializeParticles = () => {
    if (particlesInitialized || !cardRef.value) return;
    const { width, height } = cardRef.value.getBoundingClientRect();
    particleTemplates = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticleElement(Math.random() * width, Math.random() * height)
    );
    particlesInitialized = true;
  };

  const clearAllParticles = () => {
    timeouts.forEach(clearTimeout);
    timeouts = [];
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
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let removeListeners: (() => void) | undefined;

  onMounted(async () => {
    if (!cardRef.value || !shouldAnimate()) return;
    // Loaded only for hovering pointers, so touch devices never download it
    gsap = (await import("gsap")).gsap;
    // The card may unmount while GSAP loads
    if (!cardRef.value) return;
    const element = cardRef.value;

    const handleMouseEnter = () => {
      isHovered = true;
      animateParticles();
      gsap.to(element, {
        rotateX: 5,
        rotateY: 5,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      isHovered = false;
      clearAllParticles();
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: "power2.out",
      });
      element.style.setProperty("--glow-intensity", "0");
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      updateGlowProperties(e.clientX, e.clientY);
      element.style.setProperty("--glow-intensity", "1");

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      gsap.to(element, {
        rotateX,
        rotateY,
        duration: 0.1,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const handleClick = (e: MouseEvent) => {
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
      ripple.className = "magic-ripple";
      ripple.style.width = `${maxDistance * 2}px`;
      ripple.style.height = `${maxDistance * 2}px`;
      ripple.style.left = `${x - maxDistance}px`;
      ripple.style.top = `${y - maxDistance}px`;
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
