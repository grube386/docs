# Example fixtures: Esports World Cup 2026

Every example on every page uses these entities, so the same IDs appear across the whole site. All six series are finished grand finals (`type: ESPORTS`, `private: false`, `workflowStatus: PUBLISHED`). Verified against the live API on 2026-09-30.

The machine-readable copy is `fixtures.json` in this folder. Keep both in sync.

## Series

| Title | Title ID | Series ID | Series | Date (UTC) | Format | Team IDs | On OA |
|---|---|---|---|---|---|---|---|
| Counter-Strike 2 | 28 | `2976197` | FUT Esports vs Team Spirit | 2026-08-23 11:30 | Bo5 | FUT Esports `55746`, Team Spirit `49586` | Yes |
| Dota 2 | 2 | `2971555` | BetBoom Team vs Parivision | 2026-07-19 13:30 | Bo5 | BetBoom Team `4023`, Parivision `54204` | Yes |
| League of Legends | 3 | `2970138` | Dplus KIA vs Karmine Corp | 2026-07-19 13:10 | Bo5 | Dplus KIA `48179`, Karmine Corp `53165` | No |
| VALORANT | 6 | `2968857` | NRG vs 100 Thieves | 2026-07-12 13:45 | Bo5 | NRG `97`, 100 Thieves `337` | No |
| Mobile Legends: Bang Bang | 11 | `2958486` | Team Spirit vs Yangon Galacticos | 2026-08-01 12:10 | Bo7 | Team Spirit `55321`, Yangon Galacticos `55392` | No |
| Rainbow Six Siege | 25 | `2977368` | FURIA vs FaZe Clan | 2026-08-15 15:15 | Bo5 | FURIA `49161`, FaZe Clan `49157` | No |

"On OA": whether the series is visible with an Open Access key. On OA, the other four return `Requester forbidden to make query`. An example that must run on both platforms (quickstart, overview) uses the Counter-Strike 2 or Dota 2 series.

## Tournaments

The series' own tournament comes first, then each parent up to the event root.

| Title | Series tournament | Parents | Series in the event |
|---|---|---|---|
| Counter-Strike 2 | `830611` Esports World Cup 2026 - Counter-Strike 2 (Playoffs) | `830304` Esports World Cup 2026 - Counter-Strike 2 | 56 |
| Dota 2 | `830164` Esports World Cup 2026 - Dota 2 | none (single level, no children) | 80 |
| League of Legends | `830128` Esports World Cup - 2026 (Playoffs: Playoffs) | `830127` (Playoffs), `830107` Esports World Cup - 2026, `830008` Esports World Cup (all years) | 197 |
| VALORANT | `829843` Esports World Cup - Valorant - 2026 (Playoffs: Playoffs) | `829842` (Playoffs), `829836` Esports World Cup - Valorant - 2026, `827461` Esports World Cup - Valorant (all years) | 28 |
| Mobile Legends: Bang Bang | `829667` MSC 2026: Knockout Stage | `829663` MSC 2026 | 55 |
| Rainbow Six Siege | `829664` Esports World Cup | none (single level, no children) | 40 |

"Series in the event" is the `totalCount` of `allSeries` filtered by the event root with `includeChildren`. It includes online qualifiers where the event has them (League of Legends).

## Which fixture to use

- **Default for reference examples:** the League of Legends final, `2970138`. It has the deepest tournament tree (four levels), and `Series.players` is populated.
- **Both platforms (quickstart, overview):** the Counter-Strike 2 final, `2976197`.
- **Tournament hierarchy (`parent`, `children`):** League of Legends `830107` or VALORANT `829836`.
- **Lists and pagination (`allSeries`, connections):** filter by an event root with `includeChildren: true`, for example `830107`.
- **Per-title examples (Series State, Series Events, Stats Feed):** the series for that title.

## Known gaps in the data

- `Series.players` returns players only for League of Legends (7) and VALORANT (10). The other four finals return an empty list. Don't use them for player examples.
- The Rainbow Six Siege tournament is named "Esports World Cup", with no year, and has no parent. Mobile Legends: Bang Bang runs as "MSC 2026". Both are the EWC 2026 events for their titles.
- Team rosters are current state, not history. Examples that read a team's players will change when the roster changes. Say so on the page where it applies.
