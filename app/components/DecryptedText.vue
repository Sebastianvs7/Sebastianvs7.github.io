<template>
  <h1 class="decrypted-text" :aria-label="text">
    <span
      v-for="(char, index) in displayText"
      :key="index"
      class="char"
      aria-hidden="true"
    >
      {{ char === " " ? "\u00A0" : char }}
    </span>
  </h1>
</template>

<script setup lang="ts">
interface DecryptedTextProps {
  characters?: string;
  // Total duration in ms
  duration?: number;
  text: string;
}

const props = withDefaults(defineProps<DecryptedTextProps>(), {
  characters:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?",
  duration: 1500,
});

const ITERATIONS = 30; // Number of random character cycles

// Start with the real text so the server render contains the actual title
const displayText = ref(props.text);
let decryptInterval: ReturnType<typeof setInterval> | undefined;

const getRandomChar = () => {
  return props.characters[Math.floor(Math.random() * props.characters.length)];
};

const scramble = (targetText: string, revealedIndices: Set<number>) => {
  return targetText
    .split("")
    .map((char, index) =>
      char === " " || revealedIndices.has(index) ? char : getRandomChar()
    )
    .join("");
};

const decryptText = () => {
  clearInterval(decryptInterval);

  const targetText = props.text;
  if (!targetText) return;

  // Reveal characters in random order, spaces stay in place
  const revealOrder = Array.from({ length: targetText.length }, (_, i) => i)
    .filter((i) => targetText[i] !== " ")
    .sort(() => Math.random() - 0.5);
  const revealedIndices = new Set<number>();

  displayText.value = scramble(targetText, revealedIndices);

  let iteration = 0;
  decryptInterval = setInterval(() => {
    iteration++;

    const targetRevealCount = Math.floor(
      (iteration / ITERATIONS) * revealOrder.length
    );
    revealOrder
      .slice(revealedIndices.size, targetRevealCount)
      .forEach((index) => revealedIndices.add(index));

    if (iteration >= ITERATIONS) {
      clearInterval(decryptInterval);
      displayText.value = targetText;
      return;
    }

    displayText.value = scramble(targetText, revealedIndices);
  }, props.duration / ITERATIONS);
};

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealText = () => {
  if (prefersReducedMotion()) {
    displayText.value = props.text;
    return;
  }

  decryptText();
};

onMounted(revealText);
onBeforeUnmount(() => clearInterval(decryptInterval));

watch(() => props.text, revealText);
</script>

<style scoped lang="scss" src="./decrypted-text.scss"></style>
