import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'txt-to-speech';
  input = ''
  uttr: SpeechSynthesisUtterance;
  constructor(){
    this.uttr = new SpeechSynthesisUtterance();
    this.uttr.lang = 'en-US';
  }
  playText(){
    this.uttr.text = this.input;
    window.speechSynthesis.speak(this.uttr);
  }
  pauseText(){
    window.speechSynthesis.pause();
  }
  resumeText(){
    window.speechSynthesis.resume();
  }
  stopText(){
    if(this.uttr){
      window.speechSynthesis.cancel();
    }
  }
  download() {
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audio.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    const dowd = new SpeechSynthesisUtterance(this.input);
    dowd.onend = () => {
      mediaRecorder.stop();
    };
    mediaRecorder.start();
    window.speechSynthesis.speak(dowd);
  }
}