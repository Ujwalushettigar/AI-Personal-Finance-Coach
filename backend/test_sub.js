const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
  const email = "test" + Date.now() + "@example.com";
  const { data: { session }, error: authErr } = await supabase.auth.signUp({
    email,
    password: "password123"
  });
  
  if (authErr) {
    console.log("Auth error:", authErr.message);
    return;
  }
  
  const token = session.access_token;
  console.log("Got token for", email);
  
  const res = await fetch("http://localhost:5000/api/subscriptions", {
    headers: { "Authorization": "Bearer " + token }
  });
  
  const text = await res.text();
  console.log("GET response:", res.status, text);
  
  const postRes = await fetch("http://localhost:5000/api/subscriptions", {
    method: "POST",
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify({ merchant: "TestSub", cadence: "monthly", amount: 9.99 })
  });
  console.log("POST response:", postRes.status, await postRes.text());
  
  const res2 = await fetch("http://localhost:5000/api/subscriptions", {
    headers: { "Authorization": "Bearer " + token }
  });
  console.log("GET response 2:", res2.status, await res2.text());
}

test();
