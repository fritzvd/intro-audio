'use strict'

const ac = new AudioContext()
var gain = ac.createGain()

// function createOscillators () {
//   for (var i=0 i < 8 i++) {
//     var oscillator = ac.createOscillator()
//     oscillator.connect(gain)
//     oscillators.push(oscillator)
//
//     oscillator.type = 'square'
//     oscillator.frequency.value = 440
//     oscillator.start()
//
//
//   }
// }
// createOscillators()
// // oscillator.connect(gain)
// gain.connect(ac.destination)
//

let slideItems = {}
let cleanUp
let oscillator

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
  let oscillatorCleanUp = cleanUp
  cleanUp = null

  let pitch = document.querySelector('.pitch')
  let rangevalue = document.querySelector('.rangevalue')

  pitch.onchange = function () {
    oscillator.frequency.value = parseInt(pitch.value)
    rangevalue.innerHTML = oscillator.frequency.value
  }

  cleanUp = function () {
    oscillatorCleanUp()
    pitch.onchange = null
  }
}

let dummy = function () {
  if (cleanUp) {
    cleanUp()
    cleanUp = null
  }
}

const slideActions = {
  0: dummy,
  1: dummy,
  2: dummy,
  3: dummy,
  4: simpleOscillator,
  5: simpleOscillatorWithUI,
  6: dummy,
  7: dummy,
}
