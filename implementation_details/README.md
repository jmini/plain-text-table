# Implementation details

Notes for whoever works on this project.
This folder is **not published** on GitHub Pages, see the `exclude` list in `_config.yml`.

* [share-links.md](share-links.md): the `#ptt:` links, and how the examples of the home page are made.
* [text-parser.md](text-parser.md): how a plain text table is read back into the grid, and what cannot be read.
* [handsontable.md](handsontable.md): the version of the grid library, why it is not updated, and which of its internals are used.

## Run the site locally

The site is made of static files only, any web server pointing at the root of the repository does the job:

    cd <the repository>
    python3 -m http.server 8777

Then open <http://localhost:8777/index.html>.

There is no build step: the files that are served are the files that are committed.
Reload the page after each change, the browser cache can be stubborn, so use a forced reload
(`Cmd`+`Shift`+`R`) or add a query parameter (`index.html?v=2`) when a change does not show up.

## Run the unit tests

The tests need [node](https://nodejs.org/) (version 18 or later) and nothing else, there is no
`package.json` and no dependency to install:

    node --test "test/*.test.js"

Quote the pattern, `node --test test/` does not work: node reads it as a module to load.

Only `js/parser.js` is covered. It is written so that it can be loaded both by the browser and by
node, which is the reason for the small wrapper at the top of the file. The rest of the JavaScript
reads the DOM and the grid directly and is checked by hand in the browser.

## Layout of the code

| File | Content |
| --- | --- |
| `index.html` | The whole page: the grid, the text area, the configuration and the predefined styles. |
| `js/main.js` | Everything the page does: reading the grid, generating the output, the configuration, the shared links. |
| `js/parser.js` | Reads a plain text table back into the data of the grid. No dependency on the DOM. |
| `css/main.css` | The few rules that are not Bootstrap. |
| `img/` | The images of the predefined styles and the icons of the navigation bar. |
| `test/` | The unit tests of the parser. Not published. |
| `implementation_details/` | This folder. Not published. |

The libraries (jQuery, Bootstrap, Handsontable, pako) are loaded from cdnjs, they are not vendored.

## Things that are easy to get wrong

**The order of the declarations in `js/main.js`.** The file starts with a block that initializes the
grid and ends with a block that reads the shared link of the location. The second one is at the end
on purpose: `var examples`, `var configurationFields` and `var sharePrefix` are hoisted but only
*assigned* when the execution reaches them, so a function called from the block at the top of the
file sees them as `undefined`. Moving that call up makes shared links silently stop working.

**The Ascii charset removes options.** `updateAsciiIntersectionVisibility()` deletes the `double`
option of the four vertical borders when the charset is `ascii`, because a double vertical Ascii
border does not exist. Any code setting a configuration must put those options back *before*
writing the values, otherwise `$(...).val('double')` silently does nothing and the select ends up
with no value at all, which makes `generateTable()` fail on an undefined border.

**Escaped output.** `generateTable()` writes into `#ptt-wrapper` with `.html()` after escaping the
cell content, and adds `<span>` elements when a border is highlighted. Read that element with
`.text()`, never `.html()`, to get the plain text back.
