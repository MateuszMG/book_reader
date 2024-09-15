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
import { handleApiError } from "@/components/ErrorToast";
import NestedSelect from "@/components/NestedSelect";
import { HistoryEntry } from "../ClearHistory/page";

const { Content } = Layout;
const { Paragraph } = Typography;
const { Option } = Select;

interface BookReaderProps {
  bookText: string;
  loadMore: () => Promise<string>;
}

export const BookReader = ({ bookText, loadMore }: BookReaderProps) => {
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [startWord, setStartWord] = useState<string>("");
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState<number>(-1);

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

    const defaultVoice = availableVoices.find(
      (voice) =>
        voice.lang === "pl" ||
        voice.name.toLowerCase().includes("pl") ||
        voice.name.toLowerCase().includes("zosia")
    );

    setSelectedVoice(defaultVoice?.name || "");
  };

  useEffect(() => {
    console.log("init");

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

    //// Load saved progress
    // const savedBook = localStorage.getItem("selectedBook");
    // const savedWords = localStorage.getItem("lastWords");
    // if (savedBook) {
    //   setSelectedBook(savedBook);
    //   loadBook(savedBook);
    // }
    // if (savedWords) {
    //   setStartWord(savedWords.split(" ").slice(-1)[0]); // Start from the last word
    // }
  }, []);

  const splitTextToSentences = (text: string) => {
    const regex = /[^.!?]+[.!?]+/g;
    return (
      text
        .replaceAll("„", "")
        .replaceAll("”", "")
        .replaceAll(":", "")
        .match(regex) || []
    );
  };

  const startSpeaking = (text: string) => {
    if (!text) return;

    const sentenceArray = splitTextToSentences(text);

    setSentences(sentenceArray);
    setCurrentSentence(0);
    speakSentence(sentenceArray, 0);
  };

  const speakSentence = (sentenceArray: string[], index: number) => {
    if (index >= sentenceArray.length) return;

    const utterance = new SpeechSynthesisUtterance(sentenceArray[index]);

    utterance.rate = speechRate;
    utterance.voice =
      voices.find((voice) => voice.name === selectedVoice) ||
      window.speechSynthesis
        .getVoices()
        .find(
          (voice) =>
            voice.lang === "pl" ||
            voice.name.toLowerCase().includes("pl") ||
            voice.name.toLowerCase().includes("zosia")
        )!;

    utterance.onstart = () => {
      setCurrentSentence(index);
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      if (index + 1 < sentenceArray.length) {
        speakSentence(sentenceArray, index + 1);
      } else {
        setCurrentSentence(-1);
        window.speechSynthesis.cancel();
        loadMore().then((nextBookText) => {
          console.log("nextBookText", nextBookText);

          startSpeaking(nextBookText);
        });
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    // TODO it should send request to save user progress
    // if (isSpeaking || isPaused) {
    //   window.speechSynthesis.cancel();
    //   setIsSpeaking(false);
    //   setIsPaused(false);
    // }
  };

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      <Content>
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

            <div>
              <Input
                placeholder="Start from word..."
                style={{ width: 200, marginBottom: "24px" }}
                value={startWord}
                onChange={(e) => setStartWord(e.target.value)}
              />

              <Button
                style={{ marginRight: "10px" }}
                icon={<PlayCircleOutlined />}
                onClick={() => startSpeaking(bookText)}
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
            </div>

            {/* 
            <Button icon={<SaveOutlined />} onClick={saveProgress}>
              Save progress
            </Button> */}

            <div style={{ marginTop: "20px" }}>
              {sentences.map((sentence, index) => (
                <p
                  key={index}
                  style={{
                    backgroundColor:
                      currentSentence === index ? "#e6f7ff" : "transparent",
                    padding: "5px",
                  }}
                >
                  {sentence}
                </p>
              ))}
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
};
