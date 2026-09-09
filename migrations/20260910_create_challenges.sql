-- High-Stakes Challenge System
-- Migration: 20260910_create_challenges.sql

-- Main challenge records
CREATE TABLE IF NOT EXISTS challenges (
  id                TEXT PRIMARY KEY,                    -- CHL-####
  challenger_id     TEXT NOT NULL,
  opponent_id       TEXT,
  tier              TEXT NOT NULL CHECK (tier IN ('low', 'medium', 'high', 'extreme')),
  status            TEXT NOT NULL DEFAULT 'open'
                      CHECK (status IN ('open', 'accepted', 'in_progress', 'completed', 'cancelled', 'expired')),
  entry_cost        JSONB NOT NULL DEFAULT '{}',
  steal_chance      REAL NOT NULL DEFAULT 0,
  winner_id         TEXT,
  combat_log_id     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at       TIMESTAMPTZ,
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_challenger ON challenges(challenger_id);
CREATE INDEX IF NOT EXISTS idx_challenges_opponent ON challenges(opponent_id);
CREATE INDEX IF NOT EXISTS idx_challenges_tier ON challenges(tier);

-- Items at stake for a challenge
CREATE TABLE IF NOT EXISTS challenge_stakes (
  id                TEXT PRIMARY KEY,
  challenge_id      TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  player_id         TEXT NOT NULL,
  item_id           TEXT NOT NULL,
  slot              TEXT,                                 -- equipped slot or 'inventory'
  is_protected      BOOLEAN NOT NULL DEFAULT FALSE,
  was_stolen        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenge_stakes_challenge ON challenge_stakes(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_stakes_player ON challenge_stakes(player_id);

-- Full audit / event log
CREATE TABLE IF NOT EXISTS challenge_logs (
  id                TEXT PRIMARY KEY,
  challenge_id      TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  event_type        TEXT NOT NULL,
  actor_id          TEXT,
  payload           JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenge_logs_challenge ON challenge_logs(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_logs_type ON challenge_logs(event_type);

-- Item protection records
CREATE TABLE IF NOT EXISTS item_protections (
  id                TEXT PRIMARY KEY,
  item_id           TEXT NOT NULL,
  player_id         TEXT NOT NULL,
  protection_type   TEXT NOT NULL CHECK (protection_type IN ('temporary', 'permanent')),
  expires_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(item_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_item_protections_player ON item_protections(player_id);
CREATE INDEX IF NOT EXISTS idx_item_protections_item ON item_protections(item_id);
