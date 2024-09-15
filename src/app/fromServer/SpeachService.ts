"use client";
export class SpeechService {
  utterance: SpeechSynthesisUtterance;
  voices: SpeechSynthesisVoice[];
  selectedVoice?: SpeechSynthesisVoice;
  rate: number;
  nextText: string;
  loadMore: () => void;

  constructor() {
    this.utterance = new SpeechSynthesisUtterance();
    this.voices = window.speechSynthesis.getVoices().reverse();
    this.selectedVoice;
    this.rate = 1;
    this.nextText = "";
    this.loadMore = () => {};
    this.init();
  }

  init() {
    console.log("init");

    const defaultVoice = this.voices.find(
      (voice) =>
        voice.lang === "pl" ||
        voice.name.toLowerCase().includes("pl") ||
        voice.name.toLowerCase().includes("zosia")
    );
    defaultVoice?.name && this.setVoice(defaultVoice?.name);
  }

  setVoice(selected: SpeechSynthesisVoice["name"]) {
    this.selectedVoice =
      this.voices.find((voice) => voice.name === selected) || this.voices[0];
  }

  setRate(rate: number) {
    this.rate = parseFloat(rate + "");
  }

  setNextText(text: string) {
    this.nextText = text;
  }

  speak(text: string, withStart: boolean) {
    if (!this.selectedVoice) return;
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = this.rate;
    this.utterance.voice = this.selectedVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(this.utterance);

    this.utterance.onend = () => {
      console.log("onend", this.nextText);

      this.speak(this.nextText, true);
      this.loadMore();
    };
  }
}

export const speechService = new SpeechService();
