import { db } from './db.js';

const upsertProfile = db.prepare(`
  INSERT INTO profile (id, name, title, email, phone, location, summary)
  VALUES (1, @name, @title, @email, @phone, @location, @summary)
  ON CONFLICT(id) DO UPDATE SET
    name=excluded.name, title=excluded.title, email=excluded.email,
    phone=excluded.phone, location=excluded.location, summary=excluded.summary
`);

upsertProfile.run({
  name: 'Your Name',
  title: 'Software Engineer',
  email: 'you@example.com',
  phone: '+91-00000-00000',
  location: 'Madhya Pradesh, India',
  summary: 'Replace this with a short professional summary about yourself.'
});

db.exec('DELETE FROM experience; DELETE FROM projects; DELETE FROM skills;');

const insertExp = db.prepare(`
  INSERT INTO experience (company, role, start_date, end_date, description, sort_order)
  VALUES (@company, @role, @start_date, @end_date, @description, @sort_order)
`);
[
  {
    company: 'Example Corp',
    role: 'Software Engineer',
    start_date: '2023-01',
    end_date: 'Present',
    description: 'Describe your responsibilities and achievements here.',
    sort_order: 1
  }
].forEach((e) => insertExp.run(e));

const insertProject = db.prepare(`
  INSERT INTO projects (name, description, tech_stack, url, sort_order)
  VALUES (@name, @description, @tech_stack, @url, @sort_order)
`);
[
  {
    name: 'CV Website',
    description: 'A personal CV site with a React frontend and Express/SQLite backend.',
    tech_stack: 'React, Express, SQLite, Docker',
    url: '',
    sort_order: 1
  }
].forEach((p) => insertProject.run(p));

const insertSkill = db.prepare(`
  INSERT INTO skills (category, name, sort_order)
  VALUES (@category, @name, @sort_order)
`);
[
  { category: 'Languages', name: 'JavaScript', sort_order: 1 },
  { category: 'Languages', name: 'Python', sort_order: 2 },
  { category: 'Tools', name: 'Docker', sort_order: 3 }
].forEach((s) => insertSkill.run(s));

console.log('Database seeded.');
