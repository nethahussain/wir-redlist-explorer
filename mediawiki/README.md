# WIR Redlist Explorer — MediaWiki Version

A user script for English Wikipedia that embeds a live Wikidata Redlist Explorer
on [[Wikipedia:WikiProject Women in Red]] pages.

## Files

| File | Wikipedia page | Purpose |
|------|---------------|---------|
| `WIR-RedlistExplorer.js` | `User:Netha_Hussain/WIR-RedlistExplorer.js` | The main JavaScript user script |
| `WIR-RedlistExplorer.css` | `User:Netha_Hussain/WIR-RedlistExplorer.css` | Optional stylesheet for enhanced styling |
| `Wikitext-page.wiki` | `Wikipedia:WikiProject Women in Red/Redlist Explorer` | Wikitext for the WiR subpage |

## How to install (for individual users)

Add these lines to your [[Special:MyPage/common.js]]:

```js
importStylesheet('User:Netha_Hussain/WIR-RedlistExplorer.css');
importScript('User:Netha_Hussain/WIR-RedlistExplorer.js');
```

Then visit any page containing `<div id="wir-redlist-explorer"></div>` and the
tool will appear.

## How to deploy (on a WiR project page)

1. Create `User:Netha_Hussain/WIR-RedlistExplorer.js` — paste the JS file contents
2. Create `User:Netha_Hussain/WIR-RedlistExplorer.css` — paste the CSS file contents
3. Create `Wikipedia:WikiProject Women in Red/Redlist Explorer` — paste the wikitext
4. Optionally transclude it from the main WiR page:
   `{{Wikipedia:WikiProject Women in Red/Redlist Explorer}}`

## How to propose as a gadget

If the community wants this available to all editors without manual installation,
it can be proposed as a gadget at [[Wikipedia:Gadget/proposals]]:

```
* RedlistExplorer[ResourceLoader|type=general|dependencies=oojs-ui-core,oojs-ui-widgets,jquery.tablesorter|peers=RedlistExplorer-styles]|RedlistExplorer.js
* RedlistExplorer-styles[ResourceLoader|type=styles|hidden]|RedlistExplorer.css
```

## How it works

- The script looks for `<div id="wir-redlist-explorer"></div>` on any page
- If found, it loads OOUI widgets (MediaWiki's built-in UI framework) for the dropdowns
- When the user clicks "Search Wikidata", it runs a SPARQL query against query.wikidata.org
- Results are rendered as a native MediaWiki `wikitable sortable` table
- Red links use Wikipedia's native `.new` class styling
- MediaWiki's `jquery.tablesorter` is used for column sorting
- The SPARQL `FILTER NOT EXISTS` clause ensures only women WITHOUT English Wikipedia articles appear

## Technical notes

- Uses `mw.loader.using()` to load OOUI dependencies
- Uses native `fetch()` for SPARQL queries (no jQuery.ajax needed)
- Uses `wikitable sortable` CSS classes for native Wikipedia table styling  
- Red links use `/w/index.php?title=...&action=edit&redlink=1` format
- Wikidata links use `class="extiw"` for proper interwiki link styling
- The `jquery.tablesorter` module is loaded to enable column sorting on dynamic content
- On mobile, description and occupation columns are hidden via CSS media queries
