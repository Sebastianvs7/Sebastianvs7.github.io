import type { ProjectSummary } from "~/types/project";

interface ProjectsData {
  projectsData: ComputedRef<ProjectSummary[]>;
}

export const useProjectsData = async (): Promise<ProjectsData> => {
  const { locale } = useI18n();

  // Determine which collection to use based on locale
  const collectionName = locale.value === "en" ? "projectsEn" : "projectsCs";

  const { data: projects } = await useAsyncData(
    `projects-all-${locale.value}`,
    () => queryCollection(collectionName).order("position", "ASC").all()
  );

  const projectsData = computed(() =>
    (projects.value ?? []).map((project) => ({
      description: project.description,
      image: project.image,
      link: project.link,
      links: project.links,
      // Last path segment, e.g. "/cs/projects/zoeto" -> "zoeto"
      slug: project.path.split("/").at(-1) ?? project.path,
      title: project.title,
    }))
  );

  return {
    projectsData,
  };
};
