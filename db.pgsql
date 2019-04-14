CREATE TABLE games (
  id INTEGER PRIMARY KEY,
  last-updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  alternate-names TEXT[],
  artists TEXT[],
  average-rating REAL,
  average-weight REAL,
  bayes-rating REAL,
  categories TEXT[],
  contained-in TEXT[],
  description TEXT,
  designers TEXT[],
  expanded-by TEXT[],
  families TEXT[],
  maximum-players SMALLINT CHECK (max-players > 0),
  maximum-playtime SMALLINT CHECK (maximum-playtime > 0),
  mechanics TEXT[],
  minimum-age SMALLINT CHECK (minimum-age > 0),
  minimum-players SMALLINT CHECK (minimum-players > 0),
  minimum-playtime SMALLINT CHECK (minimum-playtime > 0),
  primary-name TEXT,
  publishers TEXT[],
  rating-deviation REAL,
  rating-votes INTEGER,
  reimplemented-by text[],
  weight-votes INTEGER,
  year SMALLINT,
);

CREATE TABLE player-recommendations (
  id INTEGER REFERENCES games ON DELETE CASCADE,
  players INT4RANGE,
  best INTEGER CHECK (best >= 0),
  recommended INTEGER CHECK (recommended >= 0),
  not-recommended INTEGER CHECK (not-recommended >= 0),
  PRIMARY KEY (id, players),
);
