const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Book = require("./models/book");
app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://alagtari:alagtari123@cluster0.zwy45su.mongodb.net/?retryWrites=true&w=majority",
    {  
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à mongoDB reussite"))
  .catch((e) => console.log("connexion à mongodb échouée", e));

  app.get("/api/books/", (req, res) => {
    Book.find()
      .then((books) =>
        res.status(200).json({
          payload: books,
          message: "success",
        })
      )
      .catch((error) =>
        res.status(400).json({
          error: error.message,
        })
      );
  });
  app.post("/api/books/", (req, res) => {
    console.log(req.body);
    const book = new Book(req.body);
    book
      .save()
      .then(() =>
        res.status(201).json({
          payload: book,
        })
      )
      .catch((error) =>
        res.status(400).json({
          error: error.message,
        })
      );
  });
  app.get("/api/books/:id", (req, res) => {
    const bookId = req.params.id;
  
    Book.findOne({ _id: bookId })
      .then((book) => {
        if (!book) {
          return res.status(404).json({
            message: "Book Not Found !",
          });
        }
  
        return res.status(200).json({
          payload: book,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          error: error.message,
        });
      });
  });
  
  app.patch("/api/books/:id", (req, res) => {
  
    Book.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then((book) => {
        if (!book) {
          res.status(404).json({
            message: "Book Not Found !",
          });
        } else {
          res.status(200).json({
            payload: book,
          });
        }
      })
      .catch((error) =>
        res.status(400).json({
          error: error.message,
        })
      );
  });
  app.delete("/api/books/:id", (req, res) => {
   
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Book deleted successfully" }))
      .catch((error) => res.status(400).json({ error }));
  });
module.exports = app;