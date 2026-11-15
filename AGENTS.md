# Qless

Inspect the branch and working tree before edits; preserve unrelated work.

## Hosting

This is a static site hosted by GitHub Pages at https://qless.michaelsparre.com.
`.github/workflows/pages.yml` builds `dist` and deploys pushes to `main`.
Pull requests build without deployment permission. No runtime secrets or servers
are needed. Keep source and generated output suitable for a public repository.
Run builds and test suites on alex-macbook-pro per the shared host instructions.

## Verification

Run `npm ci` and `npm run build`. Verify the generated site, asset URLs, and
direct links before publishing. Never commit credentials, local agent settings,
private archives, or dependency/build folders.
