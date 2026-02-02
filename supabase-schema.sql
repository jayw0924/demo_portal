-- Create demos table
CREATE TABLE demos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  demo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  priority INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_id UUID NOT NULL REFERENCES demos(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT NOT NULL DEFAULT 'Mid',
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on demo_id for faster comment lookups
CREATE INDEX comments_demo_id_idx ON comments(demo_id);

-- Enable Row Level Security (RLS)
ALTER TABLE demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since your app is public)
-- For demos table
CREATE POLICY "Allow public read access on demos" ON demos
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on demos" ON demos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on demos" ON demos
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on demos" ON demos
  FOR DELETE USING (true);

-- For comments table
CREATE POLICY "Allow public read access on comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on comments" ON comments
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on comments" ON comments
  FOR DELETE USING (true);
