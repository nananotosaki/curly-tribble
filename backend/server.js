const app = require('./app');
const connectDB = require('./config/db');

connectDB().then(() => {
  app.listen(3000, () => console.log('running at http://localhost:3000'));
});