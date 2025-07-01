# deadly-moodle

Un projet React avec TypeScript, Vite et Tailwind CSS.

## Déploiement automatique sur GitHub Pages

Ce projet est configuré pour se déployer automatiquement sur GitHub Pages à chaque push sur la branche `main`.

### Configuration requise

1. **Activer GitHub Pages dans votre repository :**
   - Allez dans `Settings` > `Pages`
   - Dans `Source`, sélectionnez `GitHub Actions`

2. **Permissions du workflow :**
   - Allez dans `Settings` > `Actions` > `General`
   - Dans `Workflow permissions`, sélectionnez `Read and write permissions`

### Développement local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

### URLs

- **Développement :** http://localhost:5173
- **Production (GitHub Pages) :** https://[votre-username].github.io/deadly-moodle/

Le workflow GitHub Actions se déclenche automatiquement à chaque push et déploie votre application sur GitHub Pages.