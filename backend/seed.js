const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function seed() {
  console.log('Attempting to create a test user to bypass RLS...');
  const testEmail = `testuser${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (authError) {
    console.error('Failed to create test user:', authError.message);
    return;
  }

  const user = authData.user;
  if (!user) {
    console.log('User creation pending email verification, cannot seed data automatically.');
    return;
  }
  
  const userId = user.id;
  console.log('Successfully authenticated as:', testEmail, 'User ID:', userId);

  console.log('Seeding data...');
  
  // 1. Insert some transactions
  const transactions = [
    { user_id: userId, amount: 50.0, type: 'expense', category: 'Food', description: 'Lunch at Cafe', merchant: 'Cafe Mocha', date: new Date().toISOString() },
    { user_id: userId, amount: 15.0, type: 'expense', category: 'Transport', description: 'Uber ride', merchant: 'Uber', date: new Date().toISOString() },
    { user_id: userId, amount: 3000.0, type: 'income', category: 'Salary', description: 'Monthly Salary', merchant: 'Company Inc', date: new Date().toISOString() },
  ];

  const { data: txData, error: txError } = await supabase.from('transactions').insert(transactions).select();
  if (txError) {
    console.error('Error inserting transactions:', txError);
  } else {
    console.log(`Inserted ${txData?.length || 0} transactions.`);
  }

  // 2. Insert some budgets
  const budgets = [
    { user_id: userId, category: 'Food', amount_limit: 500, period: 'monthly' },
    { user_id: userId, category: 'Transport', amount_limit: 200, period: 'monthly' }
  ];

  const { data: bData, error: bError } = await supabase.from('budgets').insert(budgets).select();
  if (bError) {
    console.error('Error inserting budgets:', bError);
  } else {
    console.log(`Inserted ${bData?.length || 0} budgets.`);
  }

  // 3. Insert savings goals
  const goals = [
    { user_id: userId, title: 'Emergency Fund', target_amount: 10000, current_amount: 2500, category: 'General' },
  ];

  const { data: gData, error: gError } = await supabase.from('savings_goals').insert(goals).select();
  if (gError) {
    console.error('Error inserting goals:', gError);
  } else {
    console.log(`Inserted ${gData?.length || 0} savings goals.`);
  }

  console.log('\n=========================================');
  console.log('Seeding complete!');
  console.log(`You can now log into the app with these credentials to see the data:`);
  console.log(`Email: ${testEmail}`);
  console.log(`Password: ${testPassword}`);
  console.log('=========================================');
}

seed();
