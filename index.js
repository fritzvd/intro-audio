'use strict'

var ac = new AudioContext()
var gain = ac.createGain()

var slideItems = {}
var cleanUp, oscillator, distortion, biquad

function simpleOscillator (index) {
  if (cleanUp) {
    cleanUp()
    cleanUp = null
  }

  oscillator = ac.createOscillator()
  oscillator.frequency.value = 440
  oscillator.start()
  oscillator.connect(ac.destination)

  cleanUp = function () {
    oscillator.stop()
    oscillator.disconnect(ac.destination)
    oscillator = null
  }
}

function simpleOscillatorWithUI (index) {
  if (cleanUp) {
    cleanUp()
    cleanUp = null
  }

  simpleOscillator(index)
  var oscillatorCleanUp = cleanUp
  cleanUp = null

  var pitch = document.querySelector('.pitch')
  var rangevalue = document.querySelector('.rangevalue')

  pitch.onchange = function () {
    oscillator.frequency.value = parseInt(pitch.value)
    rangevalue.innerHTML = oscillator.frequency.value
  }

  cleanUp = function () {
    oscillatorCleanUp()
    pitch.onchange = null
  }
}


function simpleBiquad (index) {
  if (cleanUp) {
    cleanUp()
    cleanUp = null
  }

  oscillator = ac.createOscillator()
  oscillator.frequency.value = 440
  var t = 0
  var freqChange = setInterval(function () {
    t += 1
    if (t > 64) {
      oscillator.frequency.value -= t
    } else {
      oscillator.frequency.value += t
    }

    if (oscillator.frequency.value < 100) {
      t = 0
    }
  }, 10)
  oscillator.type = 'sine'
  oscillator.start()

  biquad = ac.createBiquadFilter()
  biquad.type = 'peaking'
  biquad.frequency.value = 1000
  biquad.gain.value = 40

  oscillator.connect(ac.destination)

  var biquadOn = false
  var biquadBtn = document.getElementById('biquad')
  biquadBtn.onclick = function () {
    biquadOn = !biquadOn
    if (biquadOn) {
      oscillator.connect(biquad)
      biquad.connect(ac.destination)
      biquadBtn.innerHTML = 'Turn off biquad'
    } else {
      oscillator.disconnect(biquad)
      biquad.disconnect(ac.destination)
      oscillator.connect(ac.destination)
      biquadBtn.innerHTML = 'Turn on biquad'
    }

  }

  cleanUp = function () {
    if (biquadOn) {
      biquad.disconnect(ac.destination)
    }
    biquad = null
    oscillator.stop()
    oscillator = null
    clearInterval(freqChange)
  }
}

var dummy = function () {
  if (cleanUp) {
    cleanUp()
    cleanUp = null
  }
}

var slideActions = [
  dummy,
  dummy,
  dummy,
  simpleOscillator,
  simpleOscillatorWithUI,
  simpleBiquad,
  dummy,
]
