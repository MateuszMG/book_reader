"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, Layout, List, message } from "antd";
import Link from "next/link";

const { Content } = Layout;

interface IVoice {
  // default: false
  // lang: "it-IT"
  // localService: true
  // name: "Alice"
  // voiceURI: "urn:moz-tts:osx:com.apple.voice.compact.it-IT.Alice"
  lang: string;
  name: string;
  voiceURI: string;
}

const TestV1: React.FC = () => {
  const [voices, setVoices] = useState<IVoice[]>([]);
  const [text, setText] = useState("Dev text to speak");

  const handleInitText = () => {
    const msg = new SpeechSynthesisUtterance("Hello, world!");
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const to_speak = new SpeechSynthesisUtterance("Hello world!");
      speechSynthesis.cancel();
      window.speechSynthesis.speak(to_speak);
      setVoices(window.speechSynthesis.getVoices() as IVoice[]);
    } else {
      alert("not support speechSynthesis");
    }
  }, []);

  const handleSpeak = () => {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  //   speechSynthesis.onvoiceschanged = function () {
  //     var msg = new SpeechSynthesisUtterance("Hello!");
  //     var voices = window.speechSynthesis.getVoices();
  //     msg.voice = voices[0]; // Select the first voice, or choose based on preference
  //     window.speechSynthesis.speak(msg);
  //   };

  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      <Content>
        <Link href="/">
          <Button type="link" style={{ marginBottom: "24px" }}>
            Home
          </Button>
        </Link>

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
