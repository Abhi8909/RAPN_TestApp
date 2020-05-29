/**
 * Handlers methods
 *
 */

// Dependencies
const _db = require("./db");
const helpers = require("./helpers");
const config = require("../config");

// Container of the handler
let handlers = {};

/**
 * Users Services
 *
 */

handlers.users = function (data, callback) {
  if (config.acceptedHttpMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405, { Error: "Method not allowed" });
  }
};

// users subhandler container
handlers._users = {};

handlers._users.post = function (data, callback) {
  let payload = JSON.parse(data.payload);
  let name =
    typeof payload.name === "string" && payload.name.trim().length > 0
      ? payload.name.trim()
      : false;

  let address =
    typeof payload.address === "string" && payload.address.trim().length > 0
      ? payload.address.trim()
      : false;

  let email = helpers.validateEmail(payload.email) ? payload.email : false;

  let password =
    typeof payload.password === "string" && payload.password.trim().length > 0
      ? payload.password.trim()
      : false;

  if (name && address && email && password) {
    _db.read(config.collections.users, email, function (err) {
      if (err) {
        // save the new user
        let hashedPassword = helpers.hash(password);
        _db.create(
          config.collections.users,
          email,
          {
            name: name,
            address: address,
            email: email,
            password: hashedPassword,
          },
          function (err) {
            if (!err) {
              callback(200, { msg: "user saved" });
            } else {
              callback(502, { msg: "Error in saving user" });
            }
          }
        );
      } else {
        callback(400, { msg: "Users already exists" });
      }
    });
  } else {
    callback(405, { msg: "Incomplete or invalid data" });
  }
};

handlers._users.get = function (data, callback) {
  let { queryObject } = data;
  let email = helpers.validateEmail(queryObject.email)
    ? queryObject.email
    : false;

  if (email) {
    let tokenId =
      typeof data.headers.token === "string" && data.headers.token.length > 0
        ? data.headers.token
        : false;

    handlers._tokens.verify(tokenId, email, function (isTokenValid) {
      if (isTokenValid) {
        _db.read(config.collections.users, email, function (err, data) {
          if (!err && data) {
            delete data.password;
            callback(200, data);
          } else {
            callback(402, { msg: "User does not exists" });
          }
        });
      } else {
        callback(403, { msg: "Token missng in headers or it has expired" });
      }
    });
  } else {
    callback(402, { msg: "Email is invalid" });
  }
};

handlers._users.put = function (data, callback) {
  let payload = JSON.parse(data.payload);
  let name =
    typeof payload.name === "string" && payload.name.trim().length > 0
      ? payload.name.trim()
      : false;

  let address =
    typeof payload.address === "string" && payload.address.trim().length > 0
      ? payload.address.trim()
      : false;

  let email = helpers.validateEmail(payload.email) ? payload.email : false;

  let password =
    typeof payload.password === "string" && payload.password.trim().length > 0
      ? payload.password.trim()
      : false;

  if (email) {
    if (name || address || password) {
      let tokenId =
        typeof data.headers.token === "string" && data.headers.token.length > 0
          ? data.headers.token
          : false;

      handlers._tokens.verify(tokenId, email, function (isTokenValid) {
        if (isTokenValid) {
          _db.read(config.collections.users, email, function (err, user) {
            if (!err && user) {
              user.name = name ? name : user.name;
              user.address = address ? address : user.address;
              user.password = password ? helpers.hash(password) : user.password;

              _db.update(config.collections.users, email, user, function (err) {
                if (!err) {
                  callback(200, { msg: "User updated success" });
                } else {
                  callback(402, { msg: "Could not update" });
                }
              });
            } else {
              callback(400, { msg: "User not found" });
            }
          });
        } else {
          callback(403, { msg: "Token missng in headers or it has expired" });
        }
      });
    } else {
      callback(402, { msg: "Nothing to update" });
    }
  } else {
    callback(402, { msg: "Invalid email" });
  }
};

handlers._users.delete = function (data, callback) {
  let { queryObject } = data;
  let email = helpers.validateEmail(queryObject.email)
    ? queryObject.email
    : false;

  if (email) {
    let tokenId =
      typeof data.headers.token === "string" && data.headers.token.length > 0
        ? data.headers.token
        : false;
    handlers._tokens.verify(tokenId, email, function (isTokenValid) {
      if (isTokenValid) {
        _db.delete(config.collections.users, email, function (err) {
          if (!err) {
            callback(200, { msg: "Users deleted success" });
          } else {
            callback(402, { msg: "User does not exists or already deleted" });
          }
        });
      } else {
        callback(403, { msg: "Token missng in headers or it has expired" });
      }
    });
  } else {
    callback(402, { msg: "Email is invalid" });
  }
};

/**
 * Tokens Services
 *
 */

handlers.tokens = function (data, callback) {
  if (config.acceptedHttpMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405, { Error: "Method not allowed" });
  }
};

// tokens subhandler container
handlers._tokens = {};

handlers._tokens.post = function (data, callback) {
  let payload = JSON.parse(data.payload);

  let email = helpers.validateEmail(payload.email) ? payload.email : false;

  let password =
    typeof payload.password === "string" && payload.password.trim().length > 0
      ? payload.password.trim()
      : false;

  if (email && password) {
    let tokenId = helpers.getRandomString(25);
    let hashedPassword = helpers.hash(password);

    _db.read(config.collections.users, email, function (err, user) {
      if (!err && user) {
        if (user.password === hashedPassword) {
          let tokenObject = {
            id: tokenId,
            email: email,
            expiration: Date.now() * 1000 * 60 * 60, // 1 hour form now
          };
          _db.create(config.collections.tokens, tokenId, tokenObject, function (
            err
          ) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(502, { msg: "Error in saving token" });
            }
          });
        } else {
          callback(403, { msg: "Password does not match" });
        }
      } else {
        callback(403, { msg: "User not found could not create token" });
      }
    });
  } else {
    callback(405, { msg: "Incomplete or invalid data" });
  }
};

handlers._tokens.get = function (data, callback) {
  let { queryObject } = data;
  let tokenId =
    typeof queryObject.tokenId === "string" ? queryObject.tokenId : false;

  if (tokenId) {
    _db.read(config.collections.tokens, tokenId, function (err, data) {
      if (!err && data) {
        if (data.expiration > Date.now()) {
          callback(200, data);
        } else {
          callback(403, { msg: "Token already expired" });
        }
      } else {
        callback(402, { msg: "token does not exists" });
      }
    });
  } else {
    callback(402, { msg: "tokenId is invalid" });
  }
};

// token expiration can be extended
handlers._tokens.put = function (data, callback) {
  let payload = JSON.parse(data.payload);
  let tokenId =
    typeof payload.tokenId === "string" && payload.tokenId.trim().length > 0
      ? payload.tokenId.trim()
      : false;

  let extend =
    typeof payload.extend === "boolean" && payload.extend === true
      ? true
      : false;

  if (extend) {
    _db.read(config.collections.tokens, tokenId, function (err, tokenData) {
      if (!err && tokenData) {
        if (tokenData.expiration > Date.now()) {
          tokenData.expiration = Date.now() * 1000 * 60 * 60;
          _db.update(config.collections.tokens, tokenId, tokenData, function (
            err
          ) {
            if (!err) {
              callback(200);
            } else {
              callback(500, { msg: "Error updating the token" });
            }
          });
        } else {
          callback(403, { msg: "Token already expired" });
        }
      } else {
        callback(400, { msg: "token not found" });
      }
    });
  } else {
    callback(402, { msg: "Invalid token" });
  }
};

handlers._tokens.delete = function (data, callback) {
  let { queryObject } = data;
  let tokenId =
    typeof queryObject.tokenId === "string" ? queryObject.tokenId : false;

  if (tokenId) {
    _db.delete(config.collections.tokens, tokenId, function (err) {
      if (!err) {
        callback(200, { msg: "tokens deleted success" });
      } else {
        callback(402, { msg: "token does not exists or already deleted" });
      }
    });
  } else {
    callback(402, { msg: "tokenId is invalid" });
  }
};

handlers._tokens.verify = function (tokenId, email, callback) {
  if (tokenId && email) {
    _db.read(config.collections.tokens, tokenId, function (err, tokenData) {
      if (!err && tokenData) {
        if (tokenData.expiration > Date.now() && tokenData.email === email) {
          callback(true);
        } else {
          callback(false);
        }
      } else {
        callback(false);
      }
    });
  } else {
    callback(false);
  }
};

/**
 * Cart Services
 *
 */

handlers.cart = function (data, callback) {
  let methods = config.acceptedHttpMethods.filter((r) => r !== "put");

  if (methods.indexOf(data.method) > -1) {
    handlers._cart[data.method](data, callback);
  } else {
    callback(405, { Error: "Method not allowed" });
  }
};

// cart subhandler container
handlers._cart = {};

handlers._cart.post = function (data, callback) {
  let payload = JSON.parse(data.payload);
  let tokenId =
    typeof data.headers.token === "string" ? data.headers.token : false;

  if (tokenId) {
    _db.read(config.collections.tokens, tokenId, function (err, tokenData) {
      if (!err && tokenData) {
        let email = tokenData.email;
        let menu = helpers.getMenu(10);

        // check the item belongs to the menu
        let itemsBelongs = menu.find((r) => r.id === payload.id);

        if (!itemsBelongs) {
          callback(403, { msg: "Requested item doest not exist in menu" });
          return;
        }

        let cartObject = {
          items: [payload],
        };

        _db.read(config.collections.cart, email, function (err, cartData) {
          if (!err && cartData) {
            let itemIndex = cartData.items.findIndex(
              (r) => r.id === payload.id
            );

            if (itemIndex > -1) {
              cartData.items[itemIndex].qty += 1;
            } else {
              cartData.items.push(payload);
            }

            _db.update(
              config.collections.cart,
              email,
              {
                items: cartData.items,
              },
              function (err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(403);
                }
              }
            );
          } else {
            _db.create(config.collections.cart, email, cartObject, function (
              err
            ) {
              if (!err) {
                callback(200);
              } else {
                callback(403);
              }
            });
          }
        });
      } else {
        callback(403);
      }
    });
  } else {
    callback(405, { msg: "Incomplete or invalid data" });
  }
};

handlers._cart.get = function (data, callback) {
  let { queryObject } = data;
  let email = helpers.validateEmail(queryObject.email)
    ? queryObject.email
    : false;

  if (email) {
    let tokenId =
      typeof data.headers.token === "string" && data.headers.token.length > 0
        ? data.headers.token
        : false;

    handlers._tokens.verify(tokenId, email, function (isTokenValid) {
      if (isTokenValid) {
        _db.read(config.collections.cart, email, function (err, data) {
          if (!err && data) {
            callback(200, data.items);
          } else {
            callback(402, { msg: " not exists" });
          }
        });
      } else {
        callback(403, { msg: "Token missng in headers or it has expired" });
      }
    });
  } else {
    callback(402, { msg: "Email is invalid" });
  }
};

handlers._cart.delete = function (data, callback) {
  let { queryObject } = data;
  let email = helpers.validateEmail(queryObject.email)
    ? queryObject.email
    : false;

  let itemId = typeof queryObject.id === "string" ? queryObject.id : false;

  if (email && itemId) {
    let tokenId =
      typeof data.headers.token === "string" ? data.headers.token : false;

    handlers._tokens.verify(tokenId, email, function (isTokenValid) {
      if (isTokenValid) {
        _db.read(config.collections.cart, email, function (err, cartData) {
          if (!err && cartData) {
            let itemIndex = cartData.items.findIndex(
              (r) => r.id === parseInt(itemId)
            );

            if (itemIndex > -1) {
              cartData.items.splice(itemIndex, 1);
              _db.update(
                config.collections.cart,
                email,
                {
                  items: cartData.items,
                },
                function (err) {
                  if (!err) {
                    callback(200);
                  } else {
                    callback(403);
                  }
                }
              );
            } else {
              callback(403, { msg: "alreay deleted or note exist" });
            }
          } else {
            callback(403);
          }
        });
      } else {
        callback(403, { msg: "Token missng in headers or it has expired" });
      }
    });
  } else {
    callback(402, { msg: "Email is invalid" });
  }
};

/**
 * Menu Service
 *
 */

handlers.getMenu = function (data, callback) {
  let menu = helpers.getMenu(10);
  callback(200, menu);
};

handlers.ping = function (data, callback) {
  callback(200);
};

handlers.notFound = function (data, callback) {
  callback(404);
};

// Export the module
module.exports = handlers;
