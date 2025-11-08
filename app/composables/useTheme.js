export const useTheme = () => {
  // SSR-safe initialization - always start with false for server rendering
  const isDark = ref(false);
  const isManualOverride = ref(false);
  let prefersDarkScheme = null;
  let systemThemeChangeHandler = null;

  // Initialize theme on client side
  const initializeTheme = () => {
    if (process.client) {
      prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

      // Always start with system preference
      isDark.value = prefersDarkScheme.matches;
      isManualOverride.value = false;

      applyTheme();
      startListening();
    }
  };

  const applyTheme = () => {
    if (process.client) {
      const theme = isDark.value ? "dark" : "light";

      if (theme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.content = theme === "dark" ? "#1e1e1e" : "#f5f0e6";
      }
    }
  };

  const getCurrentTheme = () => {
    return isDark.value ? "dark" : "light";
  };

  const getSystemTheme = () => {
    return prefersDarkScheme?.matches ? "dark" : "light";
  };

  const handleSystemThemeChange = (e) => {
    // Only respond to system changes if user hasn't manually overridden
    if (!isManualOverride.value) {
      isDark.value = e.matches;
      applyTheme();
    }
  };

  const toggleTheme = () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    isDark.value = newTheme === "dark";
    isManualOverride.value = true;
    applyTheme();
  };

  const startListening = () => {
    if (process.client && prefersDarkScheme) {
      systemThemeChangeHandler = handleSystemThemeChange.bind(this);
      prefersDarkScheme.addEventListener("change", systemThemeChangeHandler);
    }
  };

  const stopListening = () => {
    if (process.client && prefersDarkScheme && systemThemeChangeHandler) {
      prefersDarkScheme.removeEventListener("change", systemThemeChangeHandler);
    }
  };

  const getThemeIcon = computed(() => (isDark.value ? "☀️" : "🌙"));
  const getThemeLabel = computed(() =>
    isDark.value ? "Switch to light mode" : "Switch to dark mode"
  );

  // Cleanup on unmount
  onUnmounted(() => {
    stopListening();
  });

  return {
    isDark: readonly(isDark),
    toggleTheme,
    initializeTheme,
    getThemeIcon,
    getThemeLabel,
    getCurrentTheme,
    getSystemTheme,
  };
};
