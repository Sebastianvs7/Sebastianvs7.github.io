<template>
  <header>
    <nav class="desktop-menu" :aria-label="$t('navigation.primaryLabel')">
      <HeaderNavItems />
    </nav>

    <button
      id="menu-toggle"
      type="button"
      :class="{ open: isMobileMenuOpen }"
      :aria-label="$t('navigation.toggleMenu')"
      :aria-expanded="isMobileMenuOpen"
      aria-controls="mobile-menu"
      @click="toggleMobileMenu"
    >
      <div></div>
      <div></div>
      <div></div>
    </button>

    <nav
      id="mobile-menu"
      class="mobile-menu"
      :class="{ open: isMobileMenuOpen }"
      :aria-label="$t('navigation.mobileLabel')"
      :aria-hidden="!isMobileMenuOpen"
    >
      <HeaderNavItems @navigate="closeMobileMenu" />
    </nav>
  </header>
</template>

<script setup>
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<style scoped lang="scss" src="./header.scss"></style>
