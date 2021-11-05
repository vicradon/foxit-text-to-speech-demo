import * as UIExtension from "@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/UIExtension.full.js";
const PDFTextToSpeechSynthesisStatus =
  UIExtension.PDFViewCtrl.readAloud.PDFTextToSpeechSynthesisStatus;

class CustomPDFTextToSpeechSynthesis {
  constructor() {
    this.playingOptions = {};
    this.status = PDFTextToSpeechSynthesisStatus.stopped;
  }
  supported() {
    return typeof window.speechSynthesis !== "undefined";
  }
  pause() {
    this.status = PDFTextToSpeechSynthesisStatus.paused;
    window.speechSynthesis.pause();
  }
  resume() {
    this.status = PDFTextToSpeechSynthesisStatus.playing;
    window.speechSynthesis.resume();
  }
  stop() {
    this.status = PDFTextToSpeechSynthesisStatus.stopped;
    window.speechSynthesis.cancel();
  }
  /**
   * @param {IterableIterator<Promise<PDFTextToSpeechUtterance>>} utterances
   * @param {ReadAloudOptions} options
   *
   */
  async play(utterances, options) {
    for await (const utterance of utterances) {
      const nativeSpeechUtterance = new window.SpeechSynthesisUtterance(
        utterance.text
      );
      const { pitch, rate, volume } = Object.assign(
        {},
        this.playingOptions,
        options || {}
      );
      if (typeof pitch === "number") {
        nativeSpeechUtterance.pitch = pitch;
      }
      if (typeof rate === "number") {
        nativeSpeechUtterance.rate = rate;
      }
      if (typeof volume === "number") {
        nativeSpeechUtterance.volume = volume;
      }
      await new Promise((resolve, reject) => {
        nativeSpeechUtterance.onend = resolve;
        nativeSpeechUtterance.onabort = resolve;
        nativeSpeechUtterance.onerror = reject;
        speechSynthesis.speak(nativeSpeechUtterance);
      });
    }
  }
  updateOptions(options) {
    Object.assign(this.playingOptions, options);
  }
}

export default CustomPDFTextToSpeechSynthesis;
