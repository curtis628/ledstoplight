#!/usr/bin/env node

var Gpio = require('onoff').Gpio,
  redLed = new Gpio(20, 'out'),
  greenLed = new Gpio(21, 'out');

var program = require('commander');

var TIME_REGEX = /^\d\d:\d\d$/
var TIME_USAGE = "<time> must be in the local 24-hour format HH:MM."
var MAX_HOURS = 23;
var MAX_MINUTES = 59;
var DEFAULT_RED_ON   = "19:00"; // 07:00 PM
var DEFAULT_GREEN_ON = "23:00"; // 11:00 PM
var DEFAULT_ALL_OFF  = "08:00"; // 07:00 AM
var DEFAULT_INTERVAL = 30; // Default to checking every 30 seconds
var ON = 1;
var OFF = 0;

var redLedOn_hours;
var redLedOn_minutes;
var greenLedOn_hours;
var greenLedOn_minutes;
var ledsOff_hours;
var ledsOff_minutes;
var interval;

/**
 * Compares current time to specified alarms to see if the LEDs should turn on or off
 */
function checkAlarm() {
    var now = new Date()
    var nowHours = now.getHours();
    var nowMinutes = now.getMinutes();
    console.log(now);

    if (redLedOn_hours == nowHours && redLedOn_minutes == nowMinutes) {
        console.log("%s - Red LED is turning ON", now);
        redLed.writeSync(ON)
    }
    if (greenLedOn_hours == nowHours && greenLedOn_minutes == nowMinutes) {
        console.log("%s - Red LED is turning OFF; Green LED is turning ON", now);
        redLed.writeSync(OFF);
        greenLed.writeSync(ON);
    }
    if (ledsOff_hours == nowHours && ledsOff_minutes == nowMinutes) {
        console.log("%s - All LEDs turn OFF", now);
        redLed.writeSync(OFF);
        greenLed.writeSync(OFF);
    }
}

/**
 * Validates that `input` is a valid, 24-hour format.
 * @param {String} input - input provided to command line
 * @param {String} defaultValue - the default to use if `input` is not provided
 */
function parseTime(input, defaultValue) {
    var validTime = false;
    var inputTime = input || defaultValue;
    
    if (TIME_REGEX.test(inputTime)) {
        var splitVal = inputTime.split(":");
        var hours = splitVal[0];
        var minutes = splitVal[1];
        validTime = hours <= MAX_HOURS && minutes <= MAX_MINUTES;
    } 

    if (!validTime) {
        console.error();
        console.error("  error: Invalid <time> provided: %s. %s", inputTime, TIME_USAGE);
        console.error();
        process.exit(1);
    }
    return inputTime;
}

/** We know `time` was already validated by `parseTime`. Returns the "hours" portion of the time. */
function getHours(time) {
    return time.split(":")[0];
}

/** We know `time` was already validated by `parseTime`. Returns the "minutes" portion of the time. */
function getMinutes(time) {
    return time.split(":")[1];
}

/** Gracefully exit; shutdown interval and free up GPIO resources. */
function exit() {
    console.log("Quitting... ");
    clearInterval(interval);

    redLed.unexport();
    greenLed.unexport();

    console.log("Cleared GPIO settings...")
    process.exit();
}

var main = function() {
    program
        .description('LED stoplight. ' + TIME_USAGE)
        .option('-r, --red-on <time>', 'The time the red LED should turn on. Defaults to: ' + DEFAULT_RED_ON, parseTime, DEFAULT_RED_ON)
        .option('-g, --green-on <time>', 'The time the green LED should turn on (and also turn off red LED). Defaults to: ' + DEFAULT_GREEN_ON,
                parseTime, DEFAULT_GREEN_ON)
        .option('-o, --all-off <time>', 'The time all LEDs should be turned off. Defaults to: ' + DEFAULT_ALL_OFF, parseTime, DEFAULT_ALL_OFF)
        .option('-i, --interval <n>', 'Check every <n> seconds to see if an LED should turn on. Defaults to: ' + DEFAULT_INTERVAL, DEFAULT_INTERVAL)
        .parse(process.argv);

    redLedOn_hours = getHours(program.redOn);
    redLedOn_minutes = getMinutes(program.redOn);
    greenLedOn_hours = getHours(program.greenOn);
    greenLedOn_minutes = getMinutes(program.greenOn);
    ledsOff_hours = getHours(program.allOff);
    ledsOff_minutes = getMinutes(program.allOff);
    interval = setInterval(checkAlarm, program.interval * 1000);

    console.log("Red LED ON at ---> %d:%d", redLedOn_hours, redLedOn_minutes);
    console.log("Green LED ON at -> %d:%d", greenLedOn_hours, greenLedOn_minutes);
    console.log("All LEDs OFF at -> %d:%d", ledsOff_hours, ledsOff_minutes);
    console.log("Checking alarms every %d seconds", program.interval);

    process.on('SIGINT', exit);
}

if (require.main === module) {
    main();
}
