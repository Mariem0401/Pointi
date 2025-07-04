require('dotenv').config();
const express = require('express');
const server = express(); /* l'app est une instance d'express */
const CodeController = require('./Controller/codeController');
const mongoose = require('mongoose');
const { port, databaseUrl } = require('./config');

server.use(express.json());

server.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

const userRoutes = require('./Routes/UserRoutes');
const attendanceRoutes =require('./Routes/attendanceRoutes')
server.use('/users', userRoutes);
server.use('/attendance', attendanceRoutes);

mongoose
  .connect(databaseUrl)
  .then((connection) => {
    console.log('DB connected successfully');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

async function testEmailSending() {
  console.log(`[TEST] Sending emails at ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}...`);
  try {
    const results = await CodeController.sendDailyCodes();
    console.log('[SUCCESS] Email sending results:', results);
  } catch (error) {
    console.error('[ERROR] Failed to send emails:', error);
  }
}

// Call the function immediately
testEmailSending();

require('./jobs/dailyCodeJob').start();