Hooloovoo
==========
A superintelligent shade of the color blue.

This is a **node.js** library to control a **APA102** RGB LED strip via **SPI** with your **Raspberry Pi**.

Control APA102 programmable LEDs with node.js

### Installation
```sh
npm install hooloovoo
```

This module is located on npm as [hooloovoo](https://npmjs.org/package/hooloovoo)

### Initialization
```js
var hooloovoo = require('hooloovoo');
hooloovoo.setup(54); // The number of LEDs 
```
Parameters:
* the `number of LEDs` your apa102 strip has (32,60,...)
* (optional) the `SPI clock` (must be a power of 2). Default is 128

### Fill strip with one color
```js
hooloovoo.fill_hex("FF0000");
```
Set the whole strip the same color with a Hex value.

Parameters:
* A hex value. Between 000000 and FFFFFF

This example sets the all the LEDs in the strip red (FF0000)

```js
hooloovoo.fill_RGB(255,0,0);
```
Set the whole strip the same color with RGB values.

Parameters:
* red value (0 to 255)
* green value (0 to 255)
* blue value (0 to 255)

This example sets the all the LEDs in the strip red (255,0,0)

```js
hooloovoo.fill_BGR(0,0,255);
```
Since APA102 LED strips are BRG, there is an option to set them in their native format.

Parameters:
* blue value (0 to 255)
* green value (0 to 255)
* red value (0 to 255)

This example sets the all the LEDs in the strip red (0,0,255)

### Set LED color individually
```js
hooloovoo.set_pixel_hex(0,FF0000);  // set LED1 to red
```
Parameters:
* Select an LED(0 to `number of LEDs` -1)
* A hex value. Between 000000 and FFFFFF

This example sets `LED 0` (first LED) red. (FF0000)

```js
hooloovoo.set_pixel_RGB(0,255,0,0); // set LED1 to red
```
Parameters:
* Select an LED(0 to `number of LEDs` -1)
* blue value (0 to 255)
* green value (0 to 255)
* red value (0 to 255)

This example sets `LED 0` (first LED) red. (255,0,0)

```js
hooloovoo.set_pixel_BGR(0,0,0,255); // set LED1 to red
```
Since APA102 LED strips are BRG, there is an option to set them in their native format.
Parameters:
* Select an LED(0 to `number of LEDs` -1)
* blue value (0 to 255)
* green value (0 to 255)
* red value (0 to 255)

This example sets `LED 0` (first LED) red. (0,0,255)

### Turn off all the LEDs
```js
hooloovoo.clear();
```
This turns off all the LEDs

### Set the SPI clock
```js
hooloovoo.set_clock(128);
```
Parameters:
The `SPI clock` (must be a power of 2). Default is 128

### Send buffer to SPI
```js
hooloovoo.write_strip();
```
Sends all stored colors to the APA102 strip.  
Not normally needed, but exposed for reasons.

### Example
```js
var hooloovoo = require('hooloovoo');

// connecting to Raspberry Pi 
hooloovoo.setup(10, 16); // assign number of APA102 LEDs, assign SPI clock
hooloovoo.set_clock(16); // OPTIONAL - Assign SPI clock - same as 2nd value of setup(), so unnecessary if you set it in setup(). Set this individually if you like.

var led_count = 10;

// set all colors to red 
console.log('fill all red');
hooloovoo.fill_RGB(255,0,0);

// after 2 seconds set first 6 LEDs to (red, green, blue, red, green, blue) 
setTimeout(function(){
  console.log("red green blue red green blue");
  // set_pixel_RGB(ledIndex,r,g,b); 
  // ledIndex: 0 = LED1, 1 = LED2, … 
  // red: (0-255), green: (0-255), blue: (0-255)
  hooloovoo.set_pixel_RGB(0,255,0,0);   // set LED1 to red 

  // set_pixel_hex(ledIndex, hexColor); 
  // ledIndex: 0 = LED1, 1 = LED2, … 
  // hexColor: '#FF0000' = red, '#00FF00' = green, ... 
  hooloovoo.set_pixel_hex(1,'00FF00');  // set LED2 to green 
    
  // set_pixel_BGR(ledIndex,b,g,r); 
  // ledIndex: 0 = LED1, 1 = LED2, … 
  // blue: (0-255), green: (0-255), red: (0-255)
  hooloovoo.set_pixel_BGR(2,255,0,0);   // set LED3 to blue 
  
  hooloovoo.set_pixel_hex(3,'FF0000');  // set LED4 to red 
  hooloovoo.set_pixel_hex(4,'00FF00');  // set LED5 to green 
  hooloovoo.set_pixel_hex(5,'0000FF');  // set LED6 to blue 
}, 2000);
```

When running this example the LED strip will first fill all LEDs with red.  
After 2 seconds it sets the color of the first 6 LEDs to (red, green, blue, red, green, blue).

### Wiring the Raspberry Pi

Connect your Pi like this to the LED driver:

| Raspberry Pi | led driver |
|:------------:|:----------:|
| GND | GND |
| 5V  | input V+ |
| SCLK | input CLK |
| MOSI | input DIN |

**I am not responsible for any damages to your hardware. Use this at your own risk.**