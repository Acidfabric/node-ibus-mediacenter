/* eslint-disable @typescript-eslint/no-unused-vars */
// This is to signal wake state for my TJA2010
import { Gpio } from 'onoff';

const GPIO_NSLP_CTL = 22;
const GPIO_PIN17_CTL = 23;
const GPIO_LED_CTL = 24;
const GPIO_RELAY_CTL = 27;

const gpioCtrl = new Gpio(22, 'out');

// send wake signal HIGH to pin 22
gpioCtrl.write(1);
