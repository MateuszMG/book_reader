"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Layout,
  List,
  message,
  Select,
  Slider,
  Typography,
} from "antd";
import Link from "next/link";
import { handleApiError } from "@/components/ErrorToast";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  RedoOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Paragraph } = Typography;
const { Option } = Select;

const Reader = () => {
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [bookText, setBookText] = useState<string>("");

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speechRate, setSpeechRate] = useState<number>(1);

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (!window.speechSynthesis) {
      handleApiError("not support speechSynthesis");
      alert("not support speechSynthesis");
    }

    const handleLoadVoices = () => {
      let availableVoices = window?.speechSynthesis
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

      if (!availableVoices || !availableVoices?.length) {
        availableVoices = window?.speechSynthesis.getVoices().reverse();
      }

      setVoices(availableVoices);
    };

    // support for async in some browsers
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis.onvoiceschanged !== undefined
    ) {
      window.speechSynthesis.onvoiceschanged = handleLoadVoices;
    }

    handleLoadVoices();
  }, []);

  const handleSpeak = (startFromWord?: string) => {
    if (!bookText || !selectedVoice)
      return handleApiError("handleSpeak -- !bookText || !selectedVoice");

    if (window.speechSynthesis.speaking && !isPaused) {
      window.speechSynthesis.cancel();
    }

    let textToSpeak = bookText;
    // if (startFromWord) {
    //   const startIndex = bookText
    //     .toLowerCase()
    //     .indexOf(startFromWord.toLowerCase());
    //   if (startIndex !== -1) {
    //     const precedingText = bookText.slice(0, startIndex);
    //     const wordsBeforeStart = precedingText.split(/\s+/).length;
    //     setCurrentWordIndex(wordsBeforeStart - 1);
    //     textToSpeak = bookText.slice(startIndex);
    //   } else {
    //     alert("Word not found. Starting from the beginning.");
    //   }
    // }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    // utterance.lang = "en";
    utterance.voice =
      voices.find((voice) => voice.name === selectedVoice) || voices[0] || null;
    // utterance.onboundary = (event: SpeechSynthesisEvent) => {
    //   if (event.name === "word") {
    //     const charIndex =
    //       event.charIndex + (bookText.length - textToSpeak.length);
    //     const words = bookText.slice(0, charIndex).split(/\s+/);
    //     setCurrentWordIndex(words.length - 1);
    //   }
    // };
    utterance.onend = () => {
      setIsSpeaking(false);
      //   setCurrentWordIndex(-1);
    };

    // utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const loadBook = async (book: string) => {
    const response = await fetch(`/books/${book}.json`);
    const data = await response.json();
    setBookText(data.text);
  };

  const handleBookChange = (value: string) => {
    setSelectedBook(value);
    // localStorage.setItem("selectedBook", value);
    loadBook(value);
  };

  const handlePause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      //   saveProgress();
    }
  };

  const handleResume = () => {
    if (!isPaused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const handleStop = () => {
    if (!isSpeaking || !isPaused) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    //   setCurrentWordIndex(-1);
    //   saveProgress();
  };

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      <Content>
        <Link href="/">
          <Button type="link" style={{ marginBottom: "24px" }}>
            Home
          </Button>
        </Link>

        <br />

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
        <br />

        <Paragraph>Selected voice: {selectedVoice}</Paragraph>

        <br />

        <Select
          placeholder="Select Voice"
          style={{ width: 200, marginBottom: "24px" }}
          onChange={(value) => setSelectedVoice(value)}
          value={selectedVoice}
        >
          {voices.map((voice) => (
            <Select.Option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Select a book"
          style={{ width: 200, marginBottom: "24px" }}
          onChange={handleBookChange}
          value={selectedBook}
        >
          <Option value="en">en</Option>
          <Option value="smallTextPL">smallTextPL</Option>
          <Option value="smallTextEN">smallTextEN</Option>
          <Option value="DEIR3_1">DEIR3_1</Option>
          <Option value="DEIR3_2">DEIR3_2</Option>
          <Option value="DEIR3_3">DEIR3_3</Option>
          <Option value="DEIR3_4">DEIR3_4</Option>
          <Option value="DEIR3_5">DEIR3_5</Option>
        </Select>

        <br />
        <br />
        <br />

        {bookText && (
          <>
            {/* <Input
              placeholder="Start from word..."
              style={{ width: 200, marginBottom: "24px" }}
              value={startWord}
              onChange={(e) => setStartWord(e.target.value)}
            /> */}

            <Button
              style={{ marginRight: "10px" }}
              icon={<PlayCircleOutlined />}
              //   onClick={() => handleSpeak(startWord)}
              onClick={() => handleSpeak()}
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
            {/* 
            <Button icon={<SaveOutlined />} onClick={saveProgress}>
              Save progress
            </Button> */}

            {/* <Paragraph style={{ whiteSpace: "pre-wrap" }}>
              {highlightedText}
            </Paragraph> */}
            <Paragraph style={{ whiteSpace: "pre-wrap" }}>{bookText}</Paragraph>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default Reader;
