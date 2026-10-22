CREATE TABLE delivery_test (
 id TEXT PRIMARY KEY NOT NULL,
 request_id TEXT NOT NULL,
 cycle_id TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('ready','unlocked','collected')),
 delivered_at TEXT NOT NULL,
 seen_at TEXT,
 collected_at TEXT
);
