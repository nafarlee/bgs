#!/usr/bin/env node
const { promisify } = require('util');

const parseString = promisify(require('xml2js').parseString);
const { Client } = require('pg');
const _ = require('lodash');

const get = require('../get');
const marshall = require('../marshall');
const insert = require('../db/insert');

const baseURL = 'https://api.geekdo.com/xmlapi2/things';

async function pull() {
  const client = new Client({
    user: 'postgres',
    database: 'postgres',
  });

  await client.connect();
  const { rows: [{ count }] } = await client.query('SELECT count FROM globals');

  const newCount = count + 500;
  const IDs = _.range(count, newCount);
  const xml = await get(`${baseURL}?stats=1&type=boardgame,boardgameexpansion&id=${IDs}`);
  const body = await parseString(xml);

  if (!body.items.item) {
    await client.query('UPDATE globals SET count = $1 WHERE id = $2', [1, 1]);
    return;
  }

  await client.query('BEGIN');
  try {
    for (const item of body.items.item) {
      for (const query of insert(marshall(item))) {
        await client.query(...query);
      }
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = pull;

pull();
