import './style.css'
import Peaks from 'peaks.js'

// Peaks.js
// const options = {};
// Peaks.init(options, function(err, peaks) {});
// const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// const analyser = audioCtx.createAnalyser();

// src: https://gist.github.com/maxjvh/e4f6c9ec0fdea9450fd9303dd088b96d
const audio = document.createElement('audio');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const svg = document.querySelector('svg');
const progress = svg.querySelector('#progress');
const remaining = svg.querySelector('#remaining');
const width = svg.getAttribute('width');
const height = svg.getAttribute('height');
svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
const smoothing = 2;

svg.addEventListener('click', e => {
  const position = e.offsetX / svg.getBoundingClientRect().width;
  audio.currentTime = position * audio.duration;
});

document.querySelector('input').addEventListener('change', e => {
  console.log('e =', e);
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = e => processTrack(e.target.result);
  reader.readAsArrayBuffer(file);
  attachToAudio(file);
});

const RMS = values => Math.sqrt(
  values.reduce((sum, value) => sum + Math.pow(value, 2), 0) / values.length
);
const avg = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const max = values => values.reduce((max, value) => Math.max(max, value), 0);

function getWaveformData(audioBuffer, dataPoints) {
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel = audioBuffer.getChannelData(1);

  const values = new Float32Array(dataPoints);
  const dataWindow = Math.round(leftChannel.length / dataPoints);
  for (let i = 0, y = 0, buffer = []; i < leftChannel.length; i++) {
    const summedValue = (Math.abs(leftChannel[i]) + Math.abs(rightChannel[i])) / 2;
    buffer.push(summedValue);
    if (buffer.length === dataWindow) {
      values[y++] = avg(buffer);
      buffer = [];
    }
  }
  return values;
}

function getSVGPath(waveformData) {
  const maxValue = max(waveformData);

  let path = `M 0 ${height} `;
  for (let i = 0; i < waveformData.length; i++) {
    path += `L ${i * smoothing} ${(1 - waveformData[i] / maxValue) * height} `;
  }
  path += `V ${height} H 0 Z`;

  return path;
}

function attachToAudio(file) {
  audio.setAttribute('autoplay', true);
  audio.src = URL.createObjectURL(file);
  updateAudioPosition();
}

function updateAudioPosition() {
  const {currentTime, duration} = audio;
  // console.log('currentTime =', currentTime);
  // console.log('duration =', duration);
  // console.log('audio =', audio);
  const physicalPosition = currentTime / duration * width;
  if (physicalPosition) {
    progress.setAttribute('width', physicalPosition);
    remaining.setAttribute('x', physicalPosition);
    remaining.setAttribute('width', width - physicalPosition);
  }
  requestAnimationFrame(updateAudioPosition);
}

function processTrack(buffer) {
  const source = audioContext.createBufferSource();

  console.time('decodeAudioData');

  return audioContext.decodeAudioData(buffer)
    .then(audioBuffer => {
      console.timeEnd('decodeAudioData');

      console.time('getWaveformData');
      const waveformData = getWaveformData(audioBuffer, width / smoothing);
      console.timeEnd('getWaveformData');

      console.time('getSVGPath');
      svg.querySelector('path').setAttribute('d', getSVGPath(waveformData, height, smoothing));
      console.timeEnd('getSVGPath');

      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
    })
    .catch(console.error);
}