# Sebastian Šanda - Portfolio Website

A modern portfolio website built with HTML components, SCSS, and Vite for optimal development experience and GitHub Pages deployment.

## 🚀 Features

- **Component-based HTML**: Modular HTML components that get compiled into a single file
- **Modern Build System**: Vite for fast development and optimized builds
- **SCSS Support**: Full SCSS compilation with component organization
- **GitHub Pages Ready**: Automatic deployment via GitHub Actions
- **Responsive Design**: Mobile-first approach with dark mode support
- **Multilingual**: Czech/English language toggle
- **Performance Optimized**: Lazy loading, smooth animations, and optimized assets

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
   npm run build
   ```

   Outputs to `dist/` directory

4. **Preview production build**
   ```bash
   npm run preview
   ```

### Project Structure

```
src/
├── components/           # HTML component files
│   ├── header.html
│   ├── intro.html
│   ├── projects.html
│   ├── experiences.html
│   └── contact.html
├── styles/
│   └── sass/            # SCSS files
│       ├── base/
│       ├── components/
│       └── main.scss
├── scripts/
│   └── main.js          # Application JavaScript
├── assets/
│   └── images/          # Static assets
└── index.html           # Main template file
```

### Component System

Components are pure HTML files that get injected into the main `index.html` template during build:

```html
<!-- In index.html -->
<%= header %>
<!-- Injects src/components/header.html -->
<%= intro %>
<!-- Injects src/components/intro.html -->
```

### SCSS Architecture

- `base/` - Global styles, variables, resets
- `components/` - Component-specific styles
- `main.scss` - Main entry point that imports all modules

SCSS is automatically processed by Vite during development and build.

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
npm run deploy
```

## 🎨 Customization

### Adding New Components

1. Create HTML file in `src/components/`
2. Add to `vite.config.js` data injection
3. Include in `src/index.html` template

### Styling

- Edit SCSS files in `src/styles/sass/`
- Component styles go in `src/styles/sass/components/`
- Run `npm run dev` for live reload

### Content Updates

- **Projects**: Edit `src/components/projects.html`
- **Experience**: Edit `src/components/experiences.html`
- **Contact**: Edit `src/components/contact.html`

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement for older browsers

## 🔧 Build Details

- **Vite**: Fast build tool with HMR
- **HTML Plugin**: Processes component injection
- **SCSS**: Compiled and optimized
- **Assets**: Optimized and copied to dist
- **GitHub Actions**: Automated CI/CD pipeline

---

Built with ❤️ by Sebastian Šanda
