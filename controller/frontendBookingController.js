// const BookingEvent = require('../models/BookingEvent');
// const BookingCustomer = require('../models/BookingCustomer');
// const Room = require('../models/Room');
// const { GetFreeRooms } = require('../utils/getFreeRooms/getFreeRooms');
// const { YooCheckout, ICapturePayment } = require('@a2seven/yoo-checkout');
// const checkout = new YooCheckout({ shopId: process.env.SHOP_ID, secretKey: process.env.SECRET_KEY });
// const nodemailer = require('nodemailer');
// const telegramBot = require('node-telegram-bot-api');

// const token = process.env.BOT_TOKEN;

// const bot = new telegramBot (token, {polling:true});

// const DeliveryTitles = {
// 	both: 'до гостиницы и обратно',
// 	in: 'до гостиницы',
// 	out: 'из гостиницы до дома',
// };

// const PetSizes = {
// 	small: 'Маленькая до 5кг',
// 	medium: 'Средняя от 5 до 15кг',
// 	big: 'Крупная от 15кг до 20кг',
// 	biggest: 'Большая от 20кг и больше',
//   cat: 'Кот'
// }

// const PetSex = {
//   male: 'Мальчик',
//   female: 'Девочка',
// }

// const getServices = (services, petId) => {
//   if (!services) return null;
//   const output = []

//   services.map(serv => {
//     if (serv.petId === petId) {
//       const service = {
//         id: String(serv.serviceId),
//         typeId: String(serv.serviceTypeId),
//         status: false,
//         amount: serv.amount,
//       }
//       output.push(service);
//     }
//   })
//   return output;
// }

// const getUser = async (user) => {
//   if (!user) return null;

//   const { phone, email } = user;
//   const bookingCustomers = phone ? await BookingCustomer.find({$or:[{phone},{email}]}) : null;
//   if (bookingCustomers && bookingCustomers.length !== 0) {
//     const existingCustomer = bookingCustomers[0];
//     existingCustomer.petArr = user.petArr;
//     await existingCustomer.save();
//     return existingCustomer;
//   } else {
//     const newBookingCustomer = new BookingCustomer(user);
//     await newBookingCustomer.save();
//     return newBookingCustomer;
//   }
// }

// const getFreeRooms = async (start, end) => {
//   const rooms = await Room.find({}).sort({ _id: -1 });
//   const bookingEvents = await BookingEvent.find({}).sort({ _id: -1 });
//   const freeRooms = GetFreeRooms(rooms, bookingEvents, start, end);
//   return freeRooms;
// };

// const sortRooms = (avaliableRooms) => {
//   if (!avaliableRooms) return null
//   const output = {
//     comfort: [],
//     family: []
//   }
//   avaliableRooms.map(room => {
//     if (room.roomtype === 'comfort')
//       output.comfort.push(String(room._id));
//     else
//       output.family.push(String(room._id));
//   })
//   return output;
// }

// const getAvaliableRoomId = (avaliableRooms, roomId) => {
//   const tmp = avaliableRooms.filter(el => el !== roomId);
//   return tmp[0];
// }

// const getAvaliableRoom = async (rooms, start, end) => {
//   const avaliableRooms = await getFreeRooms(start, end);
//   let sortedRooms = sortRooms(avaliableRooms);

//   const output = rooms.map(room => {
//     if (sortedRooms[room.roomType].length === 0) throw new Error('full')
//     const roomOk = sortedRooms[room.roomType].includes(room.roomId);

//     if (!roomOk) {
//      const newRoomId = getAvaliableRoomId(sortedRooms[room.roomType], room.roomId);
//       sortedRooms[room.roomType] = sortedRooms[room.roomType].filter(el => el !== newRoomId);
//       room.roomId = newRoomId;
//     }
//     room.roomName = avaliableRooms.find(el => el._id == room.roomId)?.name;
//     return room;
//   })

//   return output;
// }


// const addFrontendBookingEvent = async (req, res) => {
//   try {
//     const {
//       user,
//       rooms,
//       services,
//       start,
//       end,
//       comment,
//       transfer,
//       paymentMethod,
//       paidStatus,
//       totalPrice,
//       paidPrice,
//       discount,
//       watchedStatus,
//     } = req.body;
//     if (!user || !rooms) res.status(403).send({
//       message: 'Что-то пошло не так.'
//     })
//     const { email = 'gordey.moskvichev@gmail.com', name = 'пользователь не указал', phone = 'пользователь не указал', petArr = []} = user;

//     const successRooms = await getAvaliableRoom(rooms, start, end);

//     sendEmail(res, email, name, start, end);
//     sendManagerEmail(res, email, name, phone, petArr, successRooms, start, end, totalPrice, paidStatus, paymentMethod, transfer);
//     sendTGManagerEmail(res, email, name, phone, petArr, successRooms, start, end, totalPrice, paidStatus, paymentMethod, transfer);

//     getUser(user).then(res => {
//       if (res){
//         const { _id: userId, petArr } = res;

//         successRooms.map(async (room) => {
//           const { roomId, petsId } = room;
//           let pets = [];
//           petsId.map((pet) => {
//             const petId = String(petArr.filter(val => val.tmpId === pet)[0]._id);
//             const petServices = getServices(services, pet);

//             petInfo = {
//               petId,
//               services: petServices,
//             }
//             pets.push(petInfo);
//           })
//           const bookingData = {
//             start,
//             end,
//             room_id: roomId,
//             user_id: String(userId),
//             comment,
//             pets,
//             transfer,
//             status: 'willbe',
//             paid_status: paidStatus,
//             payment_method: paymentMethod,
//             total_price: totalPrice,
//             paid_price: paidPrice,
//             discount,
//             watched_status: watchedStatus,
//           }
//           const newBookingEvent = new BookingEvent(bookingData);
//           await newBookingEvent.save();
//         })
//       }
//     }).catch(err => {
//       res.status(303).send({
//         message: 'Ошибка создания пользователя',
//       });
//     })
//     res.status(200).send({
//       message: 'Бронирование успешно добавлено!'
//     });
//   } catch (err) {
//     if (err.message === 'full') {
//       res.status(303).send({
//         message: 'Все комнаты забронированы',
//       });
//     } else {
//       res.status(500).send({
//         message: 'Ошибка бронирования',
//       });
//     }
//   }
// };

// const getPayment = async (req, res) => {
//   try {
//     const { idempotenceKey, value, description, receipt } = req.body;
    
//     const createPayload = {
//       amount: {
//         value: value,
//         currency: 'RUB'
//       },
//       description: description,
//       // payment_method_data: {
//       //   type: 'bank_card'
//       // },
//       // payment_methods: [],
//       confirmation: {
//         type: 'embedded'
//       },
//       capture: true,

//       receipt: receipt
//     };
  
//     const payment = await checkout.createPayment(createPayload, idempotenceKey);

//     res.status(200).send({
//       message: 'OK',
//       token: payment.confirmation.confirmation_token
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: 'Ошибка оплаты',
//     });
//   }
// }

// const sendEmail = (res, email, name, start, end) => {
//   const startDateString = new Date(start).toLocaleDateString();
// 	const endDateString = new Date(end).toLocaleDateString();

//   const body = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Подтверждение бронирования',
//     html: `
//       <div style="background-color: #DAF2FF; text-align: center; margin: 10px 10px 0; border-radius: 20px; padding: 10px;">
//         <img src="https://res.cloudinary.com/zoonyanya/image/upload/v1667823873/emaillogo_mo0xsx.png" height="170px" width="200px"></img>
//         <div style="padding: 10px; background-color: #77EFA3; border-radius: 20px; margin: 10px; text-align: center;">
//           <span style="font-weight: 400;">Номер забронирован</span>
//         </div>
//         <h2 style="margin-top: 0">👋🏻 Здравствуйте, ${name}, это Зооняня</h2>
//         <h3>Вы забронировали номер</h3>
//         <h3>С ${startDateString} по ${endDateString}</h3>
//         <p>
//           Благодарим за доверие.</br>
//         Полина свяжется с вами для подтверждения бронирования
//         </p>
//         <h3>С любовью, Зооняня</h3>
//       </div>
//     `
//   };

//   const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     service: process.env.SERVICE,
//     port: process.env.EMAIL_PORT,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   transporter.verify(function (err, success) {
//     if (err) {
//       res.status(403).send({
//         message: `Ошибка инициализации Email`,
//       });
//     } else {
//       console.log('Server is ready to take our messages');
//     }
//   });

//   transporter.sendMail(body, (err, data) => {
//     if (err) {
//       res.status(403).send({
//         message: `Произошла ошибка отправки email ${err.message}`,
//       });
//     } else {
//       console.log('sendMail OK');
//     }
//   });
// };

// const sendTGManagerEmail = (res, userEmail, userName, userPhone, petArr = [], rooms = [], start, end, totalPrice, paidStatus, paymentMethod, transfer) => {
//   const startDateString = new Date(start).toLocaleDateString();
// 	const endDateString = new Date(end).toLocaleDateString();

//   let petsMsg = '';

//   if (rooms.length && petArr) {
//     rooms.map(room => {
//       const { petsId, roomType, roomName } = room;
//       const copy = petArr.filter(pet => petsId.includes(pet.tmpId))
//       petsMsg += `${roomType == 'comfort' ? 'Комфорт' : 'Семейный'} ${roomName}\n`
//       copy.map((pet, index) => {
//         if (pet.pettype) petsMsg += `${pet.pettype === 'dog' ? 'Собака' : 'Кошка'}\n`
//         if (pet.petname) petsMsg += `Имя: ${pet.petname}\n`
//         if (pet.petsize) petsMsg += `Размер: ${PetSizes[pet.petsize]}\n`
//         if (pet.petsex) petsMsg += `Пол: ${PetSex[pet.petsex]}\n`
//         if (pet.petage) petsMsg += `Возраст: ${pet.petage}\n`
//         if (pet.petbreed) petsMsg += `Порода: ${pet.petbreed}\n`
//         if (pet.petpassport) petsMsg += `Вет Паспорт: ${pet.petpassport ? 'Есть' : 'НЕТ'}\n`
//         if (pet.petsterilization) petsMsg += `Стерелизация: ${pet.petsterilization ? 'Есть' : 'НЕТ'}\n`
//         if (pet.petbgraftdate) petsMsg += `Дата КП: ${pet.petbgraftdate}\n`
//         if (pet.petcomment) petsMsg += `Комментарий: ${pet.petcomment}\n`
//         if (index != copy.length - 1) petsMsg += `+\n`;
//       })
//       petsMsg += `\n`;
//     })
//   }

//   const message = `Новое бронирование на сайте!
// Даты: ${startDateString} - ${endDateString}
// Цена: ${totalPrice} ₽
// Статус: ${paidStatus == 'paid' ? 'Оплачено' : 'Не оплачено'}
// Оплата: ${paymentMethod == 'card' ? 'Картой оналайн' : 'При заселении'}
// ${transfer?.transferStatus ? 
//     `Трансфер ${transfer?.transferWay ? DeliveryTitles[transfer.transferWay] : ''}
//     Адрес: ${transfer?.transferAddress}
//     Цена: ${transfer?.transferPrice} ₽
//     Время: ${transfer?.transferTime}
//   ` : ''}
// Имя пользователя: ${userName}.
// Email пользователя: ${userEmail}.
// Телефон пользователя: ${userPhone}.
// TG: https://t.me/+${userPhone}

// ${petsMsg}
//   `;

//   bot.sendMessage(
//     process.env.BOT_CHAT_ID,
//     message
//   ).catch(e => {
//     bot.sendMessage(msg.chat.id,`Oops! An error has occured. Try again`);
//   });
// }


// const sendManagerEmail = (res, userEmail, userName, userPhone, petArr = [], rooms = [], start, end, totalPrice, paidStatus, paymentMethod, transfer) => {
//   const startDateString = new Date(start).toLocaleDateString();
// 	const endDateString = new Date(end).toLocaleDateString();

//   let petsMsg = '';

//   if (rooms.length && petArr) {
//     rooms.map(room => {
//       const { petsId, roomType, roomName } = room;
//       const copy = petArr.filter(pet => petsId.includes(pet.tmpId))
//       petsMsg += `<h4>${roomType == 'comfort' ? 'Комфорт' : 'Семейный'} ${roomName}</h4>`
//       copy.map(pet => {
//         if (pet.pettype) petsMsg += `<p>${pet.pettype === 'dog' ? 'Собака' : 'Кошка'}</p>`
//         if (pet.petname) petsMsg += `<p>Имя: ${pet.petname}</p>`
//         if (pet.petsize) petsMsg += `<p>Размер: ${PetSizes[pet.petsize]}</p>`
//         if (pet.petsex) petsMsg += `<p>Пол: ${PetSex[pet.petsex]}</p>`
//         if (pet.petage) petsMsg += `<p>Возраст: ${pet.petage}</p>`
//         if (pet.petbreed) petsMsg += `<p>Порода: ${pet.petbreed}</p>`
//         if (pet.petpassport) petsMsg += `<p>Вет Паспорт: ${pet.petpassport ? 'Есть' : 'НЕТ'}</p>`
//         if (pet.petsterilization) petsMsg += `<p>Стерелизация: ${pet.petsterilization ? 'Есть' : 'НЕТ'}</p>`
//         if (pet.petbgraftdate) petsMsg += `<p>Дата КП: ${pet.petbgraftdate}</p>`
//         if (pet.petcomment) petsMsg += `<p>Комментарий: ${pet.petcomment}</p>`
//       })
//       petsMsg += `<p>--------------------------</p>`;
//     })
//   }

//   const body = {
//     from: process.env.EMAIL_USER,
//     to: process.env.MANAGER_EMAIL,
//     subject: 'Новое бронирование',
//     html: `<h2>Новое бронирование на сайте!</h2>
//     <h3>Даты: ${startDateString} - ${endDateString}</h3>
//     <h3>Цена: ${totalPrice} ₽</h3>
//     <h3>Статус: ${paidStatus == 'paid' ? 'Оплачено' : 'Не оплачено'}</h3>
//     <h3>Оплата: ${paymentMethod == 'card' ? 'Картой оналайн' : 'При заселении'}</h3>
//     ${transfer?.transferStatus ? 
//       `<h3>Трансфер ${transfer?.transferWay ? DeliveryTitles[transfer.transferWay] : ''}</h3>
//       <h4>Адрес: ${transfer?.transferAddress}</h4>
//       <h4>Цена: ${transfer?.transferPrice} ₽</h4>
//       <h4>Время: ${transfer?.transferTime}</h4>
//     ` : ''}
//     <h4>Имя пользователя: <strong>${userName}</strong>.</h4>
//     <h4>Email пользователя: <strong>${userEmail}</strong>.</h4>
//     <h4>Телефон пользователя: <strong>${userPhone}</strong>.</h4>
//     <h3>Питомцы</h3>
//     ${petsMsg}
//     `,
//   };

//   const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     service: process.env.SERVICE,
//     port: process.env.EMAIL_PORT,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   transporter.verify(function (err, success) {
//     if (err) {
//       res.status(403).send({
//         message: `Ошибка инициализации Email`,
//       });
//     } else {
//       console.log('Server is ready to take our messages');
//     }
//   });

//   transporter.sendMail(body, (err, data) => {
//     if (err) {
//       res.status(403).send({
//         message: `Произошла ошибка отправки email ${err.message}`,
//       });
//     } else {
//       console.log('sendMail OK');
//     }
//   });
// };

// const addFrontendGroomingEvent = async (req, res) => {
//   try {
//     const {
//       name,
//       phone,
//       email,
//       date,
// 			pettype,
// 			petbreed,
//       serviceData,
//       totalPrice,
//     } = req.body;
//     sendGroomingEmail(res, email, name, date, serviceData);
//     sendManagerGroomingEmail(res, name, email, phone, pettype, petbreed, date, serviceData, totalPrice);
//     sendTGManagerGrooming(res, name, email, phone, pettype, petbreed, date, serviceData, totalPrice);

//     res.status(200).send({
//       message: 'Бронирование успешно добавлено!'
//     });
//   } catch (err) {
//     res.status(500).send({
//       message: 'Ошибка бронирования',
//     });
//   }
// }

// const sendGroomingEmail = (res, email, name, date, serviceData) => {
//   const dateString = new Date(date).toLocaleDateString();
//   let serviceStr = '';
//   serviceData.map(service => {
//     serviceStr += `<h4>${service.title} ${service.price}₽</h4>`
//   })

//   const body = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Подтверждение бронирования',
//     html: `
//       <div style="background-color: #DAF2FF; text-align: center; margin: 10px 10px 0; border-radius: 20px; padding: 10px;">
//         <img src="https://res.cloudinary.com/zoonyanya/image/upload/v1667823873/emaillogo_mo0xsx.png" height="170px" width="200px"></img>
//         <div style="padding: 10px; background-color: #77EFA3; border-radius: 20px; margin: 10px; text-align: center;">
//           <span style="font-weight: 400;">Услуга забронирована</span>
//         </div>
//         <h2 style="margin-top: 0">👋🏻 Здравствуйте, ${name}, это Зооняня</h2>
//         <h3>Вы забронировали услугу груминга</h3>
//         ${serviceStr}
//         <h3>Дата: ${dateString}</h3>
//         <p>
//           Благодарим за доверие.</br>
//         Полина свяжется с вами для подтверждения бронирования
//         </p>
//         <h3>С любовью, Зооняня</h3>
//       </div>
//     `
//   };

//   const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     service: process.env.SERVICE,
//     port: process.env.EMAIL_PORT,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   transporter.verify(function (err, success) {
//     if (err) {
//       res.status(403).send({
//         message: `Ошибка инициализации Email`,
//       });
//     } else {
//       console.log('Server is ready to take our messages');
//     }
//   });

//   transporter.sendMail(body, (err, data) => {
//     if (err) {
//       res.status(403).send({
//         message: `Произошла ошибка отправки email ${err.message}`,
//       });
//     } else {
//       console.log('sendMail OK');
//     }
//   });
// };

// const sendManagerGroomingEmail = (res, name, email, phone, pettype, petbreed, date, serviceData, totalPrice) => {
//   const dateString = new Date(date).toLocaleDateString();

//   let serviceStr = '';
//   serviceData.map(service => {
//     serviceStr += `<h4>${service.title} ${service.price}₽</h4>`
//   })

//   const body = {
//     from: process.env.EMAIL_USER,
//     to: process.env.MANAGER_EMAIL,
//     subject: 'Новое бронирование Груминга',
//     html: `<h2>Новое бронирование Груминга на сайте!</h2>
//     <h3>Дата: ${dateString}</h3>
//     <h3>Цена: ${totalPrice} ₽</h3>
//     <h4>Имя пользователя: <strong>${name}</strong>.</h4>
//     <h4>Email пользователя: <strong>${email}</strong>.</h4>
//     <h4>Телефон пользователя: <strong>${phone}</strong>.</h4>
//     <h3>Питомцец</h3>
//     <h4>${pettype == 'dog' ? 'Собака' : 'Кошка'}</h4>
//     <h4>Порода: ${petbreed}</h4>
//     ${serviceStr}
//     `,
//   };

//   const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     service: process.env.SERVICE,
//     port: process.env.EMAIL_PORT,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   transporter.verify(function (err, success) {
//     if (err) {
//       res.status(403).send({
//         message: `Ошибка инициализации Email`,
//       });
//     } else {
//       console.log('Server is ready to take our messages');
//     }
//   });

//   transporter.sendMail(body, (err, data) => {
//     if (err) {
//       res.status(403).send({
//         message: `Произошла ошибка отправки email ${err.message}`,
//       });
//     } else {
//       console.log('sendMail OK');
//     }
//   });
// };

// const sendTGManagerGrooming = (res, name, email, phone, pettype, petbreed, date, serviceData, totalPrice) => {
//   const dateString = new Date(date).toLocaleDateString();

//   let serviceStr = '';
//   serviceData.map(service => {
//     serviceStr += `${service.title} ${service.price}₽ \n`
//   })

//   const message = `Новое бронирование Груминга на сайте!
// Дата: ${dateString}
// Цена: ${totalPrice} ₽
// Имя пользователя: ${name}.
// Email пользователя: ${email}.
// Телефон пользователя: ${phone}.
// TG: https://t.me/+${phone}

// ${serviceStr}

// Питомцец
// ${pettype == 'dog' ? 'Собака' : 'Кошка'}
// Порода: ${petbreed}
//   `;

//   bot.sendMessage(
//     process.env.BOT_CHAT_ID,
//     message
//   ).catch(e => {
//     bot.sendMessage(msg.chat.id,`Oops! An error has occured. Try again`);
//   });
// }

// module.exports = {
//   addFrontendBookingEvent,
//   getPayment,
//   addFrontendGroomingEvent,
// };
