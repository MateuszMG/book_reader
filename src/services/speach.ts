// https://codesandbox.io/p/sandbox/text-to-speech-1ggs6?file=%2Fsrc%2Fspeech.js%3A14%2C38

export class SpeechSynthesisService {
  utterance: SpeechSynthesisUtterance;
  selected: SpeechSynthesisVoice;

  constructor(props: {
    voice: string;
    text: string;
    // lang: string;
    // pitch: string;
    rate: number;
    // volume: string;
  }) {
    this.utterance = new SpeechSynthesisUtterance();
    this.selected = SpeechSynthesisService.getVoice(props.voice);
    this.utterance.voice = this.selected;
    this.utterance.text = props.text.replace(/\n/g, "");
    // this.utterance.lang = props.lang || "en-EN";
    // this.utterance.pitch = parseFloat(props.pitch) || 0.8;
    this.utterance.rate = props.rate || 1;
    // this.utterance.volume = parseFloat(props.volume) || 1;
  }

  static supported() {
    return window.speechSynthesis;
  }

  static getVoice(selected: SpeechSynthesisVoice["name"]) {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((voice) => voice.name === selected);
    return voice !== undefined ? voice : voices[0];
  }

  onend(func: () => {}) {
    this.utterance.onend = func;
  }

  onerror(func: () => {}) {
    this.utterance.onerror = func;
  }

  speak() {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(this.utterance);
  }

  pause() {
    window.speechSynthesis.pause();
  }

  cancel() {
    window.speechSynthesis.cancel();
  }

  resume() {
    window.speechSynthesis.resume();
  }
}
