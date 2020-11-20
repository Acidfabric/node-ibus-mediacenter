# node-ibus-mediacenter

You can use this package with Resler's interface (http://www.reslers.de/IBUS/index.html) or similar Ibus adapters.

Configure your device location in `config.ts`. To find available devices run command `yarn listports` in terminal.

## Testing

in the src/ibus/raw folder logged some of the data that goes through the IBUS stream of a BMW X3 E83 from 2010.

`test1.bin`, `BMW_IBUS_1.bin` and `BMW_IBUS_2.bin`

You can play back these log files to a virtual serial device and test your code.

### Setting up a virtual Serial Device

`socat -d -d PTY PTY`

This will create 2 devices: ex `/dev/ttys005` and `/dev/ttys006`

You start IbusReader with the master (ex `/dev/ttys005`) and send traffic to the slave (ex `/dev/ttys006`)

### Simulating IBUS traffic on the serial slave

From the src/raw folder run:

`socat -U -d -d -d /dev/ttys006,clocal=1,cs8,nonblock=1,ixoff=0,ixon=0,ispeed=9600,ospeed=9600,raw,echo=0,crtscts=0 FILE:test.bin`

<!-- To emulate virtual interface -->
<!-- socat -d -d PTY PTY -->
<!-- echo -e -n "\x50\x04\x68\x3B\x21\xA6" > /dev/ttys014 -->
<!-- /dev/ttys002 <--- /dev/ttys003 -->
<!-- cat BMW_IBUS_1.bin > /dev/ttys003 -->

<!-- sudo socat -U -d -d -d /dev/ttys006,clocal=1,cs8,nonblock=1,ixoff=0,ixon=0,ispeed=9600,ospeed=9600,raw,echo=0,crtscts=0 FILE:BMW_IBUS_1.bin -->
<!-- sudo socat -U -d -d -d /dev/ttys006,clocal=1,cs8,nonblock=1,ixoff=0,ixon=0,ispeed=9600,ospeed=9600,raw,echo=0,crtscts=0 FILE:test.bin -->

<!-- {6, "\xF0\x05\xFF\x47\x00\x38\x75", "info", NULL, KEY_I},
{6, "\xF0\x04\x3B\x48\x05\x82", "enter", NULL, KEY_ENTER},
{7, "\xF0\x05\xFF\x47\x00\x0F\x42", "sel", NULL, KEY_TAB},
{4, "\xF0\x04\x3B\x49", "rotary", NULL, 0, ibus_handle_rotary},
{6, "\xF0\x04\x68\x48\x40\x94", "FF", NULL, KEY_RIGHT|_CTRL_BIT},
{6, "\xF0\x04\x68\x48\x50\x84", "RR", NULL, KEY_LEFT|_CTRL_BIT},
{6, "\xF0\x04\x68\x48\x11\xC5", "1", NULL, KEY_ESC},
{6, "\xF0\x04\x68\x48\x01\xD5", "2", NULL, KEY_SPACE},
{6, "\xF0\x04\x68\x48\x12\xC6", "3", NULL, KEY_Z},
{6, "\xF0\x04\x68\x48\x02\xD6", "4", NULL, KEY_X},
{6, "\xF0\x04\x68\x48\x13\xC7", "5", NULL, KEY_LEFT},
{6, "\xF0\x04\x68\x48\x03\xD7", "6", NULL, KEY_RIGHT},

{6, "\xF0\x04\x68\x48\x10\xC4", "cd-prev", NULL, KEY_COMMA, cdchanger_handle_start},
{6, "\xF0\x04\x68\x48\x00\xD4", "cd-next", NULL, KEY_DOT, cdchanger_handle_start},
// steering wheel
{6, "\x50\x04\x68\x3B\x08\x0F", "cd-prev", NULL, KEY_COMMA, cdchanger_handle_start},
{6, "\x50\x04\x68\x3B\x01\x06", "cd-next", NULL, KEY_DOT, cdchanger_handle_start},

{4, "\x80\x06\xBF\x19", "coolant-temp", NULL, 0, ibus_handle_coolant_temp},
{4, "\x80\x09\xFF\x24", "fuel-consumption", NULL, 0, ibus_handle_fc},
{4, "\x80\x0A\xFF\x24", "outside-temp", NULL, 0, ibus_handle_outside_temp},
{4, "\x7F\x20\x3F\xA0", "battery-voltage", NULL, 0, ibus_handle_battery_voltage},
{5, "\x7F\x03\x3F\xA1\xE2", "re-battery-voltage", NULL, 0, ibus_request_battery_voltage2}, -->
