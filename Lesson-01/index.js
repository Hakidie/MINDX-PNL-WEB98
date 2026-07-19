const listUserName = ["Doraemon", "Nobita", "Yzuka", "Naruto"];
listUserName.forEach((item) => {
  console.log(`Xin chào bạn ${item}!`);
});

const utils = require('./utils.js');

const format = utils.formatPhoneNumber('2345678900');
console.log(format);
// (234) 567-8900
