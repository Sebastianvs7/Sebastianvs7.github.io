<template>
  <h1 ref="titleRef" class="decrypted-text">
    <span v-for="(char, index) in displayText" :key="index" class="char">
      {{ char === " " ? "\u00A0" : char }}
    </span>
  </h1>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 1500, // Total duration in ms
  },
  characters: {
    type: String,
    default:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?",
  },
});

const titleRef = ref(null);
const displayText = ref("");
const isDecrypting = ref(false);

const getRandomChar = () => {
  return props.characters[Math.floor(Math.random() * props.characters.length)];
};

const decryptText = () => {
  if (!props.text) return;

  const targetText = props.text;
  const textLength = targetText.length;
  const iterations = 30; // Number of random character cycles
  const intervalTime = props.duration / iterations;

  isDecrypting.value = true;

  // Track which characters are revealed (random order for more realistic decrypt effect)
  const revealedIndices = new Set();
  const revealOrder = Array.from({ length: textLength }, (_, i) => i)
    .filter((i) => targetText[i] !== " ") // Exclude spaces from random reveal
    .sort(() => Math.random() - 0.5); // Random order

  // Initialize with random characters (keep spaces)
  displayText.value = targetText
    .split("")
    .map((char) => (char === " " ? " " : getRandomChar()))
    .join("");

  let iteration = 0;
  let revealIndex = 0;
  const decryptInterval = setInterval(() => {
    // Reveal characters in random order
    const revealProgress = iteration / iterations;
    const targetRevealCount = Math.floor(revealProgress * revealOrder.length);

    while (
      revealIndex < targetRevealCount &&
      revealIndex < revealOrder.length
    ) {
      revealedIndices.add(revealOrder[revealIndex]);
      revealIndex++;
    }

    // Update display text
    displayText.value = targetText
      .split("")
      .map((char, index) => {
        if (char === " ") {
          return " "; // Keep spaces
        } else if (revealedIndices.has(index)) {
          return char; // Character is revealed
        } else {
          return getRandomChar(); // Show random character
        }
      })
      .join("");

    iteration++;

    if (iteration >= iterations) {
      clearInterval(decryptInterval);
      // Ensure final text is correct
      displayText.value = targetText;
      isDecrypting.value = false;
    }
  }, intervalTime);
};

onMounted(() => {
  // Small delay to ensure component is mounted
  setTimeout(() => {
    decryptText();
  }, 100);
});

watch(
  () => props.text,
  () => {
    if (props.text) {
      decryptText();
    }
  }
);
</script>

<style scoped lang="scss">
.decrypted-text {
  color: inherit;
  font-family: "Playfair Display", serif;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.1;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }

  .char {
    display: inline-block;
    font-variant-numeric: tabular-nums;
    min-width: 0.5em; // Prevent layout shift for characters
    text-align: center;
  }
}
</style>
