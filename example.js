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


// Exit gracefully
process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from (Ctrl-C)");
    // some other closing procedures go here
    hooloovoo.clear();
    process.exit();
})
// End Exit