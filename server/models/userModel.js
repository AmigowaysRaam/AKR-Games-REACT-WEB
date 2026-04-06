const pool = require('../config/db');

const createUser = async (phone) => {
  const result = await pool.query(
    'INSERT INTO users(phone) VALUES($1) RETURNING *',
    [phone]
  );
  return result.rows[0];
};

const findUserByPhone = async (phone) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE phone=$1',
    [phone]
  );
  return result.rows[0];
};

const updateOtp = async (phone, otp, expiry) => {
  const result = await pool.query(
    'UPDATE users SET otp=$1, otp_expiry=$2 WHERE phone=$3 RETURNING *',
    [otp, expiry, phone]
  );
  return result.rows[0];
};

const verifyUser = async (phone) => {
  const result = await pool.query(
    'UPDATE users SET is_verified=true WHERE phone=$1 RETURNING *',
    [phone]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByPhone,
  updateOtp,
  verifyUser
};