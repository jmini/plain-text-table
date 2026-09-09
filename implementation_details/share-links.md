# Shared links

A shared link carries a whole table in the part of the URL that follows the `#`:

    https://jmini.github.io/plain-text-table/#ptt:eJyNkEFPwzAMhf_K5HMvwBDQGwwhcU...

Nothing is sent to a server: the fragment of a URL is never part of the HTTP request, and the page
reads it with JavaScript in the browser.

## Format

    #ptt:<base64url of the zlib compressed JSON of the state>

* `ptt` is the name of the tool, it separates the payload from anything else that could end up in
  the hash. The scheme is the one [mermaid.live](https://mermaid.live) uses, where the prefix is
  `pako` after the name of the compression library.
* The JSON is deflated with [pako](https://github.com/nodeca/pako), loaded from cdnjs.
* The bytes are then encoded as base64, with `+` and `/` replaced by `-` and `_` and the `=`
  padding removed, so that the link survives being pasted anywhere.

The state is what `readState()` returns:

```json
{
  "data": [["Alice", "Johnson"], ["Bob", "Smith"]],
  "mergeCells": [{"row": 0, "col": 1, "rowspan": 2, "colspan": 1}],
  "alignments": {"1,0": "htRight htBottom"},
  "configuration": {"charset": "ascii", "horizontal_header": "first_line", "...": "..."}
}
```

* `data` comes from `getData()` of the grid.
* `alignments` is a `'<row>,<column>'` map of the `className` of the cell meta, which is where
  Handsontable keeps the text alignment set with the context menu. It is a map and not a grid
  because most cells have no alignment at all.
* `configuration` holds the value of every select of the page plus the padding checkbox. The list
  is `configurationFields` in `js/main.js`, **it has to be kept in sync when an option is added**.

`applyConfiguration()` ignores any value that the select does not offer. A link is data coming from
outside, an unknown or impossible combination must not be able to leave a select without a value.

## The location follows the table

`updateSharedLocation()` is called at the end of `generateTable()`. It rewrites the hash, but only
when the location already holds a `#ptt:` link, so that:

* a page opened at `index.html` keeps a clean address bar while you type,
* a page opened from a shared link, or after the `Copy link to this table` button was pressed,
  always shows a link to what is on the screen.

The write is delayed by 500 ms because the grid is re-rendered at each key stroke, and browsers
throttle `replaceState()`. `replaceState()` does not fire `hashchange`, so this does not reload the
table. `applyState()` cancels a pending write, otherwise opening a link would immediately rewrite
the URL you just arrived on.

## The examples of the home page are shared links

The three examples in the `Huh ?` section are plain `<a href="#ptt:...">` links. There is no example
data in the JavaScript: the tool is what produced them.

To change an example, or to add one:

1. Open the page and build the table you want, style included.
2. Press `Copy link to this table`.
3. Paste the `#ptt:...` part of the link in the `<li>` of `index.html`.

Two handlers in `js/main.js` make those links behave:

* `hashchange` applies the state, because following a link inside the same page does not reload it.
  This is also what makes the back and forward buttons of the browser work between examples.
* A delegated `click` on `a[href^="#ptt:"]` covers the case a plain link cannot: when the link
  points at the table that is already in the address bar, the hash does not change, no `hashchange`
  fires, and an edited table would not be reset.

## Reading a link by hand

To see what a link holds without opening it:

```bash
python3 - <<'EOF'
import base64, zlib, json
h = "eJyNkEFPwzAMhf_K5HMvwBDQGwwhcU..."   # the part after '#ptt:'
b = h.replace('-', '+').replace('_', '/')
b += '=' * (-len(b) % 4)
print(json.dumps(json.loads(zlib.decompress(base64.b64decode(b))), indent=2))
EOF
```
