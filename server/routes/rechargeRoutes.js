const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const pool = require('../config/db');
const admin = require('../middleware/adminMiddleware');

router.post('/create-recharge', auth, async (req, res) => {
  try {
    const { amount, method } = req.body;

    const validAmounts = [200, 500, 1000, 2000, 5000, 10000, 20000, 50000];

    if (!validAmounts.includes(amount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!method) {
      return res.status(400).json({ message: 'Select payment method' });
    }

    const bonus = Math.floor(amount * 0.03);
    const total = amount + bonus;

    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, amount, bonus, total, method, status)
       VALUES ($1,$2,$3,$4,$5,'pending')
       RETURNING *`,
      [req.user.id, amount, bonus, total, method]
    );

    const order = orderResult.rows[0];

    // create pending transaction
    await pool.query(
      `INSERT INTO transactions 
       (user_id, amount, type, status, reference_id, description)
       VALUES ($1,$2,'recharge','pending',$3,'Recharge Initiated')`,
      [req.user.id, amount, order.id]
    );

    res.json({
      order_id: order.id,
      amount,
      bonus,
      total,
      message: `Recharge ₹${amount}, Get ₹${total}`
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/confirm-recharge', auth, async (req, res) => {
  const client = await pool.connect();

  try {
    const { order_id, payment_id } = req.body;

    if (!order_id || !payment_id) {
      return res.status(400).json({ message: 'Missing data' });
    }

    await client.query('BEGIN');

    // lock order
    const orderRes = await client.query(
      'SELECT * FROM orders WHERE id=$1 AND user_id=$2 FOR UPDATE',
      [order_id, req.user.id]
    );

    const order = orderRes.rows[0];

    if (!order) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Order not found' });
    }

    if (order.status === 'success') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Already processed' });
    }

    // check duplicate payment_id
    const existingPayment = await client.query(
      'SELECT id FROM orders WHERE payment_id=$1',
      [payment_id]
    );

    if (existingPayment.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Payment already used' });
    }

    // update order
    await client.query(
      `UPDATE orders 
       SET status='success', payment_id=$1 
       WHERE id=$2`,
      [payment_id, order_id]
    );

    // update wallet
    await client.query(
      `UPDATE users 
       SET wallet = wallet + $1 
       WHERE id=$2`,
      [order.total, req.user.id]
    );

    // get updated balance
    const userRes = await client.query(
      'SELECT wallet FROM users WHERE id=$1',
      [req.user.id]
    );

    const balance = userRes.rows[0].wallet;

    // update recharge transaction
    await client.query(
      `UPDATE transactions 
       SET status='success', 
           description='Recharge Successful',
           balance_after=$2
       WHERE reference_id=$1 AND type='recharge'`,
      [order_id, balance]
    );

    // insert bonus transaction
    if (order.bonus > 0) {
      await client.query(
        `INSERT INTO transactions 
         (user_id, amount, type, status, description, balance_after)
         VALUES ($1,$2,'bonus','success','3% Recharge Bonus',$3)`,
        [req.user.id, order.bonus, balance]
      );
    }

    await client.query('COMMIT');

    res.json({
      message: 'Recharge successful',
      credited: order.total,
      balance
    });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

router.post('/recharge-history', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT id, amount, bonus, total, status, created_at 
     FROM orders 
     WHERE user_id=$1
     ORDER BY id DESC`,
    [req.user.id]
  );

  res.json({ history: result.rows });
});

router.post('/recharge-options', async (req, res) => {
  res.json({
    amounts: [200, 500, 1000, 2000, 5000,10000,20000,50000],
    bonusPercent: 3,
    methods: ['UPI', 'Paytm', 'PhonePe']
  });
});


router.post('/recharge-details', auth, async (req, res) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ message: 'Order ID required' });
    }

    // get order
    const orderRes = await pool.query(
      `SELECT 
         id,
         amount,
         bonus,
         total,
         method,
         status,
         payment_id,
         created_at
       FROM orders
       WHERE id=$1 AND user_id=$2`,
      [order_id, req.user.id]
    );

    const order = orderRes.rows[0];

    if (!order) {
      return res.status(404).json({ message: 'Recharge not found' });
    }

    // get related transactions
    const txnRes = await pool.query(
      `SELECT 
         id,
         amount,
         type,
         status,
         description,
         created_at
       FROM transactions
       WHERE reference_id=$1
       ORDER BY id ASC`,
      [order_id]
    );

    res.json({
      order,
      transactions: txnRes.rows
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/withdraw', auth, async (req, res) => {
  const { amount } = req.body;

  const userRes = await pool.query(
    'SELECT wallet FROM users WHERE id=$1',
    [req.user.id]
  );

  if (userRes.rows[0].wallet < amount) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  await pool.query(
    `INSERT INTO withdrawals (user_id, amount, status)
     VALUES ($1,$2,'pending')`,
    [req.user.id, amount]
  );

  res.json({ message: 'Withdraw request submitted' });
});

router.post('/approve-withdraw', auth, admin, async (req, res) => {
  const client = await pool.connect();

  try {
    const { withdraw_id } = req.body;

    await client.query('BEGIN');

    const wd = await client.query(
      'SELECT * FROM withdrawals WHERE id=$1 FOR UPDATE',
      [withdraw_id]
    );

    const data = wd.rows[0];

    if (!data || data.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Invalid request' });
    }

    // deduct wallet
    await client.query(
      'UPDATE users SET wallet = wallet - $1 WHERE id=$2',
      [data.amount, data.user_id]
    );

    const userRes = await client.query(
      'SELECT wallet FROM users WHERE id=$1',
      [data.user_id]
    );

    // transaction entry
    await client.query(
      `INSERT INTO transactions 
       (user_id, amount, type, status, reference_id, description, balance_after)
       VALUES ($1,$2,'withdraw','success',$3,'Withdraw Approved',$4)`,
      [data.user_id, data.amount, withdraw_id, userRes.rows[0].wallet]
    );

    await client.query(
      `UPDATE withdrawals SET status='approved' WHERE id=$1`,
      [withdraw_id]
    );

    await client.query('COMMIT');

    res.json({ message: 'Withdraw approved' });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

router.post('/wallet-summary', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // current balance
    const user = await pool.query(
      'SELECT wallet FROM users WHERE id=$1',
      [userId]
    );

    // total recharge
    const recharge = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total 
       FROM transactions 
       WHERE user_id=$1 AND type='recharge' AND status='success'`,
      [userId]
    );

    // total bonus
    const bonus = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total 
       FROM transactions 
       WHERE user_id=$1 AND type='bonus' AND status='success'`,
      [userId]
    );

    // total withdraw
    const withdraw = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total 
       FROM transactions 
       WHERE user_id=$1 AND type='withdraw' AND status='success'`,
      [userId]
    );

    res.json({
      balance: user.rows[0].wallet,
      total_recharge: Number(recharge.rows[0].total),
      total_bonus: Number(bonus.rows[0].total),
      total_withdraw: Number(withdraw.rows[0].total)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/transactions', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT amount, type, status, description, balance_after, created_at
     FROM transactions
     WHERE user_id=$1
     ORDER BY id DESC`,
    [req.user.id]
  );

  res.json({ transactions: result.rows });
});
module.exports = router;

