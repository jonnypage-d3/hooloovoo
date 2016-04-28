// Special thanks to http://sonnycruz.blogspot.ca/2016/03/blynk-raspberry-pi-apa102-addressable.html for the inspiration
/*
    Ok, so here's how I read how these things work.
    
    APA102 LEDs use a BGR color scheme.
    
    Start Frame     Brightness      Blue        Green       Red
    0000 (32 bits)  111 + 5bits     8 Bits      8 Bits      8 Bits  = 32 bits per LED
    
    For brightness, it starts with 111, then 0-31 for brightness levels
    Then, led_bits are a bitstream that will be sent out via SPI
    
    Everything goes into one array, we update the led location in the array with new color data, then push the whole array to the strip
*/
var rpio = require('rpio');
var hex2rgb = require('hex2rgb');

exports.version = '1.0.7';

// Init rpio
rpio.init({
    mapping: 'gpio'
}); /* Use the GPIOxx numbering */
rpio.init({
    gpiomem: false
}); /* Use /dev/mem for i²c/PWM/SPI */

var setup_complete = false;
var debug = false;
function hooloovoo() {
    this.array_leds = new Array();
    this.led_buffer = new Buffer(1);
}

hooloovoo.prototype = {
    setup: function(num_led, clock_divider, debug) {
        this.led_length = num_led; // The number of LEDs 
        
        this.led_bits = this.led_length * 4 + 8; // The number of LEDs *4 (BGRb + 4 start frame bits + 4 end frame bits
        this.led_buffer = new Buffer(this.led_bits);
        for (var i = 0; i < this.led_bits; i++) {
            this.led_buffer[i] = 0x00;
        };
        clock_divider = typeof clock_divider !== 'undefined' ? clock_divider : 128; // Thanks @tearne
        if(debug) {
            this.debug = true;
            console.log("Hooloovoo: There are "+this.led_length+" Leds in the string")   
        }
        // setup rpio SPI
        rpio.spiBegin();
        rpio.spiSetClockDivider(clock_divider);
        setup_complete = !setup_complete;
        
    },
    set_clock: function(clock_divider) { // The argument is an even divisor of the base 250MHz rate ranging between 0 and 65536.
        rpio.spiSetClockDivider(clock_divider);
    },
    write_strip: function() {
        if(!setup_complete) {
            console.log("Hooloovoo: Setup(number of LEDs) not run yet. Please initialize the strip");
            return false;
        }
        rpio.spiWrite(this.led_buffer, this.led_bits);
    },
    // Set Hex values
    set_pixel_hex: function(requested_led, hex) {
        if(this.debug) console.log('Hooloovoo: Setting Pixel ['+requested_led+'] Hex to: '+hex)
        var BGRb = hex2rgb(hex).rgb;
        this.set_pixel_BGRb(requested_led, BGRb[2], BGRb[1], BGRb[0], 255); // Converts RGB Hex to BGR
    },
    fill_hex: function(hex) {
        if(this.debug) console.log('Hooloovoo: Filling strip Hex to: '+hex)
        var BGRb = hex2rgb(hex).rgb; // Converts hex to RGB
        this.fill_BGRb(BGRb[2], BGRb[1], BGRb[0], 255); // Converts RGB to BGR
    },
    // Set RGB Values
    set_pixel_RGB: function(requested_led, red, green, blue) { // This will set a single LED a given BGRb Color
        if(this.debug) console.log('Hooloovoo: Setting Pixel ['+requested_led+'] RGB to: r['+red+'] g['+green+'] b['+blue+']');
        this.set_pixel_BGRb(requested_led, blue, green, red, 255) // Hardcoded to 255 brightness for now
    },
    fill_RGB: function(red, green, blue) { // This will set all the LEDs in the strip the same color
        if(this.debug) console.log('Hooloovoo: Filling strip RGB to: r['+red+'] g['+green+'] b['+blue+']');
        this.fill_BGRb(blue, green, red, 255) // Hardcoded to 255 brightness for now
    },
    // Set BGR Values
    set_pixel_BGR: function(requested_led, blue, green, red) { // This will set a single LED a given BGRb Color
        if(this.debug) console.log('Hooloovoo: Setting Pixel ['+requested_led+'] BGR to: b['+blue+'] g['+green+'] r['+red+']');
        this.set_pixel_BGRb(requested_led, blue, green, red, 255) // Hardcoded to 255 brightness for now
    },
    fill_BGR: function(blue, green, red) { // This will set all the LEDs in the strip the same color
        if(this.debug) console.log('Hooloovoo: Filling strip BGR to: b['+blue+'] g['+green+'] r['+red+']');
        this.fill_BGRb(blue, green, red, 255) // Hardcoded to 255 brightness for now
    },
    // Set BGRb Values - where all the actual work is done
    set_pixel_BGRb: function(requested_led, blue, green, red, brightness) { // This will set a single LED a given BGRb Color
        if(requested_led > this.led_length) {
            console.log("Hooloovoo: You can't change a pixel that doesn't exist! - Pixel requested: "+requested_led);   
            return false;
        }
        var current_led = 4 + (requested_led * 4) // Start frame, plus the given LED number = bit position
        this.led_buffer[current_led + 1] = blue // Blue
        this.led_buffer[current_led + 2] = green // Green
        this.led_buffer[current_led + 3] = red // Red
        this.led_buffer[current_led + 0] = 255 // Brightness
        this.write_strip();
    },
    fill_BGRb: function(blue, green, red, brightness) { // This will set all the LEDs in the strip the same color
        for(var i=0; i < this.led_length; i++){
            var current_led = 4 + (i * 4) // Start frame, plus the given LED number = bit position
            this.led_buffer[current_led + 1] = blue // Blue
            this.led_buffer[current_led + 2] = green // Green
            this.led_buffer[current_led + 3] = red // Red
            this.led_buffer[current_led + 0] = 255 // Brightness
        }
        this.write_strip();
    },
    get_pixel_RGB: function(requested_led) {
        var current_led = 4 + (requested_led * 4)
        var rgb_array = new Array();
        rgb_array[0] = this.led_buffer[current_led+3] // Red
        rgb_array[1] = this.led_buffer[current_led+2] // Green
        rgb_array[2] = this.led_buffer[current_led+1] // Blue
        return(rgb_array);
    },
    clear: function() {
        if(this.debug) console.log("Hooloovoo: clearing strip. Turning off all pixels.");
        this.fill_BGRb(0, 0, 0, 0); // Turn off all the LEDs
    }
}
module.exports = new hooloovoo();