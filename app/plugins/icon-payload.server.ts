// @nuxt/icon stores every SSR-rendered icon in the payload, but the client bundle
// already has them all (icon.clientBundle), so they would be downloaded twice
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook("app:rendered", () => {
    nuxtApp.payload.data = Object.fromEntries(
      Object.entries(nuxtApp.payload.data).filter(
        ([key]) => !key.startsWith("i-")
      )
    );
  });
});
