## google-sheets-formula-parser

A very simple, very scrappy parser for Google Sheets-like formulae. Very much a work in progress.

It does:
 - Handle basic arithmetic functions: `+ - / * ^`
 - Handle brackets + operation ordering
 - Handle `SUM` and `AVERAGE` operations

It does not (yet):
 - Handle any other ops
 - Speak to CSVs or representations of sheets to get values and/or ranges

 Usage:

```
 import { evaluate } from 'google-sheets-formula-parser';

 ...

 evaluate("1 + 2") //=> 3
 evaluate("SUM(1,2)") //=> 3
 evaluate("(1 + 2)^2") // => 9

```
