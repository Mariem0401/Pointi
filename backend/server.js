require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { port, databaseUrl } = require('./config');

const app = express();

// Origines autorisées (tu peux ajouter d'autres si besoin)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Permet les requêtes sans origin (ex: Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'La politique CORS ne permet pas l\'accès depuis cette origine : ' + origin;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // Important si tu utilises withCredentials côté client
}));

app.use(express.json());

// Routes
const apiRoutes = express.Router();
app.use('/api', apiRoutes);

apiRoutes.use('/users', require('./Routes/UserRoutes'));
apiRoutes.use('/attendance', require('./Routes/attendanceRoutes'));
apiRoutes.use('/departments', require('./Routes/departementRoutes'));
apiRoutes.use('/contracts', require('./Routes/contractRoutes'));
apiRoutes.use('/leaves', require('./Routes/leaveRoutes'));
apiRoutes.use('/notifications', require('./Routes/notifcationRoutes'));
apiRoutes.use('/salaries', require('./Routes/SalaireRoutes'));

// Connexion DB et démarrage serveur
mongoose.connect(databaseUrl)
  .then(() => {
    console.log('DB connected successfully');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);

      // Jobs planifiés
      require('./jobs/dailyCodeJob').start();
      require('./jobs/cleanCodeLogsJob').start();
    });
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

// Gestion des erreurs centralisée
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});
