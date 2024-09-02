import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hello',
  password: '8666',
  port: 5432, 
})
export default pool;
