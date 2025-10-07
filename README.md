# Sebastian Šanda - Portfolio Website

A modern portfolio website built with Nuxt.js, featuring static site generation, i18n support, and optimized for GitHub Pages deployment.

## 🚀 Features

- **Nuxt.js 3**: Modern Vue.js framework with static site generation
- **i18n Support**: Czech/English language toggle with @nuxtjs/i18n
- **Static Export**: Optimized for GitHub Pages deployment
- **Responsive Design**: Mobile-first approach with dark mode support
- **Performance Optimized**: Image optimization, lazy loading, and smooth animations
- **SEO Ready**: Meta tags, structured data, and sitemap generation

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

   Opens at `http://localhost:3000` with hot reload

3. **Build for production**

   ```bash
   npm run generate
   ```

   Generates static files in `dist/` directory

4. **Preview production build**
   ```bash
   npm run preview
   ```

### Project Structure

```
├── app.vue                 # Root component
├── pages/
│   └── index.vue          # Main page
├── components/            # Vue components
│   ├── AppHeader.vue
│   ├── AppIntro.vue
│   ├── AppProjects.vue
│   ├── AppExperiences.vue
│   ├── AppAbout.vue
│   ├── AppContact.vue
│   └── AppFooter.vue
├── composables/           # Vue composables
│   ├── useProjectsData.js
│   └── useExperiencesData.js
├── assets/
│   ├── images/           # Static assets
│   └── styles/           # SCSS files
├── locales/              # i18n translation files
│   ├── cs.json
│   └── en.json
├── public/               # Public assets
└── nuxt.config.ts       # Nuxt configuration
```

### Component System

Components are Vue Single File Components (SFC) with:

- Template section for HTML
- Script section for JavaScript logic
- Style section for component-specific styles

### i18n Configuration

The project uses @nuxtjs/i18n for internationalization:

- Czech (cs) as default locale
- English (en) as secondary locale
- Automatic language detection
- Route-based language switching

### SCSS Architecture

- `assets/styles/main.scss` - Main entry point
- `assets/styles/base/` - Global styles, variables, resets
- `assets/styles/components/` - Component-specific styles

## 🚀 Deployment

### Automatic Deployment (Recommended)

Push to `main` branch triggers automatic GitHub Actions deployment:

1. **Enable GitHub Pages**

   - Go to repository Settings > Pages
   - Set source to "GitHub Actions"

2. **Push changes**
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

### Manual Deployment

```bash
npm run generate
# Upload dist/ folder to your hosting provider
```

## 🎨 Customization

### Adding New Components

1. Create Vue file in `components/`
2. Import and use in pages or other components
3. Add styles in `assets/styles/components/`

### Styling

- Edit SCSS files in `assets/styles/`
- Component styles go in `assets/styles/components/`
- Run `npm run dev` for live reload

### Content Updates

- **Projects**: Edit `composables/useProjectsData.js`
- **Experience**: Edit `composables/useExperiencesData.js`
- **Translations**: Edit files in `locales/`

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement for older browsers

## 🔧 Build Details

- **Nuxt.js**: Vue.js framework with static generation
- **@nuxtjs/i18n**: Internationalization support
- **@nuxt/image**: Image optimization
- **SCSS**: Compiled and optimized styles
- **GitHub Actions**: Automated CI/CD pipeline

---

Built with ❤️ by Sebastian Šanda
