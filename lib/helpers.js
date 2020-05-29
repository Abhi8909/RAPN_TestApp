/**
 * Handlers methods
 *
 */

// Dependencies
const crypto = require("crypto");
const config = require("../config");

// Container of the handler
let helpers = {};

// SHA256 hash
helpers.hash = function (str) {
  if (typeof str === "string" && str.length > 0) {
    let hash = crypto
      .createHmac("SHA256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

helpers.validateEmail = function (email) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

// get menu
helpers.getMenu = function (numOfItems = 10) {
  let menu = [];
  let index = 0;

  while (numOfItems--) {
    index += 1;
    menu.push({
      name: "Dish " + index,
      id: index,
      price: 500 + index,
      qty: 1,
    });
  }

  return menu;
};

helpers.getRandomString = function (length = 25) {
  if (typeof length === "number") {
    let possibleChar =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let randomStr = "";
    while (length--) {
      randomStr += possibleChar.charAt(
        Math.floor(Math.random() * possibleChar.length)
      );
    }
    return randomStr;
  } else {
    return false;
  }
};

helpers.createMessage = function (order) {
  let msg = "";

  order.items.forEach((item, index) => {
    msg += `${index + 1} ${Array(5).fill("\xa0").join("")} ${item.name} ${Array(
      5
    )
      .fill("\xa0")
      .join("")} ${item.qty} ${Array(5).fill("\xa0").join("")} ${
      item.price
    } \n`;
  });

  msg += `\n ${order.items.length} ${Array(5).fill("\xa0").join("")} ${Array(5)
    .fill("\xa0")
    .join("")} ${Array(5).fill("\xa0").join("")} ${order.total} \n`;

  msg += `\n Thank you for your order. Keep Smiling :)`;

  return msg;
};

// Export the module
module.exports = helpers;
