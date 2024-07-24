
const mongoClient = require("../db/mongoDB_connect");

module.exports = class Users {
  constructor(name, email, password, type) {
    this.id = Math.random().toString();
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  static async fetchUsers() {
    const users = await mongoClient
      .db(process.env.DB)
      .collection("users")
      .find({})
      .toArray();
    return users;
  }

  static addUser(user) {
    mongoClient
      .db(process.env.DB)
      .collection("users")
      .insertOne({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        type: user.type,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log("Error in inserting new user data\n" + err);
      });
  }

  static async fetchUserbyId(userId) {
    let user = await mongoClient
      .db(process.env.DB)
      .collection("users")
      .find({ id: userId })
      .toArray()
    return user[0];
  }
};
