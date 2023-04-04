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
    radio.sendValue("C", 0)
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
    radio.sendValue("C", 1)
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
            if (input.runningTime() > StartTime + 2500) {
                IsStoped = true
                basic.showIcon(IconNames.No)
            }
        }
        servos.P2.stop()
        if (IsStoped) {
            radio.sendValue("S", Counter)
        }
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
enum Distance_Unit {
    Distance_Unit_mm,
    Distance_Unit_cm,
    Distance_Unit_inch,
}
function sonarbit_distance(distance_unit: Distance_Unit, pin: DigitalPin): number {

    // send pulse
    pins.setPull(pin, PinPullMode.PullNone)
    pins.digitalWritePin(pin, 0)
    control.waitMicros(2)
    pins.digitalWritePin(pin, 1)
    control.waitMicros(10)
    pins.digitalWritePin(pin, 0)

    // read pulse
    let d = pins.pulseIn(pin, PulseValue.High, 23000)  // 8 / 340 = 
    let distance = d * 10 * 5 / 3 / 58

    if (distance > 4000) distance = 0

    switch (distance_unit) {
        case 0:
            return Math.round(distance) //mm
            break
        case 1:
            return Math.round(distance / 10)  //cm
            break
        case 2:
            return Math.round(distance / 25)  //inch
            break
        default:
            return 0

    }
}
let Distance = sonarbit_distance(Distance_Unit.Distance_Unit_cm, DigitalPin.P1)
basic.showNumber(0)
servos.P2.setStopOnNeutral(false)
servos.P2.stop()
basic.showNumber(1)
IsStoped = true
radio.setGroup(1)
IsOpen = false
basic.showNumber(2)
doCalibrate()
basic.forever(function () {
    if (!(IsStoped)) {
        Distance = sonarbit_distance(Distance_Unit.Distance_Unit_cm, DigitalPin.P1)
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
                radio.sendValue("U", Counter)
            }
        } else {
            if (IsOpen) {
                Counter += 1
                basic.showLeds(`
                    . . # . .
                    . . . # .
                    # # # # #
                    . . . # .
                    . . # . .
                    `)
                basic.pause(3000)
                doCloseLid()
                radio.sendValue("D", Counter)
            }
        }
    }
    basic.pause(100)
})
