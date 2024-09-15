const fs = require("fs");
const path = require("path");

const bookTitle = process.argv[2];

if (!bookTitle) {
  console.error("Please provide a valid bookTitle.");
  process.exit(1);
}

const readBooksInfo = (filePath) => {
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData); //as BooksInfo;
};

const writeBooksInfo = (filePath, booksInfo) => {
  fs.writeFileSync(filePath, JSON.stringify(booksInfo, null, 2), "utf-8");
};

const addBookToJSON = (bookTitle, wordsTotal) => {
  const jsonFilePath = path.join(__dirname, "public", "info", "booksInfo.json");
  let booksInfo = readBooksInfo(jsonFilePath);

  const existingBook = booksInfo.books.find((book) => book.title === bookTitle);
  if (existingBook) return console.error(`Book "${bookTitle}" already exists.`);

  const newBook = {
    title: bookTitle,
    wordsTotal,
    recentUserWord: 0,
  };

  booksInfo.bookTitles.push(bookTitle);
  booksInfo.books.push(newBook);

  writeBooksInfo(jsonFilePath, booksInfo);
  console.log(`Book "${bookTitle}" added successfully!`);
};

const processBookFile = (filePath) => {
  const bookTitle = path.basename(filePath, path.extname(filePath));
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const wordsTotal = fileContent.split(/\s+/).length;

  addBookToJSON(bookTitle, wordsTotal);
};

const txtFilePath = path.join(__dirname, "public", "books", `${bookTitle}.txt`);
processBookFile(txtFilePath);

// it gets book from public/books/.txt
// node addBook.js v19
// node addBook Psych
