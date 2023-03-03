require('dotenv').config();

const isAdmin = (id) => {
  return process.env.ADMINS_ID.includes(id);
}

const getEventMessage = ({title, date, description, price, capacity}) => {
  return `${title}
  ${description}
  ${price}`
}

const getEventInlineKeyboard = (id) => {
  return {
    inline_keyboard: [
      [{ text: 'Забронировать', web_app: {url: `${process.env.WEB_APP_URL}?eventId=${id}`, title:'YTEET'} }],
      [{ text: 'Подробнее', callback_data: 'moreinfo' }],
    ]
  }
}

module.exports = { isAdmin, getEventMessage, getEventInlineKeyboard  };