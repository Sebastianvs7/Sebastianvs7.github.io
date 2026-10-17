<template>
  <section id="skills" tabindex="-1" aria-labelledby="skills-title">
    <h2 id="skills-title">{{ $t("sections.skills") }}</h2>
    <div class="skills-groups">
      <div
        v-for="group in skillsData?.groups"
        :key="group.title.en"
        class="skills-group"
      >
        <h3>{{ group.title[locale] }}</h3>
        <ul class="tag-list">
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
    <p v-if="skillsData?.courses.length" class="skills-courses">
      <strong>{{ $t("skills.courses") }}:</strong>
      <template v-for="(course, index) in skillsData.courses" :key="course.name">
        {{ index > 0 ? ", " : " " }}
        <a
          v-if="course.url"
          :href="course.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ course.name }} ({{ course.provider }}, {{ course.year }})
        </a>
        <span v-else>
          {{ course.name }} ({{ course.provider }}, {{ course.year }})
        </span>
      </template>
    </p>
  </section>
</template>

<script setup lang="ts">
const { skillsData } = await useSkillsData();
const { locale } = useI18n();
</script>

<style scoped lang="scss" src="./skills.scss"></style>
