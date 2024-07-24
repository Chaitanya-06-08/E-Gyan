require("dotenv").config();
const mongoClient = require("../db/mongoDB_connect");
module.exports = class Books {
  constructor(title, author, publisher, description, image, status, category) {
    this.id = Math.random().toString();
    this.title = title;
    this.author = author;
    this.publisher = publisher;
    this.description = description;
    this.image = image;
    this.status = status;
    this.category = category;
  }

  addBook() {
    mongoClient
      .db(process.env.DB)
      .collection("books")
      .insertOne({
        title: this.title,
        author: this.author,
        publisher: this.publisher,
        description: this.description,
        image: this.image,
        status: this.status,
        category: this.category,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log("Error in adding new book\n" + err);
      });
  }

  static async fetchBooks() {
    try {
      const result_1 = await mongoClient
        .db(process.env.DB)
        .collection("books")
        .find({})
        .toArray();
      return result_1;
    } catch (err) {
      console.log("Error in fetching books\n" + err);
    }
  }

  static async fetchByBookId(bookId) {
    let book = await mongoClient
      .db(process.env.DB)
      .collection("books")
      .find({ id: parseInt(bookId) })
      .toArray();
    return book[0];
  }

  static removeBook(bookId) {
    mongoClient
      .db(process.env.DB)
      .collection("books")
      .deleteOne({ id: bookId })
      .then((result) => {})
      .catch((err) => {
        console.log("Error in deleting book\n" + err);
      });
  }

  static editBookDetails(bookId, title, author, description, publisher, image,category) {
    mongoClient
      .db(process.env.DB)
      .collection("books")
      .updateOne(
        { id: bookId },
        {
          $set: {
            title: title,
            author: author,
            description: description,
            publisher: publisher,
            image: image,
            category: category,
          },
        }
      )
      .then((result) => {})
      .catch((err) => {
        console.log("Error in updating book details\n" + err);
      });
  }

  static updateBooksData(bookId, userId, user, request) {
    let newStatus = request === "borrow" ? "Borrowed By Someone" : "available";
    mongoClient
      .db(process.env.DB)
      .collection("books")
      .updateOne({ id: bookId }, { $set: { status: newStatus } })
      .then((result) => {
        console.log("Updated book status");
        if (request === "borrow") {
          Books.createTransaction(bookId, userId, user);
        }
      })
      .catch((err) => console.log("Error in borrowing book\n" + err));
  }

  static createTransaction(bookId, userId, user) {
    let issueDate = new Date();
    let returnDate = new Date();
    returnDate.setDate(returnDate.getDate() +7);
    mongoClient
      .db(process.env.DB)
      .collection("transactions")
      .insertOne({
        userID: userId,
        userName: user.name,
        bookID: bookId,
        issueDate: issueDate,
        returnDate: returnDate,
        returnStatus: "pending",
        fine: 0,
      })
      .then((result) => {
        console.log("Updated Transaction table");
      })
      .catch((err) => {
        console.log("Error in updating transaction\n" + err);
      });
  }

  static updateTransaction(bookId, userId, user) {
    mongoClient
      .db(process.env.DB)
      .collection("transactions")
      .find({ bookID: bookId })
      .toArray()
      .then((result) => {
        // console.log(result);
        // console.log(typeof bookId);
        let fine = 0;
        let returnDate = result[0].returnDate;
        if (new Date() > returnDate) {
          let diff = (new Date() - returnDate) / (1000 * 60 * 60 * 24);
          fine += diff * 2;
        }

        mongoClient
          .db(process.env.DB)
          .collection("transactions")
          .updateOne(
            { bookID: bookId },
            { $set: { returnStatus: "Returned", fine: fine } }
          )
          .then((result) => {
            console.log("Returned book");
            Books.updateBooksData(bookId, userId, user, "return");
            console.log("Updated book status after return");
          })
          .catch((err) => console.log("Error in returning book\n" + err));
      })
      .catch((err) =>
        console.log("error in fetching required transaction\n" + err)
      );
  }

  static async fetchTransactions() {
    try {
      const result = await mongoClient
        .db(process.env.DB)
        .collection("transactions")
        .find({})
        .toArray();
      return result;
    } catch (err) {
      return console.log("Error in fetching transactions\n" + err);
    }
  }

  static async fetchTransactionsOfUser(userId, type) {
    let query;
    if (type == "student") query = { userID: userId };
    else query = {};

    try {
      let result = await mongoClient
        .db(process.env.DB)
        .collection("transactions")
        .find(query)
        .toArray();
      return result;
    } catch (err) {
      console.log("Error in fetching users transactions\n" + err);
    }
  }
};
