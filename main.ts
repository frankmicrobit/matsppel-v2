input.onButtonPressed(Button.A, function () {
    SmartCity.turn_servo(180, AnalogPin.P2)
})
input.onButtonPressed(Button.B, function () {
    SmartCity.turn_servo(0, AnalogPin.P2)
})
let Counter = 0
let IsOpen = false
let Distance = 0
SmartCity.turn_servo(0, AnalogPin.P2)
radio.setGroup(1)
basic.forever(function () {
    Distance = Environment.sonarbit_distance(Environment.Distance_Unit.Distance_Unit_cm, DigitalPin.P1)
    if (Distance > 30) {
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
        SmartCity.turn_servo(180, AnalogPin.P2)
        IsOpen = true
    } else {
        if (IsOpen) {
            Counter += 1
            radio.sendNumber(Counter)
            basic.showLeds(`
                . . # . .
                . . # . .
                # . # . #
                . # # # .
                . . # . .
                `)
            basic.pause(3000)
            SmartCity.turn_servo(0, AnalogPin.P2)
            IsOpen = false
        }
    }
    basic.pause(100)
})
