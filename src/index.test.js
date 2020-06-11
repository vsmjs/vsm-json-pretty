const vsmJsonPretty = require('./index.js');

const chai = require('chai');
const expect = chai.expect;  // eslint-disable-line no-unused-vars
chai.should();

const outdentBlock = s => s.replace(/^ {6}/gm, '').replace(/(^\n|\n {4}$)/g, '');



describe('vsmJsonPretty(): JSON', function() {

  it('converts a simple example', () => {
    var inputObj = {
      terms: [
        { str: 'subj', classID: null, instID: null },
        { str: 'rel',  classID: null, instID: null },
        { str: 'obj',  classID: null, instID: null }
      ],
      conns: [
        { type: 'T', pos: [ 0, 1, 2 ] }
      ]
    };

    var outputStr = outdentBlock(`
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
            "classID": null,
            "instID" : null
        }],
        "conns": [
          { "type": "T", "pos": [ 0, 1, 2 ]}
        ]
      }
    `);

    vsmJsonPretty(inputObj                  ).should.equal(outputStr);
    vsmJsonPretty(inputObj, { json5: false }).should.equal(outputStr);
  });



  it('converts a larger example', () => {
    var inputObj = {
      terms: [
        { str: 'John', classID: 'PRS:0010', instID: null },
        { str: 'eats', classID: 'CW:0101', instID: null },
        { str: 'chicken',
          classID: 'BIO:0042',
          instID: null,
          dictID: 'http://x.org/BIO',
          descr: 'the animal',
          queryOptions: { sort: { dictID: [ 'http://x.org/BIO' ] } }
        },
        { str: 'with',
          classID: 'CW:0105',
          instID: null,
          dictID: 'CW',
          descr: 'using'
        },
        { str: 'fork',
          classID: 'CW:0108',
          instID: null,
          queryOptions: { fixedTerms: [ { id: 'CW:0107', str: 'spoon' } ] }
        }
      ],
      conns: [
        { type: 'T', pos: [ 0, 1, 2 ] },
        { type: 'T', pos: [ 1, 3, 4 ] }
      ]
    };

    var outputStr = outdentBlock(`
      { "terms": [
          { "str"    : "John",
            "classID": "PRS:0010",
            "instID" : null
          },
          { "str"    : "eats",
            "classID": "CW:0101",
            "instID" : null
          },
          { "str"    : "chicken",
            "classID": "BIO:0042",
            "instID" : null,
            "dictID" : "http://x.org/BIO",
            "descr"  : "the animal",
            "queryOptions": {
              "sort": {
                "dictID" : [
                  "http://x.org/BIO"
          ]}}},
          { "str"    : "with",
            "classID": "CW:0105",
            "instID" : null,
            "dictID" : "CW",
            "descr"  : "using"
          },
          { "str"    : "fork",
            "classID": "CW:0108",
            "instID" : null,
            "queryOptions": {
              "fixedTerms": [
                { "id": "CW:0107",
                  "str": "spoon"
          }]}}
        ],
        "conns": [
          { "type": "T", "pos": [ 0, 1, 2 ]},
          { "type": "T", "pos": [ 1, 3, 4 ]}
        ]
      }
    `);

    vsmJsonPretty(inputObj, { json5: false }).should.equal(outputStr);
    vsmJsonPretty(inputObj                  ).should.equal(outputStr);
  });

});



describe('vsmJsonPretty(): JSON5', function() {

  var vsmJson5 = (vsm, opt) =>
    vsmJsonPretty(vsm, Object.assign({}, opt, { json5: true }));


  it('returns `null` on error', () => {
    expect(vsmJson5(null)).to.equal(null);
    expect(vsmJson5('not-a-json-string')).to.equal(null);
  });


  it('converts an empty example', () => {
    var vsm = { terms: [], conns: [] };
    var str = vsmJson5(vsm);
    str.should.equal('{ terms: [  ],\n  conns: [  ]\n}');
  });


  it('converts an example with little term-data, and given as a JS-Object', () => {
    var inputObj = {
      terms: [
        { str: 'subj', classID: null, instID: null },
        { str: 'rel',  classID: null, instID: null },
        { str: 'obj',  classID: null, instID: null }
      ],
      conns: [
        { type: 'T', pos: [ 0, 1, 2 ] }
      ]
    };

    var outputStr = outdentBlock(`
      { terms: [
          { str: 'subj', classID: null, instID: null },
          { str: 'rel', classID: null, instID: null },
          { str: 'obj', classID: null, instID: null }
        ],
        conns: [ { type: 'T', pos: [ 0, 1, 2 ] } ]
      }
    `);

    vsmJson5(inputObj).should.equal(outputStr);
  });



  it('converts an example with more term-data, and given as a JSON-String', () => {
    var inputStr = JSON.stringify({
      terms: [
        { str: 'subj', classID: 'http://ont.ex/Subj', instID: 'http://db.ex/00', descr: 'abc' },
        { str: 'rel',  classID: 'http://ont.ex/Rel',  instID: 'http://db.ex/01' },
        { str: 'obj',  classID: 'http://ont.ex/Obj',  instID: 'http://db.ex/02' }
      ],
      conns: [
        { type: 'T', pos: [ 0, 1, 2 ] }
      ]
    });

    var outputStr = outdentBlock(`
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

    vsmJson5(inputStr).should.equal(outputStr);
  });



  it('uses options.maxLength', () => {
    var inputObj = {
      terms: [
        { str: 'subj', classID: null, instID: null },
        { str: 'rel',  classID: null, instID: null }
      ],
      conns: [ ]
    };

    var outputStr = outdentBlock(`
      { terms: [
          { str: 'subj', classID: null, instID: null },
          { str: 'rel', classID: null, instID: null }
        ],
        conns: [  ]
      }
    `);

    var outputStr2 = outdentBlock(`
      { terms: [
          { str: 'subj',
            classID: null,
            instID: null
          },
          { str: 'rel',
            classID: null,
            instID: null
          }
        ],
        conns: [  ]
      }
    `);

    vsmJson5(inputObj                   ).should.equal(outputStr);
    vsmJson5(inputObj, { maxLength: 40 }).should.equal(outputStr2);
  });

});
