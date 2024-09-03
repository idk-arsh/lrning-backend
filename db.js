import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'hello_2bns_user',
  host: 'dpg-cratsdjtq21c73cda4g0-a.oregon-postgres.render.com',
  database: 'hello_2bns',
  password: 'TV15d9t9o1NXSVygIyZ23QX3NbfJVX0F',
  port: 5432,
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