const FIELDS = 'primary_name, year';

const simple = field => (value, negate = false) => ({
  text: `SELECT ${FIELDS}
         FROM games
         WHERE ${field} ${negate ? '!' : ''}~~* $1`,
  values: [`%${value}%`],
});

const junction = ({
  target,
  field,
}) => (value, negate = false) => ({
  text: `SELECT DISTINCT ${FIELDS}
         FROM games a, games_${target} ab, ${target} b
         WHERE a.id = ab.game_id
           AND ab.${field}_id = b.id
           AND ${field} ${negate ? '!' : ''}~~* $1`,
  values: [`%${value}%`],
});

module.exports.NAME = simple('primary_name');
module.exports.DESCRIPTION = simple('description');

module.exports.ARTIST = junction({ target: 'artists', field: 'artist' });
module.exports.CATEGORY = junction({ target: 'categories', field: 'category' });
