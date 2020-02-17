const vsmJsonPretty = require('./index.js');

const chai = require('chai');
const expect = chai.expect;  // eslint-disable-line no-unused-vars
chai.should();

const outdentBlock = s => s.replace(/^ {6}/gm, '').replace(/(^\n|\n {4}$)/g, '');


describe('vsmJsonPretty()', function() {

  it('returns `null` on error', () => {
    expect(vsmJsonPretty(null)).to.equal(null);
    expect(vsmJsonPretty('not-a-json-string')).to.equal(null);
  });


  it('converts an empty example', () => {
    var vsm = { terms: [], conns: [] };
    var str = vsmJsonPretty(vsm);
    str.should.equal('{ terms: [  ],\n  conns: [  ]\n}');
  });


  it('converts an example with little term-data, and given as a JS-Object', () => {
    var input = {
      terms: [
        { str: 'subj', classID: null, instID: null },
        { str: 'rel',  classID: null, instID: null },
        { str: 'obj',  classID: null, instID: null }
      ],
      conns: [
        { type: 'T', pos: [ 0, 1, 2 ] }
      ]
    };

    // This defines the String-output:
    var output = outdentBlock(`
      { terms: [
          { str: 'subj', classID: null, instID: null },
          { str: 'rel', classID: null, instID: null },
          { str: 'obj', classID: null, instID: null }
        ],
        conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
      }
    `);

    vsmJsonPretty(input).should.equal(output);
  });



  it('converts an example with more term-data, and given as a JSON-String', () => {
    var input = {
      terms: [
        { str: 'subj', classID: 'http://ont.ex/Subj', instID: 'http://db.ex/00', descr: 'abc' },
        { str: 'rel',  classID: 'http://ont.ex/Rel',  instID: 'http://db.ex/01' },
        { str: 'obj',  classID: 'http://ont.ex/Obj',  instID: 'http://db.ex/02' }
      ],
      conns: [
        { type: 'T', pos: [ 0, 1, 2 ] }
      ]
    };

    // This defines the String-output:
    var output = outdentBlock(`
      { terms: [
          { str: 'subj',
            classID: 'http://ont.ex/Subj',
            instID: 'http://db.ex/00',
            descr: 'abc'
          },
          { str: 'rel',
            classID: 'http://ont.ex/Rel',
            instID: 'http://db.ex/01'
          },
          { str: 'obj',
            classID: 'http://ont.ex/Obj',
            instID: 'http://db.ex/02'
          }
        ],
        conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
      }
    `);

    input = JSON.stringify(input);  // For this test, stringify the input.
    vsmJsonPretty(input).should.equal(output);
  });

});
