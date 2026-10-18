# Sebastian Šanda – Portfolio

Personal portfolio at [sebastiansanda.cz](https://www.sebastiansanda.cz), statically generated with Nuxt and hosted on GitHub Pages.

## Stack

- Nuxt 4 (static generation)
- @nuxt/content 3 for projects, experiences and skills
- @nuxtjs/i18n: Czech (default, `/`) and English (`/en`)
- @nuxtjs/color-mode for the light and dark theme
- SCSS, GSAP

## Development

Requires Node 24 and npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

Checks (the same ones CI runs):

```bash
npm run lint
npm run typecheck
npm run generate   # static site in .output/public
npm run preview    # serve the generated site
```

## Structure

```
app/
├── components/      # Vue components, styles in sibling .scss files
│   ├── header/
│   ├── footer/
│   └── home/        # page sections: intro, projects, experiences, skills, about, contact
├── composables/     # data access (content queries, site contacts)
├── pages/
└── styles/main.scss # theme tokens and global styles
content/
├── cs/projects/     # Czech project pages
├── en/projects/     # English project pages
├── experiences/     # one file per position, both locales
└── skills.yml
i18n/locales/        # UI texts (cs.json, en.json)
public/cv/           # CV PDFs
content.config.ts    # content collection schemas
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml` (lint, typecheck, generate) and publishes `.output/public` to GitHub Pages. Pull requests to `main` run the same checks without deploying. The custom domain is configured in the repository's Pages settings.
