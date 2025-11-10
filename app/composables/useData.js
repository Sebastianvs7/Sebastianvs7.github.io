// User data configuration
const data = {
  // Site information
  siteName: "Sebastian Šanda",
  siteDescription:
    "Portfolio of Sebastian Šanda - Web Developer specializing in modern, scalable web applications.",
  siteUrl: "https://www.sebastiansanda.cz",
  name: "Sebastian Šanda",
  email: "info@sebastiansanda.cz",
  linkedin: "https://linkedin.com/in/sebastian-sanda",
  github: "https://github.com/sebastianvs7",
};

export function useData() {
  const dataRef = ref(data);

  // Add error handling and ensure the data is always available
  const safeData = computed(() => {
    try {
      return dataRef.value || data;
    } catch (error) {
      console.warn("Error accessing data:", error);
      return data; // Fallback to static data
    }
  });

  return readonly(safeData.value);
}
