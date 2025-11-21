# Splunk Style Guide Reference for AI Agents

A condensed reference for making style and language decisions when writing Splunk documentation or UI text. Based on the official [Splunk Style Guide](https://docs.splunk.com/Documentation/StyleGuide/current/StyleGuide/Howtouse).

---

## Core Principles

1. **Focus on the user** – Write about what users can do, not what the product does
2. **Use plain language** – Simple, clear, accessible to global audiences
3. **Be goal-oriented** – Include only information users need to accomplish their goal
4. **Provide examples** – Illustrate abstract concepts with inline and extended examples
5. **Stay timeless** – Avoid time-sensitive content that will become outdated

---

## Voice and Tone

### Overall Approach
- **Casual and approachable, yet succinct and direct**
- Write to users as professional acquaintances
- Aim to be: confident, friendly, comprehensive
- Avoid being: insensitive, saccharine, complicated

### Key Guidelines
- Avoid jargon and idioms
- Write in active voice and present tense
- Don't talk down to readers or make assumptions about knowledge level
- Write at the user's level but don't assume terms are commonplace

---

## Grammar and Voice

### Active Voice (Preferred)
| ❌ Passive | ✅ Active |
|-----------|----------|
| Data is sent by the forwarder | The forwarder sends data |
| The search can be run by the user | You can run the search |

**When passive voice is acceptable:**
- To avoid blaming the user (especially in error messages)
- When the actor is irrelevant or awkward to define

### Present Tense (Preferred)
| ❌ Future/Past | ✅ Present |
|---------------|-----------|
| The results will appear | The results appear |
| The data was indexed | The data is indexed |

### Mood
- Use **indicative mood** for statements of fact
- Use **imperative mood** for instructions/procedures
- Avoid subjunctive mood ("could", "would", "should" when "can" works)

---

## Sentence Construction

### User-Focused Language
| ❌ Product-focused | ✅ User-focused |
|-------------------|----------------|
| This product allows you to... | You can... |
| This feature enables you to... | With [feature], you can... |
| This component lets you... | Use [component] to... |

### Plain Language
- Use simple, complete sentences
- Communicate in 20 words instead of 50 when possible
- Always use indicating nouns to identify elements and knowledge objects

| ❌ Jargon | ✅ Plain |
|----------|---------|
| Leverage | Use |
| Utilize | Use |
| In order to | To |
| Due to the fact that | Because |
| At this point in time | Now |
| Prior to | Before |

---

## Capitalization

### Sentence-Style Capitalization (Default)
- Capitalize the first word and proper nouns only
- Use for: headings, topic titles, UI text, list items
- If a heading has a colon, capitalize the word after the colon

### Do NOT
- Use ALL CAPS for emphasis
- Capitalize feature or component names (unless proper nouns)
- Use title case except for product names and manual titles

### Examples
| ❌ Incorrect | ✅ Correct |
|-------------|-----------|
| Create A New Dashboard | Create a new dashboard |
| The Search Feature | The search feature |
| Configure YOUR Settings | Configure your settings |

---

## Contractions

### Allowed
- Present tense contractions: isn't, don't, can't, won't, it's, you're, that's, there's

### Avoid
- Past tense contractions: didn't, wasn't, hadn't
- Ambiguous contractions that reduce clarity

---

## Punctuation

### Commas
- Use the serial (Oxford) comma: "indexes, reports, and dashboards"
- Don't use commas to separate two verb phrases modifying the same subject

### Periods
- Use at the end of complete sentences
- Place outside quotation marks for keywords/strings: Search for "error".

### Quotation Marks
- Use straight quotes (not curly)
- Use double quotes for: terms being defined, UI elements in running text
- Use single quotes for: code examples in languages that use them
- Place punctuation **outside** quotation marks for code/keywords

### Colons
- Capitalize the word following a colon in headings
- Use to introduce lists (with a complete lead-in sentence)

### Exclamation Points
- **Never use in documentation or UI text**

---

## Numbers

### Numerals vs. Words
- Use numerals for: measurements, rates, versions, quantities with units
- Spell out: numbers at the start of sentences (or rewrite)

### Formatting
- Use commas for 4+ digit numbers: 1,000 / 10,000
- Use periods for decimals: 3.14
- Include leading zero for decimals less than 1: 0.5
- Add space between numeral and unit: 10 GB, 5 seconds

---

## Lists

### General Rules
- Introduce with a complete lead-in sentence
- Capitalize the first letter of every list item
- Use parallel construction across all items
- One idea/action per list item
- Maximum 2 levels (primary list + sublist)
- Sublists must have more than 1 item

### Bulleted Lists
- Use when order doesn't matter
- Use for options, features, requirements

### Numbered Lists
- Use when order matters
- Use for procedures/sequential steps
- Use lowercase letters for substeps

### Punctuation in Lists
- Use periods for complete sentences
- No periods for short phrases or fragments
- Be consistent within a single list

---

## Words to Use and Avoid

### Terms to Avoid → Use Instead

| ❌ Avoid | ✅ Use |
|---------|-------|
| abort | force quit, cancel, stop, end, fail |
| above/below (directional) | following, preceding, earlier, later |
| allows you to | You can |
| blacklist | deny list |
| bulletproof | safe, secure |
| can not | cannot |
| click on | click, select |
| could | can (when possible) |
| e.g. | for example, such as |
| easy, easily | (omit—subjective) |
| filename | file name |
| filepath | file path |
| filesystem | file system |
| hit (a key) | press |
| i.e. | that is |
| just, simply | (omit—subjective) |
| master/slave | primary/secondary, main/replica |
| native | built-in |
| please | (omit in instructions) |
| refer to | see |
| should | (use imperative or "can") |
| terminate | stop, end |
| utilize | use |
| via | by, using, through |
| whitelist | allow list |

### Preferred Terms

| Term | Usage |
|------|-------|
| *nix | Refers to both UNIX and Linux together |
| Boolean | Always capitalize |
| check box | Two words |
| data set | Two words as noun; hyphenate as adjective |
| dropdown | One word |
| email | One word, no hyphen |
| log in (verb) | Two words |
| login (noun/adj) | One word |
| on-premises | Hyphenated; not "on-premise" |
| real time (noun) | Two words |
| real-time (adj) | Hyphenated |
| set up (verb) | Two words |
| setup (noun/adj) | One word |

---

## Formatting Elements

### UI Elements
- **Bold**: UI element names in running text (buttons, menus, fields)
- Don't use bold for emphasis in general text

### Code and Technical Elements
- **Monospace/code font**: 
  - Commands and CLI input
  - File names and paths
  - Configuration settings
  - Code samples
  - API endpoints

### When NOT to Format
- Don't use special formatting in microcopy (tooltips, labels, button text)
- Don't use bold or italics for emphasis
- Don't use ALL CAPS for emphasis

---

## Procedures and Instructions

### Step Writing
- Start each step with an action verb (imperative mood)
- One action per step (unless actions are brief and related)
- Use "Select" or "Click" (not "Click on")
- Describe the result when helpful

### Example Structure
```
Follow these steps to create a new dashboard:

1. From the main menu, select **Dashboards**.
2. Click **Create New Dashboard**.
3. Enter a name for your dashboard.
4. Click **Save**.

The new dashboard appears in your dashboard list.
```

### Optional Steps
- Clearly label: "(Optional) Configure advanced settings."

---

## Inclusive and Unbiased Language

### Guidelines
- Be aware of unconscious bias
- Don't use words that diminish others' experiences
- Use gender-neutral language
- Avoid ableist language

### Biased Terms → Alternatives

| ❌ Biased | ✅ Alternative |
|----------|---------------|
| blacklist/whitelist | deny list/allow list |
| master/slave | primary/secondary, main/replica |
| sanity check | confidence check, coherence check |
| dummy data | placeholder data, sample data |
| blind to | unaware of, ignores |
| cripple | disable, impair |
| guys | everyone, folks, team |
| man-hours | person-hours, work hours |
| grandfathered | legacy, exempt |

### Disability Language
- Default to person-first language: "users with disabilities"
- Respect community preferences (e.g., "Deaf community" prefers identity-first)
- Avoid terms like: handicapped, suffering from, confined to

---

## Anthropomorphisms

**Avoid attributing human characteristics to software/systems.**

| ❌ Anthropomorphic | ✅ Accurate |
|-------------------|------------|
| The system thinks... | The system processes... |
| Splunk wants to... | Splunk is configured to... |
| The dashboard knows... | The dashboard displays... |
| The forwarder tells... | The forwarder sends... |

---

## Abbreviations and Acronyms

### Rules
- Spell out on first use, then use abbreviation: "application programming interface (API)"
- Don't use periods in acronyms: API, REST, JSON
- Capitalize all letters in acronyms
- Don't create abbreviations that don't match their terms

### Common Accepted Abbreviations (no definition needed)
- API, REST, URL, HTML, JSON, XML, SQL, CLI, GUI, UI, CPU, RAM, SSD, IP

### Product Abbreviations
- Only use approved abbreviations (e.g., ITSI, ES)
- When in doubt, use the full product name

---

## American English

- Use American English spelling: color (not colour), analyze (not analyse)
- Reference dictionary: Merriam-Webster
- Avoid loanwords and phrases from other languages:
  - ❌ i.e., e.g., in lieu of, per se, etc.
  - ✅ that is, for example, instead of

---

## Links

### Best Practices
- Use descriptive link text (not "click here")
- Lead into links with context
- One link per sentence maximum
- Don't link entire sentences unless very short

| ❌ Poor | ✅ Better |
|--------|----------|
| Click here for more info | See the Installation Guide |
| For details, see this page | For details, see Configure data inputs |

---

## Error Messages and UI Text

### Error Messages
- Clearly state the problem
- Provide actionable resolution
- Use complete sentences with punctuation
- Don't use "please"
- Use passive voice to avoid blaming users

| ❌ Poor | ✅ Better |
|--------|----------|
| You entered an invalid value | Enter a value between 1 and 100 |
| Error! | The file could not be saved. Check that you have write permissions. |

### Success Messages
- Keep brief
- Use passive voice
- No terminal punctuation for short phrases
- Example: "Settings saved" ✅

### Button Labels
- 1-4 words maximum
- Start with a verb if more than one word
- Be specific: "Save dashboard" not "OK"
- Use sentence-style capitalization
- No punctuation

### Tooltips
- Short and concise (1 word to 2 short sentences)
- Sentence-style capitalization
- Present tense
- No "please"
- Period for full sentences; no period for short phrases

---

## Accessibility

### Writing Guidelines
- Use plain language and simple sentences
- Write short paragraphs
- Use lists for tasks (not paragraph form)
- Avoid directional language ("above", "below", "left", "right")
- Spell out symbols before using them

### Headings
- Use to break up content and aid navigation
- Maintain logical hierarchy (don't skip levels)
- Keep to 2 levels of sectioning when possible

### Links
- Make link purpose clear from the text
- Don't hide links behind generic text

### Tables
- Keep simple; avoid merged cells
- Use "Yes/No" not "X" for compatibility indicators
- Don't leave cells empty (use non-breaking space)

### Images
- Always include alt text
- Ensure images reinforce surrounding text
- Don't rely on images alone to convey information

---

## Quick Reference Checklist

Before publishing, verify:

- [ ] Active voice used (passive only when appropriate)
- [ ] Present tense used
- [ ] Sentence-style capitalization applied
- [ ] No "please" in instructions
- [ ] No exclamation points
- [ ] No ALL CAPS for emphasis
- [ ] Serial comma used consistently
- [ ] Contractions are present-tense only
- [ ] User-focused language (not "allows you to")
- [ ] No anthropomorphisms
- [ ] Inclusive language used
- [ ] Abbreviations spelled out on first use
- [ ] Links have descriptive text
- [ ] Lists have lead-in sentences
- [ ] Steps start with action verbs
- [ ] Numbers formatted correctly
- [ ] American English spelling

---

## Source

This reference is derived from the [Splunk Style Guide](https://docs.splunk.com/Documentation/StyleGuide/current/StyleGuide/Howtouse). For edge cases not covered here, consult the full guide or Merriam-Webster dictionary.
