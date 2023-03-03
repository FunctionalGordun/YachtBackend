// const { createLogger, format, transports } = require("winston");
// require('dotenv').config();
// // require('winston-mongodb');

// const logsFolder = `./logs/`

// const requestLogger = createLogger({
//   transports: [
//     new transports.Console(),s
//     new transports.File({
//         level: 'info',
//         filename: `${logsFolder}requestLogs.log`
//     }),
//     new transports.File({
//       level: 'warn',
//       filename: `${logsFolder}requestWarnings.log`
//     }),
//     new transports.File({
//         level: 'error',
//         filename: `${logsFolder}requestErrors.log`
//     }),
//     // MONGO DB
//     // new transports.MongoDB({
//     //     db: process.env.MONGO_URI,
//     //     collection: 'logs'
//     // })
//   ],
//   format: format.combine(
//       format.timestamp(),
//       format.json(),
//       format.prettyPrint(),
//       format.metadata(),
//   )
// })

// const logger = createLogger({
//     transports: [
//         new transports.Console(),
//         new transports.File({
//           level: 'info',
//           filename: `${logsFolder}logs.log`
//       }),
//       // MONGO DB
//       //   new transports.MongoDB({
//       //     db: process.env.MONGO_URI,
//       //     collection: 'apiLogs'
//       // })
//     ],
//     format:  format.combine(
//         format.timestamp(),
//         format.json(),
//         format.prettyPrint(),
//         format.metadata(),
//     )
// })

// module.exports = {requestLogger, logger}