const CALLBACK_DATA = {
  showEvent: {
    title: "Посмотреть события",
    callback_data: 'events',
  },

  yachts: {
    title: "Яхты",
    callback_data: 'yachts',
  },

}
console.log('TETETE', CALLBACK_DATA.showEvent.title)

const mainInlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: CALLBACK_DATA.showEvent.title, callback_data: CALLBACK_DATA.showEvent.callback_data }],
      [{ text: CALLBACK_DATA.yachts.title, callback_data: CALLBACK_DATA.yachts.callback_data }],
    ]
  }
}


const bookingKeyboard = {
  reply_markup: {
    keyboard: [[{text: "Кнопка 3", request_contact: true}], ["Кнопка 4"]]
    // inline_keyboard: [["Sample text", "Second sample"], ["Keyboard"], ["I'm robot"]]
    // keyboard: keyboard.map(item => [item.text])
  }
}

module.exports = { mainInlineKeyboard, bookingKeyboard, CALLBACK_DATA };