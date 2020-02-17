const stringifyPrettyCompact = require('json-stringify-pretty-compact');



module.exports = function vsmJsonPretty(vsm, options) {

  try {  // If given a JSON-String then convert it to a JS-Object first.
    var vsmObj = typeof vsm == 'string' ? JSON.parse(vsm) : vsm;
    if (!vsmObj)  return null;
  }
  catch(err)  { return null; }

  var opt = Object.assign({}, options, { margins: true });

  return stringifyPrettyCompact(vsmObj, opt)
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
