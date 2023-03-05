require('dotenv').config();

const isAdmin = (id) => {
  return process.env.ADMINS_ID.includes(id);
}

const getEventMessage = ({title, date, description, price, capacity}) => {
  return `${title}
  ${description}
  ${price}`
}

const getEventInlineKeyboard = (id, isAdmin) => {
   const inline_keyboard = [
    [{ text: 'Забронировать', web_app: {url: `${process.env.WEB_APP_URL}/booking/?eventId=${id}`} }],
    [{ text: 'Подробнее', callback_data: 'moreinfo' }],
  ]
    if (isAdmin) {
      inline_keyboard.push([{ text: 'Посетители',  web_app: {url: `${process.env.WEB_APP_URL}/booking/?eventId=${id}`} }]);
      inline_keyboard.push([{ text: 'Редактировать',  web_app: {url: `${process.env.WEB_APP_URL}/booking/?eventId=${id}`} }]);
  }
  return { inline_keyboard }
}

const getAdminKeyboard = () => {
  const inline_keyboard = [
   [{ text: 'События', web_app: {url: `${process.env.WEB_APP_URL}/booking/`} }],
   [{ text: 'Клиенты', web_app: {url: `${process.env.WEB_APP_URL}/booking/`} }],
 ]
 return { inline_keyboard }
}

module.exports = { isAdmin, getEventMessage, getEventInlineKeyboard, getAdminKeyboard  };