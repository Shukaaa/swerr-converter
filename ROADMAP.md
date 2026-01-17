# 0.1 MVP
- Add github action for versioning and releasing
- implemet unit tests for converters

# 0.2 Findability & UX
- Search functionality for error documentation
- Sticky navigation for large error catalogs
- `@category` tag support in JSDoc comments to group errors by category
  - Filtering options in generated documentation based on categories

# 0.3 Structure & Readability
- Two views for error documentation: Table View and Detailed View
- Sidebar navigation / table of contents for easy access to different sections
- New Tag-Support:
  - `@http 404` to specify HTTP status codes for errors
  - `@severity high` to indicate the severity level of errors
- New Option: Grouping errors by tags or alphabetically in the generated documentation

# 0.4 Customization & Theming
- Theme/Branding support for generated documentation
    - `theme` option in `swerr.config.js` to select from predefined themes
    - Custom CSS support for advanced theming
    - dark/light mode toggle in generated documentation
- Template Hooks
    - `beforeErrorList` and `afterErrorList` hooks in `swerr.config.js` to inject custom content before or after the error list
    - `links` option in `swerr.config.js` to add custom links (e.g., to external documentation or support resources) in the generated documentation

# 1.0 Polish & CI-ready
- New Output Options:
    - `minify` option in `swerr.config.js` to minify HTML output for smaller file sizes
- HTML-Escaping
- Deep Linking
    - Unique IDs for each error in the generated documentation
    - Option to link directly to specific errors using URL fragments
- Multiple Browser Support
    - Testing and optimization for various browsers (Chrome, Firefox, Safari, Edge)
    - Ensuring consistent rendering and functionality across supported browsers
- i18n / Localization support
    - `language` option in `swerr.config.js` to select the language for generated documentation
    - Option to provide custom translations for the ui to support additional languages