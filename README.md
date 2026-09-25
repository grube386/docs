# GRID Documentation

Source for the GRID developer documentation, built with [Mintlify](https://mintlify.com).

## Local preview

```bash
npm i -g mint
mint dev              # http://localhost:3000
mint broken-links     # must report zero issues before merging
```

## Layout

- `docs.json` — site config and navigation. Only list pages that exist.
- `index.mdx` — landing page.
- `data-apis/` — Data APIs product (Central Data API guides, tutorials, API reference).
- `images/`, `logo/`, `favicon.svg` — static assets.

Changes merged to `main` are deployed by the Mintlify GitHub app.
