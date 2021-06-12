import './style.css'
// import Peaks from 'peaks.js'
import WaveSurfer from 'wavesurfer.js'

document.querySelector('#app').innerHTML = `
  <h1>Wave form with the Web Audio API</h1>
`

const xhr = {
  cache: 'default',
  mode: 'cors',
  method: 'GET',
  credentials: 'same-origin',
  redirect: 'follow',
  referrer: 'client',
  headers: [
    { key: 'Authorization', value: 'my-token' }
  ]
};

const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: 'violet',
  progressColor: 'purple',
  barRadius: 3,
  cursorColor: "crimson",
  responsive: true,
  // xhr: {
  //   cache: "default",
  //   mode: "cors",
  //   method: "GET",
  //   credentials: "include",
  //   headers: [
  //     { key: "cache-control", value: "no-cache" },
  //     { key: "pragma", value: "no-cache" }
  //   ]
  // }
})

// wavesurfer.load('https://webaudio.rowild.at/public/audio/Samai-Shadd-Araban.mp3');
// wavesurfer.load('https://webaudio.rowild.at/public/audio/Art_Tatum-Tiger_Rag.mp3');
// wavesurfer.load('https://webaudio.rowild.at/public/audio/Fernandell-simplet.mp3');
// wavesurfer.load('https://webaudio.rowild.at/public/audio/Jan-Werich-Jaroslav-Jezek-Bugatti-Step.mp3');
// wavesurfer.load('https://webaudio.rowild.at/public/audio/Jimmy-Cliff-I-Can-See-Clearly-Now.mp3');
// wavesurfer.load('https://webaudio.rowild.at/public/audio/Johnny-Nash-I-can-see-clearly-now.mp3');
// wavesurfer.load('https://webaudio.rowild.at/public/audio/Moving-Too-Fast.mp3');
// wavesurfer.load('https://webaudio.rowild.at/public/audio/Pino-Pugliese-El-Ultimo-Payaso.mp3');
// wavesurfer.load('https://webaudio.rowild.at/public/audio/Richard-Cheese-Tuxicity-01-She-Hates-Me.mp3');
// wavesurfer.load('https://webaudio.rowild.at/public/audio/Richard-Cheese-Tuxicity-12-Smoke-Two-Joints.mp3');

const audioSelector = document.getElementById('examples')
audioSelector.addEventListener('change', e => {
  console.log('CHANGE e =', e);
  console.log('audioSelector.value =', audioSelector.value);

  if (audioSelector.value) {
    console.log('Load audioSelector.value=', audioSelector.value);
    wavesurfer.load(audioSelector.value)
  }
  else {
    console.log('No sound file to load');
  }
})
// audioSelector.addEventListener('click', e => {
//   console.log('CLICK e =', e);
// })


wavesurfer.on('finished', () => {
  console.log('soundfile loading finished');
})