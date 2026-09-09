# Reading a plain text table back

`js/parser.js` turns the text of a table back into the data of the grid. It is what the
`Convert back to the grid` button of the `Text` tab uses.

The module has no dependency on the DOM or on jQuery, on purpose: it is the only part of the
JavaScript that can be covered by unit tests running in node. Keep it that way.

    node --test "test/*.test.js"

`parse(text)` returns:

```js
{
  data: [["Alice", "Johnson"], ["Bob", "Smith"]],
  mergeCells: [{row: 0, col: 1, rowspan: 2, colspan: 1}],
  horizontalHeader: 'letter',   // or 'number', or null
  verticalHeader: 'number',     // or 'letter', or null
  configuration: {...},         // the style, with the ids of the selects as keys
  error: null                   // a message when nothing could be read
}
```

## How it works

1. **Lines.** Leading and trailing empty lines are dropped and every line is padded to the same
   length, because the whole parsing works with character positions.
2. **Separation lines.** A line that only holds borders and spaces, and at least one horizontal
   line character, is a separation line. The "at least one horizontal" part is what tells it apart
   from a line of cells that happen to all be empty.
3. **Column boundaries.** A position holding a vertical line in a line of cells, or a junction in a
   separation line. Both sources are needed: a boundary hidden by a merged cell in one row is still
   drawn somewhere else in the table. The range before the first boundary and the one after the
   last are columns too, for tables drawn without an outer vertical border.
4. **Rows.** Consecutive lines of cells, see the ambiguity below.
5. **Merged cells.** A boundary that is not drawn in any line of a row means the cells on both
   sides are merged (colspan). A separation line drawing nothing over the width of a cell means the
   cell above continues below it (rowspan).
6. **Text.** The segments of every line the cell covers, each trimmed, empty ones at the start and
   at the end removed, joined with a newline. A cell spanning several rows holds its text on one of
   them only, depending on its vertical alignment, which is why the empty ones have to go.
7. **Generated headers** are removed from the content, see below.
8. **The style** is read from the drawing, see below.

## What cannot be read, and why

**A table drawn without a border between the columns.** The columns cannot be located at all.
`parse()` returns an `error` and no data, rather than a mangled grid.

**A cell holding several lines, in a table drawn without a border between the rows.** The drawing
is exactly the same as several rows. The rule used: a row taking several lines has to pad its
shorter cells with blanks, so when **every** cell of **every** line holds a text, they are read as
separate rows. This is wrong for two adjacent rows that happen to have an empty cell, which are
then read as one row holding a multiline cell. There is no way around it without more information.

**A merged cell, in a table drawn without a border between the columns.** With no line between two
columns, there is nothing to leave out to draw a merged cell. A boundary that no row draws anywhere
is read as a border set to `none`, and not as a table where every row happens to be merged.

## Reading the style back

`detectConfiguration()` reads the style from the drawing and returns it with the ids of the selects
of the page as keys, ready for `applyConfiguration()`:

* **charset**: any Unicode box drawing character means `unicode`.
* **the four horizontal borders**: from the line drawing them, `═` and `=` are `double`, `─` and `-`
  are `single`, a missing line is `none`.
* **the four vertical borders**: from the character at the boundary in a line of cells, `║` is
  `double`, `│` and `|` are `single`, never drawn is `none`.
* **the headers**: `letter` and `number` come from the content. `first_line` is deduced from a
  border after the first line that differs from the one used between the other lines, same for
  `first_column` with the first boundary.
* **the Ascii intersection**: the character a separation line draws at a boundary.
* **the padding**: a column is two characters wider than its widest cell when the padding is on.

What cannot be told apart is what does not change the output. When the border of the header and the
border between the lines are drawn the same way, a table with a header and a table without produce
exactly the same drawing, so either answer is right.

**The round trip is verified in the browser**, not by the unit tests: take the output of the tool,
parse it, apply what was read, and the output has to be the same text. The three examples of the
home page against the twelve predefined styles give 36 cases, 29 of which round trip exactly. The
seven that do not are all the `weekly schedule` example, which holds a cell with several lines,
combined with a style drawing no border between the lines: that is the ambiguity above, and no
amount of parsing can resolve it.

## Why a lone column of 1, 2, 3 is kept

A generated header is only removed when it cannot be confused with real content:

* an empty corner cell **and** a sequence on both sides removes both headers, this is the shape the
  tool produces for `letter` + `number`,
* alone, only a **letter** sequence is removed.

A first column holding `1`, `2`, `3` is left as content. It is exactly what a generated `number`
header looks like, but it is also perfectly ordinary data, and eating it silently is worse than
keeping a header column that the user can delete. An earlier version removed it and turned a test
table into nonsense.

## Adding a test

The fixtures are arrays of lines joined with `\n`, and not template literals, so that the trailing
spaces some border configurations produce cannot be lost when the file is reformatted.

The best fixtures are real outputs of the tool: build the table in the page, press
`Copy to clipboard`, and paste it as a fixture. A fixture that the tool cannot produce is not worth
much, one of the first tests written here checked a table with text inside a separation line, which
never happens.
