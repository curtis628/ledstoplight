# ledstoplight
An LED stoplight alarm for my Raspberry Pi. This is a node.js application that controls two LEDs wired up on my Raspberry Pi by turning them on or off at a configured time. See circuit diagram below for how I wired everything up.

## NPM Dependencies
- [onoff](https://github.com/fivdi/onoff) - Used to control GPIO outputs
- [commander](https://github.com/tj/commander.js) - Used to faciliate the command-line interface

## Circuit Diagram

Here is my circuit diagram that's required for running `ledstoplight`.

<img src="https://raw.githubusercontent.com/curtis628/ledstoplight/master/examples/ledstoplight_circuit.png">

## Usage
Thanks to [commander](https://github.com/tj/commander.js), you can see how to use `ledstoplight` from the command-line using the `--help` argument.

```sh
$ ./ledstoplight.js --help

  Usage: ledstoplight [options]

  LED stoplight. <time> must be in the local 24-hour format HH:MM.

  Options:

    -h, --help             output usage information
    -r, --red-on <time>    The time the red LED should turn on. Defaults to: 19:00
    -g, --green-on <time>  The time the green LED should turn on (and also turn off red LED). Defaults to: 23:00
    -o, --all-off <time>   The time all LEDs should be turned off. Defaults to: 08:00
    -i, --interval <n>     Check every <n> seconds to see if an LED should turn on. Defaults to: 30
```
