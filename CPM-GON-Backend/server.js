// Importation des modules nécessaires
const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const path = require('path');

// Création de l'application Express
const app = express();
const port = 3000;  // Le port sur lequel le serveur va écouter

// Middleware
app.use(cors()); // Pour permettre les requêtes CORS
app.use(express.json()); // Pour que l'app puisse lire le JSON des requêtes

// Configuration de la base de données SQLite
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.sqlite'), (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données', err.message);
  } else {
    console.log('Connexion à la base de données SQLite réussie');
  }
});

// Création de la table des tâches si elle n'existe pas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    deadline TEXT,
    priority TEXT,
    category TEXT
  )`);
});

// Routes API

// Route pour récupérer toutes les tâches
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows); // 🔥 envoyer directement le tableau de tâches
  });
});


// Route pour ajouter une nouvelle tâche
app.post('/api/tasks', (req, res) => {
  const { title, description, deadline, priority, category } = req.body;

  // Ensure all required fields are provided
  if (!title || !deadline) {
    return res.status(400).json({ error: 'Title and Deadline are required.' });
  }

  // Prepare the SQL statement to insert a new task
  const stmt = db.prepare('INSERT INTO tasks (title, description, deadline, priority, category) VALUES (?, ?, ?, ?, ?)');

  stmt.run([title, description, deadline, priority, category], function(err) {
    if (err) {
      // If there's an error, return the error message
      return res.status(500).json({ error: err.message });
    }

    // If the task is successfully added, return the taskId
    res.status(201).json({
      taskId: this.lastID,
      title,
      description,
      deadline,
      priority,
      category
    });
  });
});


// Route pour supprimer une tâche
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ message: `Tâche supprimée avec ID ${id}` });
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
