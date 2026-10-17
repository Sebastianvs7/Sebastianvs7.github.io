import type { SkillsCollectionItem } from "@nuxt/content";

interface SkillsData {
  skillsData: Ref<SkillsCollectionItem | null | undefined>;
}

export const useSkillsData = async (): Promise<SkillsData> => {
  const { data: skillsData } = await useAsyncData("skills", () =>
    queryCollection("skills").first()
  );

  return {
    skillsData,
  };
};
