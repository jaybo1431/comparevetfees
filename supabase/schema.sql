-- CompareVetFees — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ===========================================================================
-- ENUMS
-- ===========================================================================

CREATE TYPE user_role AS ENUM ('pet_owner', 'practice_owner', 'admin');
CREATE TYPE claim_status AS ENUM ('pending', 'approved', 'rejected');

-- ===========================================================================
-- TABLES
-- ===========================================================================

-- profiles — extends auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'pet_owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- practices — all practice data
CREATE TABLE practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  town TEXT NOT NULL,
  county TEXT NOT NULL DEFAULT 'Dorset',
  postcode TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  transparency_score INTEGER NOT NULL DEFAULT 3 CHECK (transparency_score BETWEEN 1 AND 5),
  is_independent BOOLEAN NOT NULL DEFAULT true,
  parent_group TEXT,
  opening_since INTEGER,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  features TEXT[] DEFAULT '{}',
  claimed_by UUID REFERENCES profiles(id),
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_practices_slug ON practices(slug);
CREATE INDEX idx_practices_town ON practices(town);
CREATE INDEX idx_practices_is_published ON practices(is_published);

-- prices — normalised pricing
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  procedure_key TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  notes TEXT,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(practice_id, procedure_key, effective_from)
);

CREATE INDEX idx_prices_practice ON prices(practice_id);
CREATE INDEX idx_prices_procedure ON prices(procedure_key);

-- price_history — tracks changes over time
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  procedure_key TEXT NOT NULL,
  old_price NUMERIC(10,2),
  new_price NUMERIC(10,2) NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  changed_by UUID REFERENCES profiles(id)
);

-- leads — contact form enquiries
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  pet_type TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_practice ON leads(practice_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- practice_claims — claim requests
CREATE TABLE practice_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status claim_status NOT NULL DEFAULT 'pending',
  evidence TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_claims_status ON practice_claims(status);

-- saved_practices — user favourites
CREATE TABLE saved_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, practice_id)
);

-- ===========================================================================
-- VIEWS
-- ===========================================================================

-- current_prices — latest price per practice + procedure
CREATE VIEW current_prices AS
SELECT DISTINCT ON (practice_id, procedure_key)
  id,
  practice_id,
  procedure_key,
  price,
  notes,
  effective_from
FROM prices
ORDER BY practice_id, procedure_key, effective_from DESC;

-- ===========================================================================
-- FUNCTIONS & TRIGGERS
-- ===========================================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_practices
  BEFORE UPDATE ON practices FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_claims
  BEFORE UPDATE ON practice_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================================================
-- ROW-LEVEL SECURITY
-- ===========================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_practices ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ---- practices ----
CREATE POLICY "Published practices are public"
  ON practices FOR SELECT USING (is_published = true);
CREATE POLICY "Practice owners can update own"
  ON practices FOR UPDATE USING (
    auth.uid() = claimed_by
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can insert practices"
  ON practices FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can delete practices"
  ON practices FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---- prices ----
CREATE POLICY "Prices are public"
  ON prices FOR SELECT USING (true);
CREATE POLICY "Practice owners can manage own prices"
  ON prices FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM practices WHERE id = practice_id AND claimed_by = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Practice owners can update own prices"
  ON prices FOR UPDATE USING (
    EXISTS (SELECT 1 FROM practices WHERE id = practice_id AND claimed_by = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can delete prices"
  ON prices FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---- price_history ----
CREATE POLICY "Price history is public"
  ON price_history FOR SELECT USING (true);

-- ---- leads ----
CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Practice owners read own leads"
  ON leads FOR SELECT USING (
    EXISTS (SELECT 1 FROM practices WHERE id = practice_id AND claimed_by = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Practice owners can mark leads read"
  ON leads FOR UPDATE USING (
    EXISTS (SELECT 1 FROM practices WHERE id = practice_id AND claimed_by = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---- practice_claims ----
CREATE POLICY "Users can submit claims"
  ON practice_claims FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own claims"
  ON practice_claims FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update claims"
  ON practice_claims FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---- saved_practices ----
CREATE POLICY "Users manage own saves"
  ON saved_practices FOR ALL USING (auth.uid() = user_id);
