const SUPABASE_URL = 'https://oybywsjhgkilpceisxzn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ynl3c2poZ2tpbHBjZWlzeHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTQ0MDIsImV4cCI6MjA4NTk3MDQwMn0.sSNrv1LPn-WRrnrnwus0aJDEmulR6qoWMHc4KeQL_4w';

async function checkSupabase() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/user_data?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();
        console.log("Supabase response:", JSON.stringify(data).substring(0, 500));
    } catch(e) {
        console.error("Fetch error:", e);
    }
}
checkSupabase();
