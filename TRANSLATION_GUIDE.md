# Translation Guide — WIR Redlist Explorer

This guide explains how to translate the Women in Red Wikidata Redlist Explorer
into any language. The Ukrainian version (`tool-uk.html`) serves as a worked example.

## Overview

The tool is a single HTML file (`tool.html`). All translatable text is in the HTML
itself — there are no external language files. The occupation and country names in
the dropdowns are in English and do NOT need translation (they match Wikidata labels;
Wikidata returns localized labels via the SPARQL `SERVICE wikibase:label` clause).

## Step-by-step

### 1. Copy tool.html

```bash
cp tool.html tool-XX.html    # Replace XX with the language code (uk, fr, de, etc.)
```

### 2. Change the HTML lang attribute

```html
<!-- Before -->
<html lang="en">
<!-- After (e.g. Ukrainian) -->
<html lang="uk">
```

### 3. Translate the <title>

```html
<title>Women in Red — Wikidata Redlist Explorer</title>
→
<title>Жінки у червоному — Дослідник червоних списків Вікіданих</title>
```

### 4. Translate the header

| English | Location | Notes |
|---------|----------|-------|
| `♀ Women in Red — Wikidata Redlist Explorer` | `<h1>` in `.hdr` | Main title |
| `Find notable women missing from English Wikipedia · Live queries from Wikidata SPARQL` | `<p class="sub">` | Change "English" to your language name |
| `Redlist Index` | header link text | |
| `Wikidata Guide` | header link text | |
| `How to Add Names` | header link text | |

### 5. Translate the filter controls

| English | Element | Ukrainian |
|---------|---------|-----------|
| `Occupation` | `.dd-label` in occ dropdown | Професія |
| `Any` | `.dd-val` default text | Будь-яка |
| `Search occupations…` | `placeholder` on occ search | Пошук професій… |
| `Country` | `.dd-label` in cty dropdown | Країна |
| `Any` | `.dd-val` default text | Будь-яка |
| `Search countries…` | `placeholder` on cty search | Пошук країн… |
| `Limit` | `.f-limit label` | Ліміт |
| `Search Wikidata` | `.go-btn` text | Пошук у Вікіданих |
| `Select at least one occupation or country to search.` | `#f-hint` | Оберіть принаймні одну професію або країну для пошуку. |

### 6. Translate the welcome section

The `<div class="welcome">` contains:
- Heading: "Missing articles by occupation and country"
- Two explanation paragraphs
- Instruction text at the bottom

### 7. Translate the footer

```html
Created by ... Contact: ... Source code: ...
```

### 8. Change the SPARQL target Wikipedia (CRITICAL)

Find this line in the `buildQuery` function:

```javascript
schema:isPartOf <https://en.wikipedia.org/> .
```

Change `en` to your language code:

```javascript
schema:isPartOf <https://uk.wikipedia.org/> .
```

### 9. Change the SPARQL label language

Find this line:

```javascript
SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul" . }
```

Put your language code first:

```javascript
SERVICE wikibase:label { bd:serviceParam wikibase:language "uk,en,mul" . }
```

Also find the two `FILTER(LANG(...))` lines:

```javascript
FILTER(LANG(?_countryLabel)="en")
FILTER(LANG(?_occLabel)="en")
```

Change both to your language code:

```javascript
FILTER(LANG(?_countryLabel)="uk")
FILTER(LANG(?_occLabel)="uk")
```

### 10. Change the red link URLs

Find the line that builds the "create article" link:

```javascript
https://en.wikipedia.org/w/index.php?title=...
```

Change to your Wikipedia:

```javascript
https://uk.wikipedia.org/w/index.php?title=...
```

Also update the title attribute text (e.g. "Create ... on English Wikipedia" → your language).

### 11. Translate JavaScript UI strings

These are strings in the `<script>` section that appear in the UI:

| English | Context | Notes |
|---------|---------|-------|
| `'Search Wikidata'` | Button reset text after query | In `doSearch()` finally block |
| `'Querying…'` | Button text during query | In `doSearch()` |
| `'✕ Clear'` | Dropdown clear button | In `buildDropdownItems()` |
| `'Any'` | Reset text when clearing dropdown | In `clearSelection()` (appears twice) |
| `'Missing articles:'` | Results heading prefix | In `renderResults()` |
| `'Filter table…'` | Table filter placeholder | In `renderResults()` |
| `'No results found'` | Empty results message | In `renderResults()` |
| `'matching your filter'` | Appended when filter active | In `renderResults()` |
| `'items'` / `'елементів'` | Count label (∑ N items) | In `renderResults()` |
| `'Query error'` | Error box heading | In `doSearch()` catch block |
| `'↻ Retry'` | Retry button text | In error box |
| `'Unknown error'` | Fallback error message | In `doSearch()` catch block |

### 12. Translate retry/error messages

In the `fetchWithRetry` function:
- `'Server busy, retrying in X s…'`
- `'Connection issue, retrying in X s…'`
- `'Query timed out after 60 seconds'`

In the error advice strings:
- The generic advice about overloaded server
- The timeout advice about selecting both filters
- The network error advice about checking internet

### 13. Translate the occupation group names

These are the category headings in the occupation dropdown:

| English | Ukrainian |
|---------|-----------|
| Activism & Politics | Активізм і політика |
| Arts & Visual Arts | Мистецтво і візуальні мистецтва |
| Business & Economics | Бізнес і економіка |
| Education & Academia | Освіта і наука |
| Law & Justice | Право і юстиція |
| Literature & Writing | Література і писемність |
| Media & Entertainment | Медіа і розваги |
| Performing Arts | Сценічне мистецтво |
| Religion & Spirituality | Релігія і духовність |
| Science & Technology | Наука і технології |
| Medicine & Health | Медицина і здоров'я |
| Sports | Спорт |
| Other | Інше |

**Note:** The individual occupation names (Physicians, Painters, etc.) and country
names do NOT need translation — they stay in English in the dropdown, but the
SPARQL results will return localized labels from Wikidata automatically.

### 14. Translate the results section text

In `renderResults()`:
- The intro paragraph explaining what the table is
- The "∑ N items" count
- The SPARQL button tooltip
- The footer text about Wikidata and the Redlist index

## Summary of all files to change

Only **one file** needs editing: `tool-XX.html`

Changes fall into three categories:

1. **HTML text** — header, welcome section, footer, filter labels
2. **JavaScript strings** — button texts, error messages, retry messages, table headers
3. **SPARQL config** — Wikipedia language code (4 places), label language (3 places)

## Testing

Open `tool-XX.html` in a browser and:
1. Verify all visible text is in your language
2. Search for an occupation — results should show localized labels from Wikidata
3. Click a red link — it should go to `XX.wikipedia.org`
4. Click SPARQL — the query should contain `XX.wikipedia.org`
5. Check mobile view — column headers should be translated
6. Trigger an error (disconnect internet) — error messages should be in your language

## File naming convention

```
tool.html      — English (original)
tool-uk.html   — Ukrainian
tool-fr.html   — French
tool-de.html   — German
tool-ar.html   — Arabic
```
