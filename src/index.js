const stringifyPrettyCompact = require('json-stringify-pretty-compact');



module.exports = function vsmJsonPretty(strOrObj) {

  try {  // If given a JSON-String then convert it to a JS-Object first.
    var obj = typeof strOrObj == 'string' ? JSON.parse(strOrObj) : strOrObj;
    if (!obj)  return null;
  }
  catch(err)  { return null; }


  return stringifyPrettyCompact(obj, { margins: true })
    .replace(/ "([a-zA-Z]*)": /g, ' $1: ')
    .replace(/{\n {2}terms:/    , '{ terms:')
    .replace(/, conns:/         , ',\n  conns:')
    .replace(/'/g               , '\\\'')
    .replace(/"/g               , '\'')
    .replace(/\n {4}{\n {6}/g   , '\n    { ')
    .replace(/\n {6,10}([\]}],?\n)/g, ' $1')
    .replace(/] }$/                 , ']\n}')
    .replace(/] ?]\n}$/             , ']\n  ]\n}')
    .replace(/(: \[|\],) ?\[/g      , '$1\n    [');

};
