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

## Layout

```
src/App.tsx                    page shell — mounts the sections in order
src/constants.ts               copy, prop metadata, shared class strings
src/hooks/use-demo.ts          the controls' state, called once by App
src/components/sections/       one file per section of the page
src/components/ui/             shadcn/ui, generated — don't hand-edit
```

The sections rise in on load; the stagger is derived from DOM order by
`main > :nth-child(n)` in `src/index.css`, so reordering them needs no changes.

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

Then, in `src/constants.ts`, bump `VERSION` and add the new prop to `API` (the
reference table). A numeric prop only needs a line in `NUMS` — the slider, the
default and the generated snippet all follow from it.
