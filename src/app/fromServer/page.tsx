"use client";
import { useState, useEffect } from "react";
import { Button, Select, Typography, Progress, Space } from "antd";
import axios from "axios";
import { BookReader } from "./ReadBook";
import { speechService } from "./SpeachService";
import Link from "next/link";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const FromServer = () => {
  const [selectedBook, setSelectedBook] = useState<string | undefined>();
  const [booksInfo, setBooksInfo] = useState<BooksInfo | undefined>();
  const [bookInfo, setBookInfo] = useState<BookInfo | undefined>();
  const [currentChunk, setCurrentChunk] = useState<string>("");
  const [nextChunk, setNextChunk] = useState<string>("");

  const loadBook = async () => {
    if (!selectedBook) return;
    const res = await axios.get("/api/book", {
      params: { bookTitle: selectedBook },
    });

    const data: GetBookResponse = res.data;

    setCurrentChunk(data.currentChunk);
    setNextChunk(data.nextChunk);
  };

  const handleNext = async () => {
    if (!booksInfo) return "";

    setCurrentChunk(nextChunk);
    setNextChunk("");

    const res = await axios.post("/api/book", { bookTitle: selectedBook });
    const data = res.data as PostBookResponse;
    setCurrentChunk(data.currentChunk);
    setNextChunk(data.nextChunk);

    const updatedBooksInfo: BooksInfo = {
      recent: data.updatedBookInfoAndRecent,
      bookTitles: booksInfo.bookTitles,
      books: booksInfo.books.map((book) =>
        book.title === selectedBook ? data.updatedBookInfoAndRecent : book
      ),
    };
    setBooksInfo(updatedBooksInfo);
    setBookInfo(data.updatedBookInfoAndRecent);

    return nextChunk;
  };

  const loadBooks = async () => {
    const res = await fetch(`/api/books`);
    const booksInfo = (await res.json()).booksInfo as BooksInfo;
    setBooksInfo(booksInfo);
  };

  const updateBookInfo = () => {
    setBookInfo(booksInfo?.books.find(({ title }) => title === selectedBook));
  };

  useEffect(() => {
    loadBooks().then();
  }, []);

  useEffect(() => {
    if (!selectedBook) return;
    loadBook().then();
    updateBookInfo();
  }, [selectedBook]);

  if (!booksInfo?.bookTitles?.length) return <p>There is no books</p>;

  const { bookTitles, books, recent } = booksInfo;

  return (
    <div style={{ padding: "2rem" }}>
      <Link href="/">
        <Button type="link" style={{ marginBottom: "24px" }}>
          Home
        </Button>
      </Link>
      <br />

      <Select
        style={{ width: 200 }}
        onChange={setSelectedBook}
        placeholder="Select a Book"
      >
        {bookTitles.map((title) => (
          <Option value={title}>{title}</Option>
        ))}
      </Select>

      <Paragraph>
        Recent: {recent.title} - {recent.recentUserWord} / {recent.wordsTotal}{" "}
      </Paragraph>

      {selectedBook && (
        <Space direction="vertical" style={{ marginTop: "2rem" }}>
          <Button type="primary" onClick={handleNext} disabled={!nextChunk}>
            Next CHunk
          </Button>

          {bookInfo && (
            <Progress
              percent={
                (bookInfo.recentUserWord / Math.ceil(bookInfo.wordsTotal)) * 100
              }
              format={(percent) => `Progress: ${(percent || 0).toFixed(2)}%`}
            />
          )}

          <BookReader bookText={currentChunk} loadMore={handleNext} />

          {/* <Paragraph>
            {currentChunk || "Select a book to start reading."}
          </Paragraph> */}
          {/* <button
            onClick={() => {
              // speechService.init();
              speechService.setRate(1.4);
              speechService.setNextText(nextChunk);
              speechService.loadMore = () => {
                handleNext().then(() => {
                  console.log("nextChunk", nextChunk);

                  speechService.setNextText(nextChunk);
                });
              };
              speechService.speak(currentChunk, true);

              // speechService.setText(currentChunk, true);
              // console.log(" -- ", speechService);
              // console.log(" -- ", speechService.selectedVoice);
              // speechService.speak();
            }}
          >
            Speak
          </button> */}
        </Space>
      )}
    </div>
  );
};

export default FromServer;
