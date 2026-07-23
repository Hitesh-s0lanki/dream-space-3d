<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# File structure & routing conventions

Organize routes with **route groups** and colocate route-specific code so the tree stays easy to maintain.

- Every routable page lives inside a route group named for its section, e.g. `src/app/(marketing)/`. The parentheses keep the group out of the URL, so `(marketing)/page.tsx` still serves `/`.
- Each route group owns its `page.tsx` and a `layout.tsx`.
- Colocate components used by only that route in a private `_components/` folder inside the group. Prefix keeps it out of routing.
  - `src/app/(marketing)/_components/site-header.tsx`
  - Group related sub-components in their own subfolder: `_components/{feature}/`, e.g. `_components/sections/`.
  - Import colocated components with relative paths (`./_components/...`).
- **Common** code reused across routes lives in `src/components/` (e.g. `ui/`, `providers/`, `three/`, and shared utilities). Import via the `@/` alias.
- The root `src/app/layout.tsx` holds the `<html>`/`<body>` shell, fonts, global providers, and metadata files (`globals.css`, icons); route-group layouts hold only that section's chrome.

Example:

```
src/app/
  layout.tsx            # root: html/body, fonts, providers, metadata
  (marketing)/
    layout.tsx          # marketing-wide chrome
    page.tsx            # serves "/"
    _components/        # colocated, non-routable
      site-header.tsx
      sections/
        hero-section.tsx
src/components/         # common, cross-route (ui/, providers/, three/, …)
```
