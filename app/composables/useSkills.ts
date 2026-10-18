import type { SkillsCollectionItem } from "@nuxt/content";

interface SkillsData {
  skills: Ref<SkillsCollectionItem | null | undefined>;
}

export const useSkills = async (): Promise<SkillsData> => {
  const { data: skills } = await useAsyncData("skills", () =>
    queryCollection("skills").first()
  );

  return {
    skills,
  };
};
