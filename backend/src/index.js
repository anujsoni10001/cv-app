import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/profile', (req, res) => {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  res.json(profile || {});
});

app.get('/api/experience', (req, res) => {
  const rows = db.prepare('SELECT * FROM experience ORDER BY sort_order ASC, id ASC').all();
  res.json(rows);
});

app.get('/api/projects', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, id ASC').all();
  res.json(rows);
});

app.get('/api/skills', (req, res) => {
  const rows = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC, id ASC').all();
  res.json(rows);
});

// Aggregate endpoint, handy for the frontend to fetch everything in one call
app.get('/api/cv', (req, res) => {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  const experience = db.prepare('SELECT * FROM experience ORDER BY sort_order ASC, id ASC').all();
  const projects = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, id ASC').all();
  const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC, id ASC').all();
  res.json({ profile, experience, projects, skills });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`CV backend listening on port ${PORT}`));
