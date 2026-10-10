import type { LogoLoopItem } from "~/types/logo-loop";

interface OtherProjectsData {
  logos: ComputedRef<LogoLoopItem[]>;
}

export const useOtherProjectsData = async (): Promise<OtherProjectsData> => {
  const { data: otherProjects } = await useAsyncData("other-projects", () =>
    queryCollection("otherProjects").order("order", "ASC").all()
  );

  const logos = computed(() =>
    (otherProjects.value ?? []).map((project) => ({
      alt: project.name,
      href: project.url,
      src: project.logo,
      title: project.name,
    }))
  );

  return {
    logos,
  };
};
