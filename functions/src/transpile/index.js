const lib = require('./lib');
const language = require('../language');

function toSQL(predicates, intersect = true) {
  const joiningTerm = intersect ? 'INTERSECT' : 'UNION';
  return predicates.reduce((acc, cur) => {
    const isOR = cur.type === 'OR';
    const { text, values } = isOR
      ? toSQL(cur.terms, false)
      : lib[cur.tag](cur);

    return {
      text: (acc.text.length === 0)
        ? text
        : `${acc.text} ${joiningTerm} ${isOR ? `(${text})` : text}`,
      values: acc.values.concat(values || []),
    };
  }, { text: '', values: [] });
}

module.exports = function transpile(s) {
  const predicates = language.tryParse(s);
  const { text, values } = toSQL(predicates);

  const replacer = (x => () => `$${x++}`)(1);
  return {
    text: text.replace(/\{\{\}\}/g, replacer),
    values,
  };
};
