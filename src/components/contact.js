import { contactData } from "../data/contact.js";

export const contactComponent = (t) => `
  <section id="contact" tabindex="-1" aria-label="Contact">
    <h2>${t("navigation.contact")}</h2>
    <div class="contact-links">
      <a
        href="${contactData.email.href}"
        aria-label="${contactData.email.ariaLabel}"
        tabindex="0"
      >
        ${contactData.email.text}
      </a>
      <a
        href="${contactData.linkedin.href}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${contactData.linkedin.ariaLabel}"
        tabindex="0"
      >
        ${contactData.linkedin.text}
      </a>
    </div>
  </section>
`;
