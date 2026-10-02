# AGENTS.md

Instructions for anyone, human or AI agent, who writes or edits pages in this repository. Read the whole file before you write a page. If something here conflicts with a page in the repo, this file wins.

## 1. What this repo is and how to run it

This is the GRID developer documentation, built with [Mintlify](https://mintlify.com) and deployed at https://gridesports.mintlify.app. It covers GRID's data APIs (Central Data, Series State, Series Events, Stats Feed, File Download) and, later, Video, Predictions, Odds, and Widgets.

- Navigation lives in `docs.json`. Every page must be listed there, and every entry must point at a page that exists.
- Pages are `.mdx` files. Shared text lives in `snippets/`, images in `images/<product>/`.

Run locally:

```bash
npm i -g mint        # once
mint dev             # local preview at http://localhost:3000
mint broken-links    # must report zero issues before you open a PR
```

The Hobby plan has no preview deployments. Review changes with `mint dev`.

The GitHub repo is public. Anything you push is visible before launch, so internal files (specs, `inventory/`, `questions/`, `.env`) never get committed.

## 2. Style guide

Condensed from the Splunk Style Guide. For anything not covered here, follow the [Splunk Style Guide](https://docs.splunk.com/Documentation/StyleGuide/current/StyleGuide/Howtouse) and Merriam-Webster.

### Voice

- Write to the reader as "you". Describe what they can do, not what the product does: "You can filter series by title", not "The API allows you to filter series".
- Use active voice and present tense. Passive voice is fine when the actor is irrelevant or to avoid blaming the reader in an error.
- Use the imperative for instructions ("Run the query"), the indicative for facts. Prefer "can" over "could", "should", or "would".
- Use plain language. Say it in 20 words, not 50. Lead with the most important information.
- Don't talk down to readers. Don't call anything easy, simple, or quick.
- Don't give software human traits: "the API returns", not "the API knows" or "wants".
- Stay timeless. No "new", "currently", "soon", or "recently" outside the changelog.
- Use American English spelling (color, analyze, organization).

### Capitalization and punctuation

- Sentence case for headings, titles, list items, table headers, and UI text. Capitalize the first word and proper nouns only. Capitalize the word after a colon in a heading.
- Product names keep their casing (see the glossary). Features and components don't get capitals.
- Never use ALL CAPS, bold, or italics for emphasis. Bold is for UI element names in running text only.
- Use the serial comma: "series, teams, and players".
- Use straight quotes. Put punctuation outside quotes around code or literal strings: search for "error".
- Present-tense contractions are fine (don't, isn't, you're). Avoid past-tense ones (didn't, wasn't).
- Never use exclamation marks.

### Numbers

- Numerals for quantities with units, versions, rates, and limits: 10 requests per second, 5 seconds.
- A space between the number and its unit. Commas in numbers of four or more digits: 1,000.
- Leading zero on decimals below 1: 0.5.
- Don't start a sentence with a numeral. Rewrite the sentence.

### Lists and procedures

- Introduce every list with a complete lead-in sentence.
- Capitalize each item, keep items parallel, one idea per item, at most two levels.
- Bullets when order doesn't matter, numbered lists or `<Steps>` when it does.
- Periods on items that are full sentences, none on fragments. Be consistent within a list.
- Start each step with a verb. One action per step. Say what the reader sees when the step succeeds.
- Mark optional steps: "(Optional) Set a page size."

### Words to avoid

| Avoid | Use |
|---|---|
| allows you to, enables you to, lets you | you can |
| utilize, leverage | use |
| in order to | to |
| via | through, by, using |
| e.g., i.e., etc. | for example, that is, and so on (or rewrite) |
| above, below (in the page) | preceding, following, earlier, later |
| click on | click, select |
| please | (omit) |
| just, simply, easy, easily | (omit) |
| should | the imperative, or "can" |
| refer to | see |
| can not | cannot |
| abort, terminate | stop, cancel, end |
| blacklist, whitelist | deny list, allow list |
| master/slave | primary/replica |
| sanity check | confidence check |
| dummy data | sample data |
| filename, filepath | file name, file path |

Other fixed spellings: email, dropdown, check box, Boolean, set up (verb) and setup (noun), log in (verb) and login (noun), real time (noun) and real-time (adjective).

### Abbreviations

- Spell out an abbreviation on first use on each page, then use the short form: "Open Access (OA)".
- No periods in acronyms: API, URL, JSON.
- These need no expansion: API, REST, URL, HTML, JSON, CLI, UI, ID, HTTP.

### Links

- Use descriptive link text, never "click here" or "this page". At most one link per sentence.
- Introduce the link with context: "To get your API key, see [Getting started](/data-apis/getting-started)".

### Accessibility

- Short paragraphs, headings in logical order (H2, then H3; don't skip), at most two heading levels where you can.
- Every image has alt text that says what it shows. Images support the text; they never carry information alone.
- Tables stay simple: no merged cells, no empty cells, "Yes"/"No" instead of symbols.

## 3. GRID glossary

Status: signed off by Matej on 2026-09-25 (decision D12). Use the spelling and casing in the "Write" column exactly. Schema names (`Series`, `allSeries`, `TeamParticipant`) keep their schema casing and always go in code font.

### Products and platforms

| Term | Write | Definition and usage |
|---|---|---|
| GRID | GRID | The company and the platform. Always all caps. Never "Grid" or "GRID's platform" as a product name. |
| Central Data | Central Data | The GraphQL API for static data: titles, tournaments, series, teams, players, organizations, the content catalog, and ingestion requests. Write "the Central Data API" on first use in a page, then "Central Data". Never "Central Data Feed" or "static data API". |
| Series State | Series State | The GraphQL API that returns the current state of a series. Query only: it has no subscriptions. Title case only as the product name; see "series state" for the concept. |
| Series Events | Series Events | The WebSocket API that streams in-game events for a live series, grouped into transactions. Write "the Series Events API". |
| Stats Feed | Stats Feed | The GraphQL API for aggregated statistics across series, games, and segments. |
| File Download | File Download | The REST API for downloading end-of-series files. |
| Commercial platform | Commercial platform | GRID's closed platform at `api.grid.gg`. Capital C, lowercase "platform". All tests and reference examples use it. |
| Open Access platform | Open Access platform, OA | GRID's open platform at `api-op.grid.gg`. Write "Open Access (OA)" on first use in a page, then "OA". Never "open access", "Open-Access", or "OP". |
| Not available on OA | **Not available on OA** | The badge label on pages whose operation or type exists only on the Commercial platform, inside a product that OA offers (see the access rule in section 5). Fixed text: use it exactly as written, from the snippet, directly under the page title. Never rephrase it ("Commercial only", "Not on OA"). |
| API key | API key | The secret key sent in the `x-api-key` header. Lowercase "key". Never "API Key", "api key", or "token". |
| GraphQL Playground | GraphQL Playground | The in-browser query tool on the GRID Portal. |
| Data Feed Viewer | Data Feed Viewer | The GRID Portal tool that displays a live Series Events feed. |

### Competitive data model

| Term | Write | Definition and usage |
|---|---|---|
| title | title | A competitive video game that GRID covers, such as League of Legends. Lowercase in running text. Schema type `Title`. Never "game" in this sense: a game is one matchup inside a series. |
| tournament | tournament | A competition made of multiple series. A tournament can have a parent and child tournaments (`parent`, `children`), for example a league and its stages. Schema type `Tournament`. |
| series | series | A matchup between teams made of one or more consecutive games, played in a format such as Bo3. Singular and plural are both "series" ("two series", never "serieses"). Schema type `Series`. |
| match | (don't use) | Not a GRID data concept, and ambiguous between series and game. Write "series" or "game". Allowed only inside proper names, such as Match History Viewer. |
| game | game | A single in-game matchup between teams inside a series. A Bo3 series has up to three games. Never use "game" to mean a title. |
| segment | segment | A section of a game or of another segment, such as a round. Use it when talking about the data model in general; use the title-specific word (round) when the page is about one title. |
| round | round | A segment type in round-based titles, such as Counter-Strike 2 and VALORANT. |
| map | map | The virtual environment a game is played on. |
| character | character | A character a player controls in a game. Title-specific names (agent, hero, champion) are fine on title-specific pages. |
| team | team | A group of players competing in a title. Schema type `Team`. A team taking part in a series is a team participant (`TeamParticipant`). |
| player | player | A single person competing in a title. Schema type `Player`. |
| organization | organization | The esports organization (club) that owns one or more teams, often across titles. Schema type `Organization`. American spelling: never "organisation". |
| series format | series format | How many games a series has and how the winner is decided. Short names are written as the API returns them: Bo1, Bo2, Bo3, Bo5, SA2. Never "BO3" or "bo3". |
| series type | series type | The kind of series: `ESPORTS`, `COMPETITIVE`, `SCRIM`, or `LOOPFEED`. Enum values in code font. |
| scrim | scrim | A practice series between two teams. Lowercase. |
| loopfeed | loopfeed | A recorded test series replayed on a loop so you can build and test against live-looking data. One word, lowercase. |
| service level | service level | The coverage GRID offers for a series in a given product: `FULL`, `LIMITED`, or `NONE`. |
| esports | esports | Lowercase, one word, no hyphen. Capitalize only at the start of a sentence: "Esports". Never "e-sports" or "eSports". |

### Content catalog and ingestion

| Term | Write | Definition and usage |
|---|---|---|
| content catalog | content catalog | The versioned in-game reference data for a title: characters, items, maps, and structures. Lowercase in running text. Each entry is a content catalog entity; each release of the data is a content catalog version. |
| content catalog entity | content catalog entity | One item in the content catalog, of type `CHARACTER`, `ITEM`, `MAP`, or `STRUCTURE`. |
| content catalog version | content catalog version | A published version of a title's content catalog, such as a game patch. |
| ingestion request | ingestion request | A request to add the described entities to Central Data. Its status moves through `PENDING`, `IN_PROGRESS`, `REQUIRES_REVIEW`, `COMPLETED`, `REJECTED`, or `FAILED`. Lowercase in running text; schema type `IngestionRequest`. |
| external ID | external ID | The ID a data provider uses for an entity, mapped to the GRID ID. "ID" in caps. |
| data provider | data provider | A source of external IDs, such as a tournament organizer. |

### Live data

| Term | Write | Definition and usage |
|---|---|---|
| event | event | Something that happens in a game, such as a kill or a round end. In Series Events, events arrive grouped in transactions. |
| transaction | transaction | A single package of data sent over the Series Events WebSocket. A transaction carries one or more events and its own `sequenceNumber`. |
| series state | series state | The concept: the full state of a series at a point in time. Lowercase. The API that returns it is Series State. |
| objective | objective | An important in-game achievement, such as destroying a tower or slaying Roshan. |

### Title names

The docs cover eight titles in every product: Counter-Strike 2, Dota 2, League of Legends, VALORANT, Mobile Legends: Bang Bang, Rainbow Six Siege, Standoff 2, and CrossFire. Don't write title-specific pages for any other title.

In running text, write a title the way its publisher styles it, not the way the API returns it. Use the API value only inside code, such as a query variable or a response.

| API `name` | Write |
|---|---|
| Counter Strike 2 | Counter-Strike 2 |
| Valorant | VALORANT |
| Defense of the Ancients 2 | Dota 2 |
| League of Legends | League of Legends |
| Mobile Legends: Bang Bang | Mobile Legends: Bang Bang |
| Tom Clancy's Rainbow Six Siege | Rainbow Six Siege |
| Standoff 2 | Standoff 2 |
| Crossfire | CrossFire |

For a title not in this table, check the publisher's own site and add a row.

### Access tiers

The docs describe two access tiers: the Commercial platform and the Open Access platform. A third tier, Competitor Access, exists but isn't documented yet. Don't mention it on any page until this glossary adds it.

## 4. Page types

Every page is one of seven types. Start from the template and use the canonical page as the example.

A template sets the minimum structure and the order of its sections, not the limit of what a page can say. When a page needs more than the template gives, add it. For example, a section on how an operation behaves, a known limit, or a worked case the reader is likely to hit. Rules for extending a template:

- Keep the template's sections and their order. Add new sections where they read best, and don't remove or rename required ones.
- Use only the components and conventions in this file.
- Say what you added and why in the PR description, so Matej can decide whether it stays on this page only or becomes part of the type.
- If Matej agrees that it belongs to the type, update the template and the canonical page in the same PR, or in a follow-up PR that's linked from it.
- If a template rule doesn't fit a page at all, don't work around it silently. Add a question to `questions/<product>.md`.

Each P0-5 ticket fills in its own row once its page is approved. Until then, the paths in brackets name the planned canonical pages.

| Type | Purpose | Template | Canonical page |
|---|---|---|---|
| Overview | What a product is, who it's for, how to get access | _P0-6_ | _P0-6_ (`data-apis/central-data/overview`) |
| Concept | Explain a model or mechanism | _P0-6_ | _P0-6_ (`data-apis/central-data/entities`) |
| Quickstart | First successful call in under 10 minutes | _P0-6_ | _P0-6_ (`data-apis/central-data/quickstart`) |
| Tutorial | Task-oriented walkthrough with code in Node.js, Python, and Kotlin | _P0-6_ | _P0-6_ (`data-apis/central-data/tutorials/get-team-player-photos`) |
| Reference: operation | One query, mutation, or subscription | `templates/reference-operation.mdx` | `data-apis/central-data/api-reference/queries/allSeries` |
| Reference: types | Objects, inputs, and filters get one page each; connections and enums share one grouped page per kind, one anchor per type | `templates/reference-type.mdx` (one type per page), `templates/reference-type-group.mdx` (grouped) | `data-apis/central-data/api-reference/objects/Series`, `data-apis/central-data/api-reference/filters/SeriesFilter`, `data-apis/central-data/api-reference/connections` |
| Changelog | Versioned changes per product, newest first | _P0-6_ | _P0-6_ (`data-apis/central-data/changelog`) |

Shapes, until the templates exist:

- **Overview**: intro, access badge, what you can do (cards), endpoints snippet, next steps.
- **Concept**: intro, diagram or image, one section per concept, related reference links.
- **Quickstart**: prerequisites, `<Steps>` to the first response, expected output, next steps.
- **Tutorial**: Overview, Prerequisites (`<Tabs>` per language), Implementation (`<Steps>`, each with a `<CodeGroup>` in Node.js, Python, and Kotlin and at most one callout), Expected output, Next steps (`<CardGroup>`).
- **Reference: operation**: frontmatter title is the operation name; Overview; Playground tip snippet; Response type (link to the type page); Arguments as `<ParamField>` with type, default, and enum values; one `<RequestExample>` with two blocks titled Basic and Full; one `<ResponseExample>` with Basic and Full.
- **Reference: types**: one section per type, fields as `<ResponseField>`, links back to the operations that use the type.
- **Changelog**: `<Update>` blocks, newest first.

### Basic and Full examples

- **Basic**: the operation with no arguments (or only the required ones) and a few main fields.
- **Full**: every argument set through variables, every field of the selection set including nested types, and pagination fields when the operation returns a connection. Show the Variables block.
- Keep responses small through arguments (for example `first: 2`), never by editing the response. The response shown is the real response.
- Use only the Esports World Cup 2026 fixtures in `examples/fixtures.md`: one finished grand final per title, with its tournament and team IDs. Don't pick other series or tournaments. If no fixture fits an example, ask Matej before adding one, and add it to both `fixtures.md` and `fixtures.json`.
- Examples that must run on both platforms use the Counter-Strike 2 or Dota 2 fixture. The other titles aren't visible with an OA key.
- When an example reads current state that changes over time, such as a team's roster, say so on the page, next to the expected output.
- Reference examples use the Commercial endpoint. Overview and quickstart pages show both endpoints.
- Redact signed or expiring URLs and tokens.

## 5. Frontmatter, naming, links, images, and components

### Frontmatter

```yaml
---
title: "Get series"
description: "Query a paginated list of series with filters and ordering."
---
```

- `title` and `description` are required on every page.
- `sidebarTitle` only when the title is too long for the sidebar.
- `icon` only on overview pages.
- The title is the page's H1. Never put an H1 (`#`) in the body; start at H2.

### Naming

- File and folder names are lowercase kebab-case: `get-team-player-photos.mdx`.
- Exception: reference pages are named after the schema item, in schema casing: `queries/allSeries.mdx`, `objects/Series.mdx`, `filters/SeriesFilter.mdx`.
- Reference paths: `data-apis/<product>/api-reference/{queries,mutations,objects,inputs,filters}/<Name>.mdx`, plus grouped `connections.mdx` and `enums.mdx`.

### Links

- Internal links are site-absolute and have no extension: `/data-apis/central-data/entities`.
- Never link to `portal.grid.gg/documentation/...`. The one allowed Portal link is the GraphQL Playground, and it comes from the Playground snippet.
- Run `mint broken-links` before every PR.

### Images

- Store images in `images/<product>/`. Never hotlink `cdn.grid.gg`.
- Every image has alt text and sits in a `<Frame>`. Give light and dark variants when the image has a background.

### Components

- Callouts: `<Note>`, `<Tip>`, `<Warning>`, `<Info>`, `<Check>` only. At most one per step, and don't stack them.
- `<Steps>` for procedures, `<Tabs>` for alternatives (languages, platforms), `<CodeGroup>` for the same code in several languages, `<AccordionGroup>` for optional detail.
- `<ParamField>` for arguments, `<ResponseField>` (with `<Expandable>` for nested fields) for fields, `<RequestExample>`/`<ResponseExample>` on reference pages.
- `<Card>`/`<CardGroup>` for next steps and overviews. `<Update>` on changelogs only.
- Every code block has a language. Blocks inside a group also have a title: ` ```graphql Basic `.
- Shared text comes from `snippets/`, never copied: authentication header, endpoints per API and platform, the **Not available on OA** badge, rate limits, Playground tip, support contact, and the pagination arguments `after`, `before`, `first`, and `last` (one snippet each).
- A snippet that pages may need to extend exports a component: `import { PlaygroundTip } from "/snippets/playground-tip.mdx";`. It takes props for the words that change per page (for example `items="series"`), and any text between its opening and closing tags is added to it. Fixed text, such as the badge and the endpoints, stays a plain snippet.
- Before you create a new snippet, ask Matej. Say what it would hold, which pages would use it, and how many pages you estimate will reuse it.
- Access: a page whose operation or type exists only on the Commercial platform gets the **Not available on OA** badge snippet directly under the title. Take access from `schemas/<api>.access.json`, never from guesswork. No sidebar tag.
- This applies only to products that OA offers (Central Data, Series State). File Download, Series Events, and Stats Feed aren't offered on OA. Say so once, on the product overview, and nowhere else in that product: no badge, no note. The Open Access platform page lists which products OA offers.
- Stats Feed runs on `api-op.grid.gg` for Commercial keys too. Show that URL with the Commercial key, and never present Stats Feed as an OA product.
- MDX doesn't accept HTML comments. Use `{/* comment */}`.

## 6. Sources of truth

1. For GraphQL APIs, the schema in `schemas/<api>.graphql` and live responses are the truth. Old Portal articles and PDFs inform coverage and wording only.
2. For non-GraphQL surfaces (WebSocket, REST, video, widgets), live observation is the truth. PDFs and Portal articles are hints.
   - The old sources are local and gitignored, and you only read them. Never edit, move, or quote them wholesale. `inventory/Markdown docs/` holds the 158 old Portal articles, named `<id>-<slug>.md`. `inventory/Old documentation/` holds the 20 PDFs.
   - Start from `inventory/sources-catalog.md`. It lists every article and PDF with its ID, category, likely product, and notes.
   - Recipe articles store their steps as a JSON array in the body, not as prose.
   - Several articles exist in more than one version, for example 39 and 174 (Series Events). The one with the latest `updatedAt` is usually current.
   - The old `package_access` field isn't the access rule for a new page. Access comes from `schemas/<api>.access.json`.
3. For every page, compare three things: what the old article claims, what the schema says, and what a live call returns. Every mismatch, and every claim you can't observe, becomes a numbered question in `questions/<product>.md` (gitignored).
4. A page with an open question doesn't go into a PR. Matej answers; the answer is recorded as a dated fact, and the page proceeds.
5. Never contact engineering directly. Matej decides whether to escalate.
6. Check every example with `tools/gql` (`gql run` to execute it, `gql check` to validate it against the schema) before the page goes into a PR. The API key comes only from the `GRID_API_KEY` environment variable: never pass it as an argument, print it, or write it to a file.
7. While drafting, tag each claim with its fact ID as `{/* F-012 */}`. Strip every fact ID before merge.

## 7. What never goes in the docs

- Internal notes, TODOs, drafts, or references to specs, tickets, and internal tools.
- Customer, partner, or prospect names, and anything under NDA.
- Unverified claims: anything not backed by the schema, a live response, or a dated answer from Matej.
- API keys, tokens, signed URLs, or internal hostnames.
- Future plans, release dates, or pricing.
- Exclamation marks.
