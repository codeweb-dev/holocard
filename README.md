# holocard

Marketing and demo site for [`react-holo-card`](../holo-card).

This project is a **consumer**, not a workspace member. It installs the
published package from npm and only ever imports the public entry point:

```tsx
import { HoloCard } from 'react-holo-card'
```

Nothing here reaches into `../holo-card/src`.

Stack: Vite + React 19, Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first config in
`src/index.css`), shadcn/ui on Radix primitives (`src/components/ui`). Theme
tokens are set once in `:root` / `.dark`; the pre-paint script in `index.html`
applies the stored or system theme before first paint.

## Run it

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
```

## Picking up a new version of the component

```
npm install react-holo-card@latest
```

Then bump `VERSION` in `src/App.tsx` and add any new prop to the live controls
and the reference table.
