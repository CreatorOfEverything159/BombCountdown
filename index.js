const startButton = document.getElementById('start')
const resetButton = document.getElementById('reset')
const chain = [
    ['milliseconds', 999, 3],
    ['seconds', 59, 2],
    ['minutes', 59, 2]
]



let chain1 = {
    milliseconds: { min: 3, max: 999 },
    seconds: { min: 59, max: 2 },
    minutes: { min: 59, max: 2 }
}

Object.keys(chain1).forEach(name => console.log(name))

let arrowListeners = []
let lastValue = 0
let onMouseDownInterval = null
let countdownInterval = null
let isCountdownOn = false


function getNumberValue(type) {
    return +document.getElementById(`${type}Value`).innerText
}

function setNumberValue(type, value) {
    document.getElementById(`${type}Value`).innerText = value
}

function getFormattedValue(value, length) {
    return value.length < length ? `${"0".repeat(length - value.length)}${value}` : value
}

function isCountdownEmpty() {
    for (let i = 0; i < chain.length; ++i) {
        if (getNumberValue(chain[i][0])) {
            return false
        }
    }
    return true
}

function increase(type, max, length) {
    let value = getNumberValue(type)
    setNumberValue(type, getFormattedValue(value === max ? `0` : `${value + 1}`, length))
}

function decrease(type, max, length, step = 1) {
    let value = getNumberValue(type)
    if (value === 0) {
        setNumberValue(type, getFormattedValue(`${max - step + 1}`, length))
    } else if (value <= step) {
        setNumberValue(type, getFormattedValue("0", length))
    } else {
        setNumberValue(type, getFormattedValue(`${value - step}`, length))
    }
}

function setArrowListeners(type, max, length) {
    let upArrow = document.getElementById(type).getElementsByClassName('up')[0]
    let downArrow = document.getElementById(type).getElementsByClassName('down')[0]
    const onIncrease = () => { increase(type, max, length) }
    const onDecrease = () => { decrease(type, max, length) }
    const onStart = (callback) => {
        removeBlinking()
        lastValue = getNumberValue(type)
        onMouseDownInterval = setInterval(callback, 100)
    }
    arrowListeners.push([upArrow, 'mousedown', () => { onStart(onIncrease) }])
    arrowListeners.push([downArrow, 'mousedown', () => { onStart(onDecrease) }])
    arrowListeners.slice(-6).map((listener) => {
        listener[0].addEventListener(listener[1], listener[2])
    })
}

function addArrowListeners() {
    chain.map((element) => { setArrowListeners(element[0], element[1], element[2]) })
}

function removeArrowListeners() {
    arrowListeners.forEach((listener) => { listener[0].removeEventListener(listener[1], listener[2]) })
    arrowListeners = []
}

function stop() {
    addArrowListeners()
    clearInterval(countdownInterval)
    startButton.innerText = 'START'
    isCountdownOn = false
}

function setBlinking() {
    [...document.getElementsByClassName('number')].map((number) => { number.style.animationName = 'blinking' })
}

function removeBlinking() {
    [...document.getElementsByClassName('number')].map((number) => { number.style.animationName = 'none' })
}

function end() {
    stop()
    setBlinking()
    console.log("COUNTDOWN ENDED");
}

function countdown(c) {
    let step = c ? 1 : 11
    decrease(chain[c][0], chain[c][1], chain[c][2], step)
    getNumberValue(chain[c][0]) === chain[c][1] - step + 1 && c + 1 < chain.length ? countdown(c + 1) : null
}

function reset() {
    if (isCountdownOn) {
        stop()
    }
    chain.map((element) => { setNumberValue(element[0], getFormattedValue("0", element[2])) })
    removeBlinking()
}

function start() {
    if (isCountdownOn) {
        stop()
    } else {
        removeBlinking()
        removeArrowListeners()
        countdownInterval = setInterval(() => { isCountdownEmpty() ? end() : countdown(0) }, 11)
        startButton.innerText = 'STOP'
        isCountdownOn = true
    }
}

addArrowListeners()
resetButton.addEventListener('click', reset)
startButton.addEventListener('click', start)
