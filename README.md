# holocard

Marketing and demo site for [`react-holo-card`](../holo-card).

This project is a **consumer**, not a workspace member. It installs the packed
tarball and only ever imports the public entry point:

```tsx
import { HoloCard } from 'react-holo-card'
```

Nothing here reaches into `../holo-card/src`.

## Run it

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
```

## Picking up a new version of the component

```
cd ../holo-card && npm run build && npm pack
cd ../holocard  && npm install ../holo-card/react-holo-card-0.2.0.tgz
```

npm caches by tarball path, so re-run the install after every `npm pack` —
bump the version first if the cache serves you a stale copy.
