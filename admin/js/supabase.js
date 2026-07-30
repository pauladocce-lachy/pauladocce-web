const SUPABASE_URL = "https://fadvqzpejrwarfjuatbu.supabase.co";

const SUPABASE_KEY = "sb_publishable_eVZVqO1WdUQ7BPKReH6HTA_ClaL-obM";

const { createClient } = supabase;

const db = createClient(SUPABASE_URL, SUPABASE_KEY);
