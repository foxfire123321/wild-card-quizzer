// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://whfmzoxhgpjfbxtfhlad.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZm16b3hoZ3BqZmJ4dGZobGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDYyNjMsImV4cCI6MjA2MDM4MjI2M30.SlWpCIGBcztrzIa_d6QGTB3gtSV2b70DFcHhM6QWkjk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);