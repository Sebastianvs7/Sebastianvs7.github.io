import type { ProjectsCsCollectionItem } from "@nuxt/content";

export const useProject = async (
  slug: string
): Promise<ProjectsCsCollectionItem> => {
  const { locale } = useI18n();

  const { data } = await useAsyncData(`projects-${slug}-${locale.value}`, () =>
    queryCollection(getProjectsCollection(locale.value))
      .path(`/${locale.value}/projects/${slug}`)
      .first()
  );

  if (!data.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
      fatal: true,
    });
  }

  return data.value;
};
