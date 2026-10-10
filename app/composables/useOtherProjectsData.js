export const useOtherProjectsData = async () => {
  const { data: otherProjects } = await useAsyncData("other-projects", () =>
    queryCollection("otherProjects").order("order", "ASC").all()
  );

  // Shape expected by LogoLoop
  const logos = computed(() =>
    (otherProjects.value ?? []).map((project) => ({
      src: project.logo,
      alt: project.name,
      href: project.url,
      title: project.name,
    }))
  );

  return {
    logos,
  };
};
