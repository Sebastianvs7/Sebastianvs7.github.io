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

<script setup>
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

const ITERATIONS = 30; // Number of random character cycles

// Start with the real text so the server render contains the actual title
const displayText = ref(props.text);
let decryptInterval;

const getRandomChar = () => {
  return props.characters[Math.floor(Math.random() * props.characters.length)];
};

const scramble = (targetText, revealedIndices) => {
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
  const revealedIndices = new Set();

  displayText.value = scramble(targetText, revealedIndices);

  let iteration = 0;
  decryptInterval = setInterval(() => {
    iteration++;

    const targetRevealCount = Math.floor(
      (iteration / ITERATIONS) * revealOrder.length
    );
    while (revealedIndices.size < targetRevealCount) {
      revealedIndices.add(revealOrder[revealedIndices.size]);
    }

    if (iteration >= ITERATIONS) {
      clearInterval(decryptInterval);
      displayText.value = targetText;
      return;
    }

    displayText.value = scramble(targetText, revealedIndices);
  }, props.duration / ITERATIONS);
};

onMounted(decryptText);
onBeforeUnmount(() => clearInterval(decryptInterval));

watch(() => props.text, decryptText);
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
