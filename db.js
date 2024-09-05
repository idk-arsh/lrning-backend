import pg from 'pg';
const { Pool } = pg;



const pool = new Pool({
  user: 'ash_xoge_user',
  host: 'dpg-crcgqjt2ng1s73crv7pg-a',
  database: 'ash_xoge',
  password: 'ksLJZAIXUn7D6jdrOHNsUGZZ0psF3icm',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to the database');
    client.release();
  } catch (err) {
    console.error('Database connection error', err);
  }
}

testConnection();
export default pool;
