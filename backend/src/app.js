const express = require('express');
const cors = require('cors');

const transactionsRoutes = require('./routes/transactions.routes');
const subscriptionsRoutes = require('./routes/subscriptions.routes');
const budgetRoutes = require('./routes/budget.routes');
const coachRoutes = require('./routes/coach.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/transactions', transactionsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`FinPilot backend server listening on port ${PORT}`);
  });
}

module.exports = app;
