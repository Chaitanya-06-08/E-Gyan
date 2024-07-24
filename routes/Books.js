const express = require("express");
const router = express.Router();
const Books = require("../models/Books");
const Users = require("../models/Users");

router.get("/addBook", (req, res, next) => {
  let editVal = req.query.edit;
  if (editVal) {
    let bookId = req.query.bookId;
    Books.fetchByBookId(bookId)
      .then((bookData) => {
        console.log(JSON.stringify(bookData)+ "Book found");
        res.render("Books/AddBook", {
          pageTitle: "Edit Book Details",
          buttonContent: "Update Details",
          path: `/editBook/${bookId}`,
          bookData: bookData,
          user: req.session.user,
        });
      })
      .catch((err) => {
        console.log("Failed to fetch book by ID\n" + err);
      });
  } else {
    let bookData = {
      id: "",
      title: "",
      author: "",
      description: "",
      publisher: "",
      image: "",
      category: "",
    };
    res.render("Books/AddBook", {
      pageTitle: "Add Book",
      buttonContent: "Add Book",
      path: "/addBook",
      bookData: bookData,
      user: req.session.user,
    });
  }
});

router.post("/addBook", (req, res, next) => {
  let title = req.body.title;
  let author = req.body.author;
  let description = req.body.description;
  let publisher = req.body.publisher;
  let image = req.body.image;
  let category = req.body.category;
  let status = "available";
  let book = new Books(
    title,
    author,
    publisher,
    description,
    image,
    status,
    category
  );
  book.addBook();
  res.redirect("/");
});

router.get("/removeBook", (req, res, next) => {
  res.render("Books/RemoveBook", { user: req.session.user });
});

router.post("/removeBook", (req, res, next) => {
  let bookId = req.body.bookId;
  Books.removeBook(bookId);
  console.log("removed Book");
  res.redirect("/");
});

router.get("/editBook", (req, res) => {
  Books.fetchBooks().then((books) => {
    res.render("Books/DisplayBooks", {
      user: req.session.user,
      books: books,
      pageTitle: "Library",
      buttonContent: "Edit",
      path: "/addBook",
      method: "get",
      edit: true,
    });
  });
});

router.post("/editBook/:bookId", (req, res, next) => {
  let bookId = req.params.bookId;
  console.log(bookId);
  let title = req.body.title;
  let author = req.body.author;
  let description = req.body.description;
  let publisher = req.body.publisher;
  let image = req.body.image;
  let category=req.body.category;
  Books.editBookDetails(bookId, title, author, description, publisher, image,category);
  res.redirect("/");
});

router.get("/displayBooks", (req, res, next) => {
  Books.fetchBooks().then((books) => {
    res.render("Books/DisplayBooks", {
      user: req.session.user,
      books: books,
      pageTitle: "Library",
      buttonContent: null,
    });
  });
});

router.get("/issueBook", (req, res) => {
  Books.fetchBooks().then((books) => {
    res.render("Books/DisplayBooks", {
      user: req.session.user,
      books: books,
      pageTitle: "Library",
      buttonContent: "Issue Book",
      path: "/enterMemberId",
      method: "POST",
      edit: false,
    });
  });
});

router.post("/enterMemberId", (req, res) => {
  let bookId = req.body.bookId;
  console.log(bookId);
  res.render("Books/ReturnBook", {
    user: req.session.user,
    msg: "Enter Membership ID of User :",
    buttonContent: "Issue Book",
    path: "/issueBook",
    img: "issueBook.png",
    bookId: bookId,
  });
});

router.post("/issueBook", (req, res) => {
  let bookId = parseInt(req.body.bookId);
  let userId = parseInt(req.body.userId);
  Users.fetchUserbyId(userId)
    .then((user) => {
      Books.updateBooksData(bookId, userId, user, "borrow");
      res.redirect("/issueMsg");
    })
    .catch((err) => {
      console.log("Failed to fetch user by ID\n" + err);
    });
});

router.get("/issueMsg", (req, res) => {
  res.render("Books/Msg", { user: req.session.user });
});

router.get("/returnBook", (req, res) => {
  res.render("Books/ReturnBook", {
    user: req.session.user,
    msg: "Enter Book ID :",
    buttonContent: "Return",
    path: "/returnBook",
    img: "returnBook.jpg",
  });
});

router.post("/returnBook", (req, res) => {
  let bookId = parseInt(req.body.bookId);
  let user = req.session.user;
  Books.updateTransaction(bookId, user.id, user);
  res.redirect("/");
});

// router.get("/issueBook",(req,res)=>{
//   res.render('issueBook')
// })
module.exports = router;
