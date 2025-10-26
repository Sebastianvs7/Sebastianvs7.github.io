<template>
  <section id="experiences" tabindex="-1" aria-label="Working Experiences">
    <div class="experiences-header">
      <h2>{{ $t("sections.experience") }}</h2>
    </div>

    <div class="experiences-timeline">
      <div class="timeline-line"></div>
      <div
        v-for="(experience, index) in experiencesData"
        :key="experience.id"
        class="experience-item"
      >
        <div class="experience-content" :class="getPositionClass(index)">
          <h3>{{ experience.position }} | {{ experience.company }}</h3>
          <div class="experience-role">
            <ul
              v-if="getRoleDescription(experience).includes('\n')"
              class="experience-role-list"
            >
              <li
                v-for="item in getRoleDescription(experience)
                  .split('\n')
                  .filter((item) => item.trim())"
                :key="item"
              >
                {{ item.trim() }}
              </li>
            </ul>
            <p v-else class="experience-role">
              {{ getRoleDescription(experience) }}
            </p>
          </div>
          <p class="experience-date">
            {{ experience.period }}
            <span v-if="experience.current">
              {{ $t("experiences.current") }}
            </span>
          </p>
        </div>
        <div class="timeline-dot">
          <svg
            fill="currentColor"
            height="16px"
            viewBox="0 0 256 256"
            width="16px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import "./experiences.scss";

const { experiencesData } = useExperiencesData();
const { locale } = useI18n();

const getPositionClass = (index) => {
  return index % 2 === 0 ? "right" : "left";
};

const getRoleDescription = (experience) => {
  return experience.description[locale.value] || experience.description.en;
};
</script>
