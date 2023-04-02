input.onButtonPressed(Button.A, function () {
    doCalibrate()
})
input.onButtonPressed(Button.B, function () {
    IsStoped = !(IsStoped)
})
function doCalibrate () {
    IsStoped = true
    pins.digitalWritePin(DigitalPin.P8, 1)
    pins.digitalWritePin(DigitalPin.P0, 0)
    basic.showIcon(IconNames.Heart)
    basic.pause(1000)
    basic.showLeds(`
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
        `)
    StartTime = input.runningTime()
    servos.P2.run(-35)
    while (pins.digitalReadPin(DigitalPin.P0) == 0) {
        basic.pause(10)
        if (input.runningTime() > StartTime + 700) {
            servos.P2.run(-20)
        }
    }
    servos.P2.stop()
    basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
        `)
    basic.pause(1000)
    basic.showLeds(`
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
        `)
    servos.P2.run(50)
    basic.pause(600)
    servos.P2.stop()
    basic.clearScreen()
    pins.digitalWritePin(DigitalPin.P8, 0)
    IsOpen = false
    IsStoped = false
}
function doOpenLid () {
    if (!(IsOpen)) {
        StartTime = input.runningTime()
        pins.digitalWritePin(DigitalPin.P8, 1)
        servos.P2.run(-80)
        basic.pause(400)
        servos.P2.run(-50)
        basic.pause(100)
        servos.P2.run(-20)
        while (pins.digitalReadPin(DigitalPin.P0) == 0 && !(IsStoped)) {
            basic.pause(10)
            if (input.runningTime() > StartTime + 1550) {
                IsStoped = true
                basic.showIcon(IconNames.No)
            }
        }
        servos.P2.stop()
        IsOpen = true
    }
}
function doCloseLid () {
    if (IsOpen) {
        servos.P2.run(50)
        basic.pause(600)
        servos.P2.stop()
        pins.digitalWritePin(DigitalPin.P8, 0)
        IsOpen = false
    }
}
let Counter = 0
let StartTime = 0
let IsOpen = false
let IsStoped = false
basic.showNumber(0)
servos.P2.setStopOnNeutral(false)
servos.P2.stop()
basic.showNumber(1)
IsStoped = true
radio.setGroup(1)
let UpTime = 1000
let LoopCount = 0
let Distance = Environment.sonarbit_distance(Environment.Distance_Unit.Distance_Unit_cm, DigitalPin.P1)
IsOpen = false
basic.showNumber(2)
doCalibrate()
basic.forever(function () {
    if (!(IsStoped)) {
        Distance = Environment.sonarbit_distance(Environment.Distance_Unit.Distance_Unit_cm, DigitalPin.P1)
        if (Distance > 30) {
            if (!(IsOpen)) {
                basic.showLeds(`
                    . . # . .
                    . # . . .
                    # # # # #
                    . # . . .
                    . . # . .
                    `)
                doOpenLid()
            }
        } else {
            if (IsOpen) {
                Counter += 1
                radio.sendNumber(Counter)
                basic.showLeds(`
                    . . # . .
                    . . . # .
                    # # # # #
                    . . . # .
                    . . # . .
                    `)
                basic.pause(3000)
                doCloseLid()
            }
        }
    }
    basic.pause(100)
})
