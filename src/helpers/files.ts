const fs = require("fs");
const path = require("path");

//   __dirname,  //   path.relative(),
// process.cwd() = /Users/mmmm/Desktop/coding/github/book_speaker
// booksInfoFilePath  /Users/mmmm/Desktop/coding/github/book_speaker/public/info/booksInfo.json

const booksInfoFilePath = path.join(
  process.cwd(),
  "public",
  "info",
  "booksInfo.json"
);

export const readBooksInfo = () => {
  const jsonData = fs.readFileSync(booksInfoFilePath, "utf-8");
  return JSON.parse(jsonData) as BooksInfo;
};

export const writeBooksInfo = (booksInfo: BooksInfo) => {
  fs.writeFileSync(
    booksInfoFilePath,
    JSON.stringify(booksInfo, null, 2),
    "utf-8"
  );
};

export const readBook = (bookTitle: string) => {
  const bookFilePath = path.join(
    process.cwd(),
    "public",
    "books",
    `${bookTitle}.txt`
  );

  const fileContent = fs.readFileSync(bookFilePath, "utf-8") as string;
  return fileContent;
};
