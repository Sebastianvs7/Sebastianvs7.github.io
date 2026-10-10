export const useProjectsData = async () => {
  const { locale } = useI18n();

  // Determine which collection to use based on locale
  const collectionName = locale.value === "en" ? "projectsEn" : "projectsCs";

  const { data: projects } = await useAsyncData(
    `projects-all-${locale.value}`,
    () => queryCollection(collectionName).order("position", "ASC").all()
  );

  // Transform the data to match the expected format
  const projectsData = computed(() =>
    (projects.value ?? []).map((project) => {
      // Extract slug from path (e.g., "/cs/projects/zoeto" -> "zoeto")
      const slug = project.path.split("/").pop();

      return {
        id: slug,
        slug,
        title: project.title,
        description: project.description,
        link: project.link,
        links: project.links,
        image: project.image,
      };
    })
  );

  return {
    projectsData,
  };
};
