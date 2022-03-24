var admin = require("firebase-admin");

var serviceAccount = require("./secretFile.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mobi-movers-897ec-default-rtdb.firebaseio.com/"
})

module.exports.admin = admin