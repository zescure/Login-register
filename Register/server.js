const express = require('express');
const fs = require('fs');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: 'kingzezy-secret',
  resave: false,
  saveUninitialized: true
}));

const USERS_FILE = './users.json';

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/register', (req, res) => {
  const { email } = req.body;
  const users = readUsers();

  if (users.find(u => u.email === email)) {
    return res.json({ message: 'Email sudah terdaftar' });
  }

  users.push({ email });
  writeUsers(users);

  res.json({ message: 'Berhasil daftar, silakan login.' });
});

app.post('/login', (req, res) => {
  const { email } = req.body;
  const users = readUsers();

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.json({ success: false, message: 'Email belum terdaftar.' });
  }

  req.session.user = user;
  res.json({ success: true });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
