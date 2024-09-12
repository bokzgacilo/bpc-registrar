import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dmrfkglsggrikidnnyoj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcmZrZ2xzZ2dyaWtpZG5ueW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5Nzg4MzAsImV4cCI6MjA0MTU1NDgzMH0.VxkEQAqXQK4Fd1L6FpYDPSKUMuX5mjtIc1ZmFaZYWVo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);