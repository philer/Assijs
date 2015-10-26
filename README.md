# Assijs

A simple, web-based register machine intended for demonstration and learning purposes
and inspired by the [Minimaschine](http://schule.awiedemann.de/minimaschine.html).

**~ Work in progress ~**

**[Demo](http://philer.org/assijs)**

### Features

* Runs inside a browser as a simple HTML file, no webserver required
* Simulates a single-register (accumulator) CPU
* Step-by-step progress of programs, with controls to fast-forward or go backwards
* Simplistic assembly language with 37 operations/instructions to date (ADD, JMP etc.)
* Almost fully compatible with the [Minimaschine](http://schule.awiedemann.de/minimaschine.html)'s instruction set
* Most new operations are easy to add
* Tabular memory view with configurable memory size
* Memory representation in decimal, hexadecimal and binary
* All memory cells are live editable (including CPU registers and flags)
* Simple editor integrated, supports opening and saving files (as downloads)

#### TODOs and Ideas

* Localization
* More intuitive visual CPU layout
* Resizable windows
* Static file URLs containing program code
* Configurable amount of CPU registers
* Cross compiler maybe?

#### Requirements

To run Assijs you simply open `index.html` in a web browser.
It should run without trouble in any reasonably up-to-date browser.
That said, not all learning environments provide reasonably up-to-date software.
The critical feature required is probably EcmaScript 5 compatibility, which
notably excludes Internet Explorer below version 9 and Firefox below version 4.
Some other 'modern' features are used (such as CSS3) but they should not be
crucial to functionality.
I'll try to add a complete compatibility table once I've done some testing.
