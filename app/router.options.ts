import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // detect same path, different locale
    const stripLocale = (path: string) =>
      path.replace(/^\/[a-z]{2}(\/|$)/, "/");

    if (stripLocale(to.fullPath) === stripLocale(from.fullPath)) {
      // prevents scroll reset when only locale changes
      return savedPosition || false;
    }

    // otherwise normal scroll behavior
    if (savedPosition) return savedPosition;
    return { top: 0, left: 0 };
  },
};
