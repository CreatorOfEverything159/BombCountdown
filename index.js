(() => {

    const startButton = document.getElementById('start')
    const resetButton = document.getElementById('reset')
    const times = [
        {type: 'milliseconds', size: 999, max: 3},
        {type: 'seconds', size: 59, max: 2},
        {type: 'minutes', size: 59, max: 2}
    ]

    let arrowListeners = []
    let countdownInterval = null
    let isCountdownOn = false

    const getNumberValue = type => +document.getElementById(`${type}Value`).innerText
    const setNumberValue = (type, value) => { document.getElementById(`${type}Value`).innerText = value }
    const getFormattedValue = (value, length) => {
        return value.length < length ? `${"0".repeat(length - value.length)}${value}` : value
    }

    const isCountdownEmpty = () => {
        for (let i in times) { if (getNumberValue(times[i].type)) { return false } }
        return true
    }

    const increase = (type, max, length) => {
        let value = getNumberValue(type)
        setNumberValue(type, getFormattedValue(value === max ? `0` : `${value + 1}`, length))
    }
    const decrease = (type, max, length, step = 1) => {
        const value = getNumberValue(type)
        if (value === 0) { setNumberValue(type, getFormattedValue(`${max - step + 1}`, length)) }
        else if (value <= step) { setNumberValue(type, getFormattedValue("0", length)) }
        else { setNumberValue(type, getFormattedValue(`${value - step}`, length)) }
    }

    const setArrowListeners = (type, max, length) => {
        let lastValue = 0
        let onMouseDownInterval = null
        const upArrow = document.getElementById(type).getElementsByClassName('up')[0]
        const downArrow = document.getElementById(type).getElementsByClassName('down')[0]
        const onIncrease = () => { increase(type, max, length) }
        const onDecrease = () => { decrease(type, max, length) }
        const onStart = (callback) => {
            removeSignal()
            lastValue = getNumberValue(type)
            onMouseDownInterval = setInterval(callback, 100)
        }
        const onStop = (callback) => {
            if (onMouseDownInterval) {
                clearInterval(onMouseDownInterval)
                onMouseDownInterval = null
                if (getNumberValue(type) === lastValue) {
                    removeSignal()
                    callback()
                }
            }
        }

        arrowListeners.push({ arrow: upArrow, type: 'mousedown', callback: () => { onStart(onIncrease) } })
        arrowListeners.push({ arrow: upArrow, type: 'mouseup', callback: () => { onStop(onIncrease) } })
        arrowListeners.push({ arrow: upArrow, type: 'mouseout', callback: () => { onStop(onIncrease) } })
        arrowListeners.push({ arrow: downArrow, type: 'mousedown', callback: () => { onStart(onDecrease) } })
        arrowListeners.push({ arrow: downArrow, type: 'mouseup', callback: () => { onStop(onDecrease) } })
        arrowListeners.push({ arrow: downArrow, type: 'mouseout', callback: () => { onStop(onDecrease) } })

        arrowListeners.forEach(listener => { listener.arrow.addEventListener(listener.type, listener.callback) })
    }

    const addArrowListeners = () => { times.forEach((e) => { setArrowListeners(e.type, e.size, e.max) }) }
    const removeArrowListeners = () => {
        arrowListeners.forEach(listener => { listener.arrow.removeEventListener(listener.type, listener.callback) })
        arrowListeners = []
    }

    const stop = () => {
        addArrowListeners()
        clearInterval(countdownInterval)
        startButton.innerText = 'START'
        isCountdownOn = false
    }
    const setSignal = () => {
        const wrap = document.getElementsByClassName('wrapper')
        wrap[0].style.color = 'green'
        startButton.style.color = 'green'
        resetButton.style.color = 'green'
    }
    const removeSignal = () => {
        const wrap = document.getElementsByClassName('wrapper')
        wrap[0].style.color = 'black'
        startButton.style.color = 'black'
        resetButton.style.color = 'black'
    }

    const end = () => {
        stop()
        setSignal()
    }

    const start = () => {
        if (isCountdownOn) { stop() }
        else {
            removeSignal()
            removeArrowListeners()
            countdownInterval = setInterval(() => { isCountdownEmpty() ? end() : countdown(0) }, 11)
            startButton.innerText = 'STOP'
            isCountdownOn = true
        }
    }

    const countdown = c => {
        let step = c ? 1 : 11
        decrease(times[c].type, times[c].size, times[c].max, step)
        getNumberValue(times[c].type) === times[c].size - step + 1 && c + 1 < times.length ? countdown(c + 1) : null
    }

    const reset = () => {
        if (isCountdownOn) { stop() }
        times.forEach((e) => { setNumberValue(e.type, getFormattedValue("0", e.max)) })
        removeSignal()
    }

    addArrowListeners()
    resetButton.addEventListener('click', reset)
    startButton.addEventListener('click', start)

})()