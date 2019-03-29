const PS = require('parsimmon');

module.exports = PS.createLanguage({
  Language(r) {
    return PS.alt(
      PS.seq(
        PS.optWhitespace,
        r.Query,
        PS.optWhitespace,
        PS.end,
      ),
      PS.whitespace,
      PS.end,
    );
  },

  Query(r) {
    return PS.alt(
      PS.seq(
        r.Expression,
        PS.whitespace,
        r.Query,
      ),
      r.Expression,
    );
  },

  Expression(r) {
    return PS.alt(
      PS.seq(
        PS.string('('),
        PS.seq(PS.optWhitespace, r.Expression, PS.optWhitespace).many(),
        PS.string(')'),
      ),
      r.OrChain,
      r.Term,
    );
  },

  OrChain(r) {
    return PS.seq(
      r.Term,
      PS.whitespace,
      r.Or,
      PS.whitespace,
      r.Term,
      PS.seq(PS.whitespace, r.Or, PS.whitespace, r.Term).many(),
    );
  },

  Term(r) {
    return PS.alt(
      PS.seq(r.DeclarativeTag, PS.string(':'), PS.alt(r.SimpleValue, r.QuotedValue)),
      PS.seq(r.RelationalTag, r.RelationalOperator, r.SimpleValue),
    );
  },

  Or() {
    return PS.regexp(/or/i);
  },

  DeclarativeTag() {
    return PS.alt(
      PS.string('name'),
      PS.string('art'),
      PS.string('category'),
      PS.string('desc'),
      PS.string('family'),
      PS.string('mechanic'),
      PS.string('publish'),
      PS.string('designer'),
    );
  },

  SimpleValue() {
    return PS.regexp(/[^ ]+/);
  },

  QuotedValue() {
    return PS.seq(
      PS.string('"'),
      PS.regexp(/[^"]+/),
      PS.string('"'),
    );
  },

  RelationalTag() {
    return PS.alt(
      PS.string('rating-votes'),
      PS.string('average-rating'),
      PS.string('geek-rating'),
      PS.string('rating-deviation'),
      PS.string('average-weight'),
      PS.string('weight-votes'),
      PS.string('year'),
      PS.string('age'),
      PS.string('min-players'),
      PS.string('rec-players'),
      PS.string('best-players'),
      PS.string('max-players'),
      PS.string('min-playtime'),
      PS.string('max-playtime'),
    );
  },

  RelationalOperator() {
    return PS.alt(
      PS.string('='),
      PS.string('>'),
      PS.string('>='),
      PS.string('<'),
      PS.string('<='),
    );
  },
}).Language;
