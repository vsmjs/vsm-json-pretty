# vsm-json-pretty



## Specification

This is a function that accepts a VSM JSON-String, or a VSM JS-Object,
and converts it into a pretty, compact, readable JSON or JSON5 String.

For JSON:
- it uses `JSON.stringify(.., null, 2)`,
- and then applies VSM-specific compactness optimizations.

For JSON5:
- it builds on the package
[`json-stringify-pretty-compact`](https://github.com/lydell/json-stringify-pretty-compact),
- applies simplifications supported by JSON5,
- and adds compactness optimizations specific for a VSM data structure.

It also provides this as a build for the browser.

(Note: to convert a generated JSON5-String back to a JS-Object, use the
[json5](https://github.com/json5/json5) package).  




## Installation
### Node.js
```sh
npm install vsm-json-pretty
```

```js
const VsmJsonPretty = require('vsm-json-pretty')
```


### Browsers
```html
<script src="https://unpkg.com/vsm-json-pretty@^1.0.0/dist/vsm-json-pretty.min.js"></script>
```

This will create a global variable `VsmJsonPretty`.



## Use

Call the function with these arguments:
- `vsm` {String|Object}:
  the VSM data as a JSON-String or JS-Object.
- `options` {Object} (optional):
  - `json5` {Boolean} (default `false`): select JSON5 or JSON output.
  - other options that will be passed on to `json-stringify-pretty-compact`.


## Example
```js
var vsm = {
  terms: [
    {  str : 'subj', classID: null, instID: null },
    { "str": "rel" , classID: null, instID: null },
    {  str : 'obj' , classID: 'http://ont.ex/D/Obj', instID: null, dictID: 'http://ont.ex/D' }
  ],
  conns: [
    { type: 'T', pos: [ 0, 1, 2 ] }
  ]
};

var str1 = VsmJsonPretty(vsm);                  // Input as JS-Object.
var str2 = VsmJsonPretty(JSON.stringify(vsm));  // Input as JSON-String.
console.log(str1, str2);

/* Both output the same:
{ "terms": [
    { "str"    : "subj",
      "classID": null,
      "instID" : null
    },
    { "str"    : "rel",
      "classID": null,
      "instID" : null
    },
    { "str"    : "obj",
      "classID": "http://ont.ex/D/Obj",
      "instID" : null,
      "dictID" : "http://ont.ex/D"
  }],
  "conns": [
    { "type": "T", "pos": [ 0, 1, 2 ]}
  ]
}
*/

str1 = VsmJsonPretty(vsm, { json5: true });
str2 = VsmJsonPretty(vsm, { json5: true, maxLength: 80 });
console.log(str1, str2);

/* Both output the same:
{ terms: [
    { str: 'subj', classID: null, instID: null },
    { str: 'rel', classID: null, instID: null },
    { str: 'obj',
      classID: 'http://ont.ex/D/Obj',
      instID: null,
      dictID: 'http://ont.ex/D'
    }
  ],
  conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
}
*/
```


## License

[AGPL](LICENSE.md).
