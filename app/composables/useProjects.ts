import type { ProjectSummary } from "~/types/project";

interface ProjectsData {
  projects: ComputedRef<ProjectSummary[]>;
}

export const useProjects = async (): Promise<ProjectsData> => {
  const { locale, t } = useI18n();

  const { data } = await useAsyncData(`projects-all-${locale.value}`, () =>
    queryCollection(getProjectsCollection(locale.value))
      .order("position", "ASC")
      .all()
  );

  const projects = computed(() =>
    (data.value ?? []).map((project) => ({
      description: project.description,
      image: project.image,
      // A single link gets a generic label, several carry their own
      links:
        project.links ??
        (project.link
          ? [{ text: t("projects.viewProject"), url: project.link }]
          : []),
      role: project.role,
      // Last path segment, e.g. "/cs/projects/zoeto" -> "zoeto"
      slug: project.path.split("/").at(-1) ?? project.path,
      tags: project.tags,
      title: project.title,
      type: project.type,
    }))
  );

  return {
    projects,
  };
};
