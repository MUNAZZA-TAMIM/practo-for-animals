-- Practo for Animals — Production Database Schema
-- Migration 001: Initial schema
--
-- This migration creates all tables required by the Practo for Animals
-- application. It is designed to be run against a PostgreSQL database
-- (e.g. Supabase) using a migration tool or the Supabase SQL editor.
--
-- Table naming: snake_case
-- ID type: UUID (gen_random_uuid)
-- Timestamps: TIMESTAMPTZ with DEFAULT NOW()
-- JSONB: Used for array fields and nested objects (services, species, features, etc.)
-- RLS: NOT enabled by default. Application-layer authorization is enforced
--   via Next.js server actions. Enable RLS only after defining policies.

-- ---------------------------------------------------------------------------
-- providers
-- ---------------------------------------------------------------------------
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  about TEXT NOT NULL,
  services JSONB NOT NULL DEFAULT '[]',
  species JSONB NOT NULL DEFAULT '[]',
  features JSONB NOT NULL DEFAULT '[]',
  hours TEXT NOT NULL,
  price_note TEXT,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  image_credit TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  is_sample BOOLEAN NOT NULL DEFAULT false,
  completeness INTEGER NOT NULL DEFAULT 0,
  provider_id TEXT, -- links provider account (auth session sub) to this listing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_providers_slug ON providers(slug);
CREATE INDEX idx_providers_category ON providers(category);
CREATE INDEX idx_providers_city ON providers(city);
CREATE INDEX idx_providers_provider_id ON providers(provider_id);

-- ---------------------------------------------------------------------------
-- appointment_requests
-- ---------------------------------------------------------------------------
CREATE TABLE appointment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  provider_slug TEXT NOT NULL REFERENCES providers(slug),
  provider_name TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  service TEXT NOT NULL,
  service_description TEXT,
  animal_name TEXT NOT NULL,
  animal_species TEXT NOT NULL,
  animal_age TEXT,
  reason_for_visit TEXT,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  user_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  is_sample BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointment_requests_provider_slug ON appointment_requests(provider_slug);
CREATE INDEX idx_appointment_requests_user_id ON appointment_requests(user_id);
CREATE INDEX idx_appointment_requests_status ON appointment_requests(status);
CREATE INDEX idx_appointment_requests_created_at ON appointment_requests(created_at DESC);

-- ---------------------------------------------------------------------------
-- corrections
-- ---------------------------------------------------------------------------
CREATE TABLE corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  provider_slug TEXT NOT NULL REFERENCES providers(slug),
  provider_name TEXT NOT NULL,
  field TEXT NOT NULL,
  current_value TEXT NOT NULL,
  proposed_value TEXT NOT NULL,
  evidence_url TEXT,
  note TEXT,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  review_note TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  is_sample BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_corrections_provider_slug ON corrections(provider_slug);
CREATE INDEX idx_corrections_status ON corrections(status);
CREATE INDEX idx_corrections_created_at ON corrections(created_at DESC);

-- ---------------------------------------------------------------------------
-- animals
-- ---------------------------------------------------------------------------
CREATE TABLE animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  notes TEXT,
  is_sample BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_animals_user_id ON animals(user_id);
CREATE INDEX idx_animals_created_at ON animals(created_at DESC);

-- ---------------------------------------------------------------------------
-- business_enquiries
-- ---------------------------------------------------------------------------
CREATE TABLE business_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  contact_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  services TEXT NOT NULL,
  species TEXT NOT NULL,
  message TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new',
  is_sample BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_business_enquiries_city ON business_enquiries(city);
CREATE INDEX idx_business_enquiries_category ON business_enquiries(category);
CREATE INDEX idx_business_enquiries_status ON business_enquiries(status);
CREATE INDEX idx_business_enquiries_created_at ON business_enquiries(created_at DESC);

-- ---------------------------------------------------------------------------
-- education_leads
-- ---------------------------------------------------------------------------
CREATE TABLE education_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  role TEXT NOT NULL,
  organisation TEXT,
  programme_slug TEXT NOT NULL,
  programme_name TEXT NOT NULL,
  goals TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  is_sample BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_education_leads_status ON education_leads(status);
CREATE INDEX idx_education_leads_created_at ON education_leads(created_at DESC);

-- ---------------------------------------------------------------------------
-- content_projects
-- ---------------------------------------------------------------------------
CREATE TABLE content_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  brief JSONB NOT NULL,
  research JSONB NOT NULL,
  outline JSONB NOT NULL DEFAULT '[]',
  slides JSONB NOT NULL DEFAULT '[]',
  design_direction TEXT NOT NULL,
  review JSONB NOT NULL DEFAULT '{}',
  reviewer_name TEXT,
  review_notes TEXT,
  status TEXT NOT NULL DEFAULT 'in_review',
  source TEXT NOT NULL DEFAULT 'studio',
  is_sample BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_projects_status ON content_projects(status);
CREATE INDEX idx_content_projects_created_at ON content_projects(created_at DESC);

-- ---------------------------------------------------------------------------
-- business_listings
-- ---------------------------------------------------------------------------
CREATE TABLE business_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  services JSONB NOT NULL DEFAULT '[]',
  animals_supported JSONB NOT NULL DEFAULT '[]',
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  contact_person TEXT,
  business_hours TEXT,
  additional_information TEXT,
  appointment_information TEXT,
  emergency_service_information TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  is_sample BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_business_listings_category ON business_listings(category);
CREATE INDEX idx_business_listings_city ON business_listings(city);
CREATE INDEX idx_business_listings_status ON business_listings(status);
CREATE INDEX idx_business_listings_created_at ON business_listings(created_at DESC);

-- ---------------------------------------------------------------------------
-- workflow_runs
-- ---------------------------------------------------------------------------
CREATE TABLE workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  subject_label TEXT NOT NULL,
  status TEXT NOT NULL,
  mode TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]',
  error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  is_sample BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workflow_runs_workflow ON workflow_runs(workflow);
CREATE INDEX idx_workflow_runs_status ON workflow_runs(status);
CREATE INDEX idx_workflow_runs_created_at ON workflow_runs(created_at DESC);

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  detail TEXT NOT NULL,
  is_sample BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ---------------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------------
-- RLS is NOT enabled by default. Application-layer authorization is enforced
-- via Next.js server actions. Enable RLS only after defining policies.
--
-- Example (uncomment when ready):
-- ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY providers_select_all ON providers FOR SELECT USING (true);
-- CREATE POLICY providers_update_own ON providers FOR UPDATE
--   USING (provider_id = auth.uid()::text);
