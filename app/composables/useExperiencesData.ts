import type { ExperiencesCollectionItem } from "@nuxt/content";

interface ExperiencesData {
  experiencesData: Ref<ExperiencesCollectionItem[] | undefined>;
}

export const useExperiencesData = async (): Promise<ExperiencesData> => {
  const { data: experiencesData } = await useAsyncData("experiences", () =>
    queryCollection("experiences").order("order", "ASC").all()
  );

  return {
    experiencesData,
  };
};
