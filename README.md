# Plain Text Table

Interactively create and edit tables and export them to plain text.

## Use the tool online

Please visit : https://jmini.github.io/plain-text-table/

## Features

* Interactive input table (using [handsontable](http://handsontable.com/))
* Unicode or ASCII output
* Flexible border configuration
* Merged cell support (colspan and rowspan)
* Multiline text in the cells
* Text alignement support (horizontal and vertical)
* Predefined style, including the table syntax of Markdown
* Example tables to start from
* Copy the output to the clipboard
* Share the table (content, alignment and configuration) with a link
* Read a plain text table back into the grid, style included (`Text` tab)
* The table is kept in the browser and survives a reload

All configuration options explained in the [user manual](user_manual/README.md).

## Output examples

Unicode characters with multiline and merged cells:

    ╔════════╦══════╤═══════════╤═════════╤═══════════╤═══════════╤═════════════╗
    ║  Who?  ║ Code │  Monday   │ Tuesday │ Wednesday │ Thursday  │   Friday    ║
    ╠════════╬══════╪═══════════╧═════════╧═══════════╪═══════════╪═════════════╣
    ║ Team A ║   23 │          Proin id nunc          │ Fringilla │    Lorem    ║
    ║        ║      │                                 │           │    Ipsum    ║
    ╟────────╫──────┼───────────┬─────────┬───────────┴───────────┼─────────────╢
    ║        ║      │           │  Ante   │                       │             ║
    ║ Team B ║    4 │ Fermentum │ Ipisum  │         Amet          │    Lyks     ║
    ║        ║      │           │ Primis  │                       │             ║
    ╟────────╫──────┼───────────┼─────────┼───────────┬───────────┼─────────────╢
    ║ Team C ║   52 │ Metus ex  │  Dxow   │ Malesuada │           │ Ullamcorper ║
    ╟────────╫──────┼───────────┴─────────┼───────────┤ Vulputate ├─────────────╢
    ║ Team D ║   19 │       Ornare        │ Tincidunt │           │     Rwe     ║
    ╚════════╩══════╧═════════════════════╧═══════════╧═══════════╧═════════════╝

Ascii characters with spreadsheet headers:

    +===+========+===========+=======+=====+
    |   |   A    |     B     |   C   |  D  |
    +===+========+===========+=======+=====+
    | 1 | Alice  | Johnson   |       | 293 |
    +---+--------+-----------+-------+-----+
    | 2 | Bob    | Smith     | ????? |   2 |
    +---+--------+-----------+-------+-----+
    | 3 | Carrie | Sheffield |   ?   |  42 |
    +===+========+===========+=======+=====+

## Development

The site is made of static files, serve the root of the repository with any web server:

    python3 -m http.server 8777

The parser reading a plain text table back into the grid (`js/parser.js`) is covered by unit tests.
They need [node](https://nodejs.org/) (version 18 or later) and no other dependency:

    node --test "test/*.test.js"

More about the code in [implementation_details](implementation_details/README.md).
The `test` and `implementation_details` folders are not published on GitHub Pages, see `_config.yml`.

## Get in touch / bug tracker

Use the [plain-text-table issue tracker](https://github.com/jmini/plain-text-table/issues) on GitHub.

## Credits

This project is a fork of the original `plain-text-table` created in 2014 by [Lorefnon](https://github.com/lorefnon).
The original repository and its website are no longer available, so this fork continues the work.

## License

[HTML5 Boilerplate](LICENSE.md)
