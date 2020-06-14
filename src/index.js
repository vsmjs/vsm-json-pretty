const stringifyPrettyCompact = require('json-stringify-pretty-compact');



module.exports = function vsmJsonPretty(vsm, options) {

  try {  // If given a JSON-String then convert it to a JS-Object first.
    var vsmObj = typeof vsm == 'string' ? JSON.parse(vsm) : vsm;
    if (!vsmObj)  return null;
  }
  catch(err)  { return null; }

  options = Object.assign({ json5: false }, options);

  if (options.json5) {
    options = Object.assign(options, { margins: true });
    var str = stringifyPrettyCompact(vsmObj, options)
      .replace(/ "([a-zA-Z]+)": /g, ' $1: ')     // Unquote property-keys.
      .replace(/{\n {2}terms:/  , '{ terms:')    // Merge first two lines.
      .replace(/, conns:/       , ',\n  conns:') // 'conns:' always on new line.
      .replace(/'/g             , '\\\'')
      .replace(/"/g             , '\'')          // Un-doublequote keys.
      .replace(/\n {4}{\n {6}/g , '\n    { ')    // Less spacious Terms.
      .replace(/\n {6,10}([\]}],?\n)/g, ' $1')   // Compactify `queryOptions`.
      .replace(/] }$/           , ']\n}')        // Last '}' always on new line.
      .replace(/] ?]\n}$/       , ']\n  ]\n}')   // TheConns ']' on new line.
      .replace(/(: \[|\],) ?\[/g, '$1\n    [');  // Each Conn on its own line.
  }
  else {
    // Quick compactness tweaks. Could be improved with a more general approach.
    str = JSON.stringify(vsmObj, null, 2)
      .replace(/{\n\s+("terms": \[\n|"queryOptions": {\n|".+[^{[]\n)/g, '{ $1')
      .replace(/(\n\s+) {2}([}\]]+)\n\s+([}\]]+)/g, '$1$2$3')
      .replace(/(\n\s+) {4}([}\]]{2})\n\s+([}\]]+)/g, '$1$2$3')
      .replace(/\n\s+( "pos": \[)\n\s+/g, '$1 ')
      .replace(/\n\s+( -?\d+[,\n])/g, '$1')
      .replace(/("pos": \[.+)\n\s+/g, '$1 ')
      .replace(/(\d \])(}[,\n])/g, '$1 $2')
      .replace(/("filter": {)([^\n])/g, '$1\n         $2')
      .replace(/("dictID": \[[^\]]*\s+)(\])/g, '$1    $2')
      .replace(/(\n {4}[ {] "str")(:.+\n)/g, '$1    $2')
      .replace(/(\n {4}[ {] "instID")(:.+\n)/g, '$1 $2')
      .replace(/(\n {4}[ {] "dictID")(:.+\n)/g, '$1 $2')
      .replace(/(\n {4}[ {] "descr")(:.+\n)/g, '$1  $2')
      .replace(/(\n {4}[ {] "placeholder")(:.+\n)/g, '$1$2')
      .replace(/(\n {4}[ {] "tag")(:.+\n)/g, '$1        $2');
  }

  return str;
};
