#!/usr/bin/env node

var Gpio = require('onoff').Gpio,
  led = new Gpio(22, 'out');

var ON = 1;
var OFF = 0;

/** Gracefully exit; shutdown interval and free up GPIO resources. */
function exit() {
    console.log("Quitting... ");
    clearInterval(interval);

    led.unexport();

    console.log("Cleared GPIO settings...")
    process.exit();
}

var main = function() {
    console.log("Turning LED ON");
    led.writeSync(ON);  
    setTimeout(function() {
        console.log("Turning LED OFF");
        led.writeSync(OFF);  
        exit();
    }, 5000);

    process.on('SIGINT', exit);
}

if (require.main === module) {
    main();
}
