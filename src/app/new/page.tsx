"use client";
import { useState, useEffect } from "react";
import { Button, Select, Typography, Progress, Space } from "antd";
import axios from "axios";

import Link from "next/link";
import { Reader } from "./Reader";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const FromServer = () => {
  const [selectedBook, setSelectedBook] = useState<string | undefined>();
  const [booksInfo, setBooksInfo] = useState<BooksInfo | undefined>();
  const [bookInfo, setBookInfo] = useState<BookInfo | undefined>();
  const [currentChunk, setCurrentChunk] = useState<string>("");
  //   const [nextChunk, setNextChunk] = useState<string>("");
  const [speak, setSpeak] = useState(false);
  const [currentSentences, setCurrentSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);

  //   useEffect(() => {
  //     if (!speak) return;
  //     startSpeaking();
  //   }, [currentSentences.length, currentSentenceIndex, speak]);

  const loadBook = async () => {
    if (!selectedBook) return;
    const res = await axios.get("/api/book", {
      params: { bookTitle: selectedBook },
    });

    const data: GetBookResponse = res.data;

    // const sentences = data.currentChunk
    //   .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
    //   .split("|");
    // setCurrentSentences(sentences);

    setCurrentChunk(data.currentChunk);
    // setNextChunk(data.nextChunk);
  };

  const handleNext = async () => {
    setSpeak(false);
    if (!booksInfo) return;

    // setCurrentChunk(nextChunk);
    // setNextChunk("");

    const res = await axios.post("/api/book", { bookTitle: selectedBook });
    const data = res.data as PostBookResponse;
    setCurrentChunk(data.currentChunk);
    // setNextChunk(data.nextChunk);

    const updatedBooksInfo: BooksInfo = {
      recent: data.updatedBookInfoAndRecent,
      bookTitles: booksInfo.bookTitles,
      books: booksInfo.books.map((book) =>
        book.title === selectedBook ? data.updatedBookInfoAndRecent : book
      ),
    };
    setBooksInfo(updatedBooksInfo);
    setBookInfo(data.updatedBookInfoAndRecent);
    setSpeak(true);

    // const sentences = data.nextChunk
    //   .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
    //   .split("|");
    // setCurrentSentences(sentences);
    // setCurrentSentenceIndex(0);
    // console.log("sentences", sentences);

    // startSpeaking();
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

  //   const speakSentence = (sentence: string, index: number) => {
  //     const utterance = new SpeechSynthesisUtterance(sentence);
  //     utterance.rate = 1.3;
  //     utterance.voice = window.speechSynthesis
  //       .getVoices()
  //       .find(
  //         (voice) =>
  //           voice.lang === "pl" ||
  //           voice.name.toLowerCase().includes("pl") ||
  //           voice.name.toLowerCase().includes("zosia")
  //       )!;

  //     utterance.onend = () => {
  //       const nextIndex = index + 1;
  //       if (nextIndex < currentSentences.length) {
  //         setCurrentSentenceIndex(nextIndex);
  //         speakSentence(currentSentences[nextIndex], nextIndex);
  //       } else {
  //         console.log("end", window.speechSynthesis.speaking);

  //         //   setCurrentSentences([]);
  //         //   setCurrentSentenceIndex(0);
  //         //   window.speechSynthesis.cancel();
  //         handleNext();
  //       }
  //     };
  //     window.speechSynthesis.speak(utterance);
  //   };

  //   const startSpeaking = () => {
  //     if (currentSentences.length > 0) {
  //       speakSentence(currentSentences[0], 0);
  //     }
  //   };

  if (!booksInfo?.bookTitles?.length) return <p>There is no books</p>;
  //   console.log("currentSentences", currentSentences);
  //   console.log("out --- ", window.speechSynthesis.speaking);

  const { bookTitles, books, recent } = booksInfo;

  return (
    <div style={{ padding: "2rem" }}>
      <Link href="/">
        <Button type="link" style={{ marginBottom: "24px" }}>
          Home
        </Button>
      </Link>
      <br />
      {/* <Button type="primary" onClick={startSpeaking}> */}
      <Button type="primary" onClick={() => setSpeak(!speak)}>
        "Start Speaking"
      </Button>
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
          {bookInfo && (
            <Progress
              percent={
                (bookInfo.recentUserWord / Math.ceil(bookInfo.wordsTotal)) * 100
              }
              format={(percent) => `Progress: ${(percent || 0).toFixed(2)}%`}
            />
          )}

          {speak && <Reader loadMore={handleNext} text={currentChunk} />}
        </Space>
      )}
    </div>
  );
};

export default FromServer;
