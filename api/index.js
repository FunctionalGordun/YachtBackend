require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const expressWinston = require('express-winston')
// const { requestLogger, logger } = require('../logger')

const connectDB = require('../config/db');
const { connectBot } = require('../bot/index');
const eventsRoutes = require('../routes/eventsRoutes');
const bookingRoutes = require('../routes/bookingEventRoutes');
const adminRoutes = require('../routes/adminRoutes');

connectBot();

connectDB();
const app = express();

// error logging
// app.use(expressWinston.logger({
//   winstonInstance: requestLogger,
//   statusLevels: true
// }))

// We are using this for the express-rate-limit middleware
// See: https://github.com/nfriedly/express-rate-limit
app.enable('trust proxy');

app.use(express.json({ limit: '4mb' }));

const corsOptions = {
  // origin: ['http://localhost:3000', 'https://zoonyanya.ru', 'https://zoonyanya-admin.vercel.app'],
  credentials: true,
}
app.use(cors(corsOptions));

//root route
app.get('/', (req, res) => {
  res.send('App works properly!');
});

app.use('/api/events/', eventsRoutes);
app.use('/api/booking/', bookingRoutes);
app.use('/api/admin/', adminRoutes);


//test reset
app.get('/error', (req, res) => {
  throw new Error('This is a custom error')
})

// Use winston error handling middleware
// app.use(expressWinston.errorLogger({
//   winstonInstance: logger
// }))

// Use express's default error handling middleware
// app.use((err, req, res, next) => {
//   if (res.headersSent) return next(err);
//   res.status(400).json({ err: err });
// });

const PORT = process.env.PORT || 6969;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
