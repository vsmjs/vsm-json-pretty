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
      .replace(/ "([a-zA-Z]+)": /g, ' $1: ')
      .replace(/{\n {2}terms:/    , '{ terms:')
      .replace(/, conns:/         , ',\n  conns:')
      .replace(/'/g               , '\\\'')
      .replace(/"/g               , '\'')
      .replace(/\n {4}{\n {6}/g   , '\n    { ')
      .replace(/\n {6,10}([\]}],?\n)/g, ' $1')
      .replace(/] }$/                 , ']\n}')
      .replace(/] ?]\n}$/             , ']\n  ]\n}')
      .replace(/(: \[|\],) ?\[/g      , '$1\n    [');
  }
  else {
    str = JSON.stringify(vsmObj, null, 2)
      .replace(/{\n\s+("(terms": \[|.+[^{[])\n)/g, '{ $1')
      .replace(/(\n\s+) {2}([}\]]+)\n\s+([}\]]+)/g, '$1$2$3')
      .replace(/(\n\s+) {4}([}\]]{2})\n\s+([}\]]+)/g, '$1$2$3')
      .replace(/\n\s+( "pos": \[)\n\s+/g, '$1 ')
      .replace(/\n\s+( \d[,\n])/g, '$1')
      .replace(/("pos": \[.+)\n\s+/g, '$1 ')
      .replace(/({ "str")(:.+\n)/g, '$1    $2')
      .replace(/("instID")(:.+\n)/g, '$1 $2')
      .replace(/("dictID")(:.+\n)/g, '$1 $2')
      .replace(/("descr")(:.+\n)/g, '$1  $2');
  }

  return str;
};
