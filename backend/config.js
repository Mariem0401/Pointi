const dotenv = require('dotenv');

const envResult = dotenv.config({ path: './.env' });
if (envResult.error) {
  console.error('Error loading .env file:', envResult.error);
  process.exit(1);
}
console.log('Loaded environment variables:', {
  DATABASE: process.env.DATABASE ? '[SET]' : undefined,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ? '[SET]' : undefined,
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY ? '[REDACTED]' : undefined,
  MAILTRAP_HOST: process.env.MAILTRAP_HOST,
  MAILTRAP_PORT: process.env.MAILTRAP_PORT,
  MAILTRAP_USER: process.env.MAILTRAP_USER,
  MAILTRAP_PASS: process.env.MAILTRAP_PASS ? '[REDACTED]' : undefined,
});

module.exports = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD),
};