const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://oybywsjhgkilpceisxzn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ynl3c2poZ2tpbHBjZWlzeHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTQ0MDIsImV4cCI6MjA4NTk3MDQwMn0.sSNrv1LPn-WRrnrnwus0aJDEmulR6qoWMHc4KeQL_4w';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSupabase() {
    console.log("Checking Supabase connection and tables...");
    
    // 1. Try selecting from user_data
    const { data: selectData, error: selectError } = await supabase.from('user_data').select('*').limit(1);
    
    if (selectError) {
        console.error("❌ Select Error on user_data:", selectError.message, selectError.details);
    } else {
        console.log("✅ Select from user_data works! Found", selectData?.length, "rows.");
    }
}

checkSupabase();
