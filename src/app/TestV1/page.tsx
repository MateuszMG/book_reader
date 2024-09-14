"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, Layout, List, message, Select, Slider } from "antd";
import Link from "next/link";
import { handleApiError } from "@/components/ErrorToast";

const { Content } = Layout;

// TODO - get voicec -> select + set -> speed -> 2 text en,pl, production

// interface IVoice {
//   // default: false
//   // lang: "it-IT"
//   // localService: true
//   // name: "Alice"
//   // voiceURI: "urn:moz-tts:osx:com.apple.voice.compact.it-IT.Alice"
//   lang: string;
//   name: string;
//   voiceURI: string;
// }

// const a: SpeechSynthesisVoice = {
//   // default
//   // lang
//   // localService
//   // name
// };

const textPL =
  "Znajdź sens w trudnej sytuacji: Czasami trudne momenty mogą pomóc nam odkryć.";
const textEN =
  "This setup ensures that your application has robust global error handling with ";

const TestV1: React.FC = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [text, setText] = useState("Dev text to speak");
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speechRate, setSpeechRate] = useState<number>(1);
  // console.log("voices", voices);

  const handleInitText = () => {
    const msg = new SpeechSynthesisUtterance("Hello, world!");
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const to_speak = new SpeechSynthesisUtterance("Hello world!");
      speechSynthesis.cancel();
      window.speechSynthesis.speak(to_speak);

      setVoices(
        window.speechSynthesis
          .getVoices()
          .filter(
            ({ lang }) =>
              lang.toLowerCase().includes("en") ||
              lang.toLowerCase().includes("us") ||
              lang.toLowerCase().includes("pl")
          )
      );

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
      };

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis.onvoiceschanged !== undefined
      ) {
        window.speechSynthesis.onvoiceschanged = handleLoadVoices;
      }
    } else {
      alert("not support speechSynthesis");
    }
  }, []);

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.voice =
      voices.find((voice) => voice.name === selectedVoice) || null;

    window.speechSynthesis.speak(utterance);
  };

  //   speechSynthesis.onvoiceschanged = function () {
  //     var msg = new SpeechSynthesisUtterance("Hello!");
  //     var voices = window.speechSynthesis.getVoices();
  //     msg.voice = voices[0]; // Select the first voice, or choose based on preference
  //     window.speechSynthesis.speak(msg);
  //   };

  const handleText = (lang: "en" | "pl") => {
    const utterance = new SpeechSynthesisUtterance(
      lang === "en" ? textEN : textPL
    );
    utterance.rate = speechRate;
    utterance.voice =
      voices.find((voice) => voice.name === selectedVoice) || null;

    handleApiError(
      "selectedVoice: " +
        selectedVoice +
        " ---  utterance.voice: " +
        utterance.voice
    );

    window.speechSynthesis.speak(utterance);
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

        <Button
          type="primary"
          danger
          onClick={handleInitText}
          style={{ marginBottom: "20px" }}
        >
          handleInitText
        </Button>

        <Input onChange={(e) => setText(e.target.value)} value={text} />

        <Button
          type="primary"
          danger
          onClick={handleSpeak}
          style={{ marginBottom: "20px" }}
        >
          handleSpeak
        </Button>

        <br />
        <br />
        <br />

        <Button
          type="primary"
          danger
          onClick={() => handleText("en")}
          style={{ marginBottom: "20px" }}
        >
          handleText en
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => handleText("pl")}
          style={{ marginBottom: "20px" }}
        >
          handleText pl
        </Button>

        <br />
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

        <br />
        <br />

        <List
          header={<div>voices</div>}
          bordered
          dataSource={(voices || []).slice(0, 5)}
          renderItem={(item, index) => (
            <List.Item>
              <div>
                <strong>lang :</strong> {item.lang}
                <br />
                <strong>name :</strong> {item.name}
                <br />
                <strong>voiceURI :</strong> {item.voiceURI}
              </div>
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};

export default TestV1;
