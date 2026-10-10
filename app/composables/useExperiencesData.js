export const useExperiencesData = async () => {
  const { data: experiencesData } = await useAsyncData("experiences", () =>
    queryCollection("experiences").order("order", "ASC").all()
  );

  return {
    experiencesData,
  };
};
