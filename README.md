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
npm run format:check   # npm run format to fix
npm run typecheck
npm test               # self-checks in scripts/ for the hero grid and gomoku logic
npm run generate       # static site in .output/public
npm run preview        # serve the generated site
```

## Structure

```
app/
├── components/        # one folder per component: index.vue + its .scss
│   ├── header/        # nav-items/, theme-toggle/
│   ├── footer/
│   ├── home/          # page sections: intro, projects, experiences, skills, about, contact
│   ├── project-hero/  # animated grid with the gomoku game on project pages
│   └── ui/            # generic: decrypted-text/, logo-loop/
├── composables/       # content queries, site links, hero grid and match state
├── layouts/           # header + page + footer
├── pages/
├── styles/main.scss   # theme tokens and global styles
├── types/             # domain types shared across layers, derived from the content schemas
└── utils/             # pure logic (gomoku, hero grid geometry)
content/
├── cs/projects/       # Czech project pages
├── en/projects/       # English project pages
├── experiences/       # one file per position, both locales
├── other-projects/    # logos in the "other projects" loop
└── skills.yml
i18n/locales/          # UI texts (cs.json, en.json)
public/cv/             # CV PDFs
scripts/               # self-checks run by npm test
content.config.ts      # content collection schemas
```

Types live next to the code that owns them: component props in the component, logic types in their module. Only types shared by several layers go to `app/types/`.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml` (lint, format check, typecheck, test, generate) and publishes `.output/public` to GitHub Pages. Pull requests to `main` run the same checks without deploying. The custom domain is configured in the repository's Pages settings.
