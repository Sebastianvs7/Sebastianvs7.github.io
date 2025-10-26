export const useProjectsData = async () => {
  const { locale } = useI18n();

  // Determine which collection to use based on locale
  const collectionName = locale.value === "en" ? "projectsEn" : "projectsCs";

  // Query projects from markdown files using Nuxt Content
  // Remove database-level ordering to avoid SQLite errors
  const { data: projects } = await useAsyncData(
    `projects-all-${locale.value}`,
    () => queryCollection(collectionName).all()
  );

  // Transform the data to match the expected format
  const projectsData = computed(() => {
    if (!projects.value) return [];

    // Sort by position in JavaScript instead of database
    const sortedProjects = [...projects.value].sort(
      (a, b) => (a.meta.position || 0) - (b.meta.position || 0)
    );

    return sortedProjects.map((project) => {
      // Extract slug from path (e.g., "cs/projects/zoeto" -> "zoeto")
      const pathParts = project.path.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const slug = fileName.replace(".md", "");

      return {
        id: slug,
        slug: slug,
        title: project.title,
        description: project.description,
        link: project.meta.link,
        links: project.meta.links,
        image: project.meta.image,
        position: project.meta.position,
        type: project.meta.type,
        // Include the full markdown content for ContentRenderer
        _content: project.body,
      };
    });
  });

  return {
    projectsData,
  };
};
