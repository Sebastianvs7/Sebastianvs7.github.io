import type { ExperiencesCollectionItem } from "@nuxt/content";

interface ExperiencesData {
  experiences: Ref<ExperiencesCollectionItem[] | undefined>;
}

export const useExperiences = async (): Promise<ExperiencesData> => {
  const { data: experiences } = await useAsyncData("experiences", () =>
    queryCollection("experiences").order("order", "ASC").all()
  );

  return {
    experiences,
  };
};
