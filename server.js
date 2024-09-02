import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import pool from './db.js';
import fetch from 'node-fetch'; 

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/Register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO info(name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/SignUp', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM info WHERE email=$1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const name=user.name
    res.status(200).json({ message: 'Login successful',name });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Course not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/courses', async (req, res) => {
  const { title, duration, cost } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO courses (title, duration, cost) VALUES ($1, $2, $3) RETURNING *',
      [title, duration, cost === 'true'] // Ensure cost is a boolean
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { title, duration, cost } = req.body;
  try {
    const result = await pool.query(
      'UPDATE courses SET title = $1, duration = $2, cost = $3 WHERE id = $4 RETURNING *',
      [title, duration, cost === 'true', id] // Ensure cost is a boolean
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Course not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Course not found');
    }
    res.send('Course deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// New endpoint for Coursera API
app.get('/api/coursera', async (req, res) => {
  const query = req.query.query;
  const courseraToken = '5SN8agHQOO3nBWN2vzFAQ0VRQcaU';

  try {
    const response = await fetch(`https://api.coursera.org/api/courses.v1?q=search&query=${query}`, {
      headers: {
        Authorization: `Bearer ${courseraToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching Coursera courses:', err);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
