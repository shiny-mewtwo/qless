# Qless

A browser-based word dice game built with React, TypeScript, and Vite.

Published at https://qless.michaelsparre.com with GitHub Pages.

```sh
npm ci
npm run dev
npm run build
```

The build produces a static `dist/` directory. Word validation downloads the
public English dictionary from dwyl/english-words; a small fallback dictionary
is included for network failures.
