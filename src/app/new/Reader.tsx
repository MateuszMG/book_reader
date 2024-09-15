"use client";
import { Typography } from "antd";
import { useState, useEffect } from "react";

const { Title, Paragraph } = Typography;

interface ReaderProps {
  loadMore: () => void;
  //   speak: boolean;
  text: string;
}

export const Reader = ({ loadMore, text }: ReaderProps) => {
  const [currentSentences, setCurrentSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const convertTextToSentences = () => {
    setCurrentSentences(text.replace(/([.!?])\s*(?=[A-Z])/g, "$1|").split("|"));
    setCurrentSentenceIndex(0);
  };

  const startSpeaking = (sentence: string, index: number) => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = 1.3;
    utterance.voice = window.speechSynthesis
      .getVoices()
      .find(
        (voice) =>
          voice.lang === "pl" ||
          voice.name.toLowerCase().includes("pl") ||
          voice.name.toLowerCase().includes("zosia")
      )!;

    utterance.onend = () => {
      const nextIndex = index + 1;
      console.log("nextIndex", nextIndex);

      if (nextIndex < currentSentences.length) {
        setCurrentSentenceIndex(nextIndex);
        startSpeaking(currentSentences[nextIndex], nextIndex);
      } else {
        console.log("end");
        loadMore();
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // currentSentenceIndex !== 0 && convertTextToSentences();

    if (
      window.speechSynthesis.speaking ||
      !currentSentences.length ||
      currentSentenceIndex !== 0
    )
      return;

    console.log("useEffect 2");

    startSpeaking(currentSentences[0], 0);
  }, [currentSentenceIndex]);

  useEffect(() => {
    if (window.speechSynthesis.speaking) return;
    convertTextToSentences();
  }, [text, text.length]);

  return (
    <div>
      {currentSentences.map((sentence, index) => (
        <Paragraph
          key={index}
          style={{
            backgroundColor:
              index === currentSentenceIndex ? "#d3adf7" : "transparent",
          }}
        >
          {sentence}
        </Paragraph>
      ))}
    </div>
  );
};
