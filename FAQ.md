## FAQ

#### I try to connect via the connector to the booking manager but nothing happened. What can I do?

First of all: [enable debugging](#how-can-i-enable-debugging) to see what happens! 
Then you should have closed all debug windows before try to connect to the booking manager.


#### How can I enable debugging?

Create the connector with the debugging option `new BookingManagerConnector.default({debug: true})` 
or add a parameter "_&debug_" to your URL.

The debug window is an popup - so you have to give your application the permission to open popups!
The easiest way to do that, is to open your application direct in the browser and trigger the popup.
There will be than a dialog which you have to accept to set the permission.


#### I get the error "... Error: Permission denied" What can I do?

Close all debug windows and / or allow popups in your browser.
