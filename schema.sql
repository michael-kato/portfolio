CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  author TEXT DEFAULT 'Anonymous',
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_approved INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  url TEXT,
  referrer TEXT,
  user_agent TEXT,
  language TEXT,
  timezone TEXT,
  screen_res TEXT,
  device_memory INTEGER,
  cores INTEGER,
  conn_type TEXT,
  load_time_ms INTEGER,
  ttfb_ms INTEGER,
  max_scroll_depth INTEGER,
  click_count INTEGER,
  organization TEXT,
  country TEXT,
  city TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
