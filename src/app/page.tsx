"use client";
import { useState, useEffect } from "react";
import { Select, Button, Typography, Layout, Slider, Input, List } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  RedoOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { HistoryEntry } from "./ClearHistory/page";
import { handleApiError } from "@/components/ErrorToast";
import NestedSelect from "@/components/NestedSelect";

const { Content } = Layout;
const { Paragraph } = Typography;
const { Option } = Select;

const Home = () => {
  const [bookText, setBookText] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [startWord, setStartWord] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleLoadVoices = () => {
    const availableVoices = window?.speechSynthesis
      .getVoices()
      // .filter((item) => item.lang.includes("en") || item.lang.includes("pl"))
      .filter(
        // (item) =>
        //   item.name.includes("Zosia (Enhanced)") || item.name.includes("Daniel")
        ({ lang }) =>
          lang.toLowerCase().includes("en") ||
          lang.toLowerCase().includes("us") ||
          lang.toLowerCase().includes("pl")
      )
      .reverse();

    setVoices(availableVoices);
    // if (availableVoices.length > 0) {
    //   setSelectedVoice(availableVoices[0].name);
    // }
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    // const loadVoices = () => {
    //   const availableVoices = window?.speechSynthesis.getVoices();
    //   // .filter((item) => item.lang.includes("en") || item.lang.includes("pl"))
    //   // .filter(
    //   //   (item) =>
    //   //     item.name.includes("Zosia (Enhanced)") ||
    //   //     item.name.includes("Daniel")
    //   // )
    //   // .reverse();

    //   setVoices(availableVoices);
    //   if (availableVoices.length > 0) {
    //     setSelectedVoice(availableVoices[0].name);
    //   }
    // };

    // loadVoices();

    handleLoadVoices();

    if (
      typeof window !== "undefined" &&
      window.speechSynthesis.onvoiceschanged !== undefined
    ) {
      window.speechSynthesis.onvoiceschanged = handleLoadVoices;
    }

    // Load saved progress
    const savedBook = localStorage.getItem("selectedBook");
    const savedWords = localStorage.getItem("lastWords");
    if (savedBook) {
      setSelectedBook(savedBook);
      loadBook(savedBook);
    }
    if (savedWords) {
      setStartWord(savedWords.split(" ").slice(-1)[0]); // Start from the last word
    }
  }, []);

  const loadBook = async (path: string) => {
    const response = await fetch(`/books/${path}.txt`);
    const data = await response.text();
    setBookText(data);
  };

  const handleBookChange = (values: string[]) => {
    const path = values.join("/");
    setSelectedBook(path);
    localStorage.setItem("selectedBook", path); // Save the selected book in localStorage
    loadBook(path);
  };

  const saveProgress = () => {
    const history = JSON.parse(localStorage.getItem("history") || "[]");

    const book = bookText.split(/\s+/);
    if (book.length < 10) return;

    const lastWords =
      currentWordIndex < 5
        ? book[currentWordIndex] +
          " " +
          book[currentWordIndex + 1] +
          " " +
          book[currentWordIndex + 2]
        : book[currentWordIndex - 2] +
          " " +
          book[currentWordIndex - 1] +
          " " +
          book[currentWordIndex];

    history.push({ selectedBook, lastWords });
    localStorage.setItem("history", JSON.stringify(history));
  };

  const handleSpeak = (startFromWord: string) => {
    if (!bookText || !selectedVoice)
      return handleApiError("handleSpeak -- !bookText || !selectedVoice");

    if (window.speechSynthesis.speaking && !isPaused) {
      window.speechSynthesis.cancel();
    }

    let textToSpeak = bookText;
    if (startFromWord) {
      const startIndex = bookText
        .toLowerCase()
        .indexOf(startFromWord.toLowerCase());
      if (startIndex !== -1) {
        const precedingText = bookText.slice(0, startIndex);
        const wordsBeforeStart = precedingText.split(/\s+/).length;
        setCurrentWordIndex(wordsBeforeStart - 1);
        textToSpeak = bookText.slice(startIndex);
      } else {
        alert("Word not found. Starting from the beginning.");
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    // utterance.lang = "en";
    utterance.voice =
      voices.find((voice) => voice.name === selectedVoice) || voices[0] || null;
    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name === "word") {
        const charIndex =
          event.charIndex + (bookText.length - textToSpeak.length);
        const words = bookText.slice(0, charIndex).split(/\s+/);
        setCurrentWordIndex(words.length - 1);
      }
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    };

    // utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      saveProgress();
    }
  };

  const handleResume = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis.speaking || isPaused) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
      saveProgress();
    }
  };

  const setLastContinuation = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    setSelectedBook(last.selectedBook);
    setStartWord(last.lastWords);
  };

  const highlightedText = bookText.split(/\s+/).map((word, index) => (
    <span
      key={index}
      style={{
        backgroundColor: index === currentWordIndex ? "yellow" : "inherit",
      }}
    >
      {word}{" "}
    </span>
  ));

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      <Content>
        <Link href="/new">
          <Button type="link" style={{ marginBottom: "24px" }}>
            new
          </Button>
        </Link>
        <Link href="/fromServer">
          <Button type="link" style={{ marginBottom: "24px" }}>
            fromServer
          </Button>
        </Link>
        <Link href="/reader">
          <Button type="link" style={{ marginBottom: "24px" }}>
            Reader
          </Button>
        </Link>
        <Link href="/ClearHistory">
          <Button type="link" style={{ marginBottom: "24px" }}>
            Clear History
          </Button>
        </Link>
        <Link href="/TestV1">
          <Button type="link" style={{ marginBottom: "24px" }}>
            Test
          </Button>
        </Link>
        <br />
        <br />
        <Button
          type="primary"
          danger
          onClick={handleLoadVoices}
          style={{ marginBottom: "20px" }}
        >
          loadVoices
        </Button>
        <br />
        <Button onClick={setLastContinuation}>Continue</Button>
        <br />
        <br />
        <NestedSelect onChange={handleBookChange} />

        {bookText && (
          <>
            <Select
              placeholder="Select Voice"
              style={{ width: 200, marginBottom: "24px" }}
              onChange={(value) => setSelectedVoice(value)}
              value={selectedVoice}
            >
              {voices.map((voice) => (
                <Option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </Option>
              ))}
            </Select>

            <div style={{ marginBottom: "24px" }}>
              <span>Speech Speed: </span>
              <Slider
                min={0.2}
                max={4}
                step={0.1}
                value={speechRate}
                onChange={(value) => setSpeechRate(value)}
                style={{ width: 600, marginLeft: "10px" }}
              />
            </div>

            <Input
              placeholder="Start from word..."
              style={{ width: 200, marginBottom: "24px" }}
              value={startWord}
              onChange={(e) => setStartWord(e.target.value)}
            />

            <Button
              style={{ marginRight: "10px" }}
              icon={<PlayCircleOutlined />}
              onClick={() => handleSpeak(startWord)}
              disabled={isSpeaking && !isPaused}
            >
              Start Speaking
            </Button>

            <Button
              style={{ marginRight: "10px" }}
              icon={<PauseCircleOutlined />}
              onClick={handlePause}
              disabled={!isSpeaking || isPaused}
            >
              Pause
            </Button>

            <Button
              style={{ marginRight: "10px" }}
              icon={<PlayCircleOutlined />}
              onClick={handleResume}
              disabled={!isPaused}
            >
              Resume
            </Button>

            <Button
              icon={<RedoOutlined />}
              onClick={handleStop}
              disabled={!isSpeaking && !isPaused}
            >
              Stop
            </Button>

            <Button icon={<SaveOutlined />} onClick={saveProgress}>
              Save progress
            </Button>

            <Paragraph style={{ whiteSpace: "pre-wrap" }}>
              {highlightedText}
            </Paragraph>
          </>
        )}

        <br />
        <br />
        <br />
        <br />

        <List
          header={<div>voices</div>}
          bordered
          dataSource={(voices || []).slice(0, 50)}
          renderItem={(item, index) => (
            <List.Item>
              <div>
                <strong>lang :</strong> {item.lang} {" . "}
                <strong>name :</strong> {item.name}
              </div>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};

export default Home;
