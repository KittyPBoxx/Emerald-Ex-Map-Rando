"use strict";function GameBoyAdvanceSerial(t){this.IOCore=t}GameBoyAdvanceSerial.prototype.initialize=function(){this.SIODATA_A=65535,this.SIODATA_B=65535,this.SIODATA_C=65535,this.SIODATA_D=65535,this.SIOShiftClockExternal=0,this.SIOShiftClockDivider=64,this.SIOCNT0_DATA=12,this.SIOTransferStarted=!1,this.SIOMULT_PLAYER_NUMBER=0,this.SIOCOMMERROR=!1,this.SIOBaudRate=0,this.SIOCNT_UART_CTS=!1,this.SIOCNT_UART_MISC=0,this.SIOCNT_UART_FIFO=0,this.SIOCNT_IRQ=0,this.SIOCNT_MODE=0,this.SIOCNT_UART_RECV_ENABLE=!1,this.SIOCNT_UART_SEND_ENABLE=!1,this.SIOCNT_UART_PARITY_ENABLE=!1,this.SIOCNT_UART_FIFO_ENABLE=!1,this.SIODATA8=65535,this.RCNTMode=0,this.RCNTIRQ=!1,this.RCNTDataBits=0,this.RCNTDataBitFlow=0,this.JOYBUS_IRQ=0,this.JOYBUS_CNTL_FLAGS=0,this.JOYBUS_RECV0=255,this.JOYBUS_RECV1=255,this.JOYBUS_RECV2=255,this.JOYBUS_RECV3=255,this.JOYBUS_SEND0=255,this.JOYBUS_SEND1=255,this.JOYBUS_SEND2=255,this.JOYBUS_SEND3=255,this.JOYBUS_STAT=0,this.shiftClocks=0,this.serialBitsShifted=0},GameBoyAdvanceSerial.prototype.SIOMultiplayerBaudRate=[9600,38400,57600,115200],GameBoyAdvanceSerial.prototype.addClocks=function(t){if(t|=0,(0|this.RCNTMode)<2)switch(0|this.SIOCNT_MODE){case 0:case 1:if(this.SIOTransferStarted&&0==(0|this.SIOShiftClockExternal))for(this.shiftClocks=(0|this.shiftClocks)+(0|t)|0;(0|this.shiftClocks)>=(0|this.SIOShiftClockDivider);)this.shiftClocks=(0|this.shiftClocks)-(0|this.SIOShiftClockDivider)|0,this.clockSerial();break;case 2:if(this.SIOTransferStarted&&0==(0|this.SIOMULT_PLAYER_NUMBER))for(this.shiftClocks=(0|this.shiftClocks)+(0|t)|0;(0|this.shiftClocks)>=(0|this.SIOShiftClockDivider);)this.shiftClocks=(0|this.shiftClocks)-(0|this.SIOShiftClockDivider)|0,this.clockMultiplayer();break;case 3:if(this.SIOCNT_UART_SEND_ENABLE&&!this.SIOCNT_UART_CTS)for(this.shiftClocks=(0|this.shiftClocks)+(0|t)|0;(0|this.shiftClocks)>=(0|this.SIOShiftClockDivider);)this.shiftClocks=(0|this.shiftClocks)-(0|this.SIOShiftClockDivider)|0,this.clockUART()}},GameBoyAdvanceSerial.prototype.clockSerial=function(){this.serialBitsShifted=1+(0|this.serialBitsShifted)|0,0==(0|this.SIOCNT_MODE)?(this.SIODATA8=65535&(this.SIODATA8<<1|1),8==(0|this.serialBitsShifted)&&(this.SIOTransferStarted=!1,this.serialBitsShifted=0,this.SIOCNT_IRQ)):(this.SIODATA_D=this.SIODATA_D<<1&254|this.SIODATA_C>>7,this.SIODATA_C=this.SIODATA_C<<1&254|this.SIODATA_B>>7,this.SIODATA_B=this.SIODATA_B<<1&254|this.SIODATA_A>>7,this.SIODATA_A=this.SIODATA_A<<1&254|1,32==(0|this.serialBitsShifted)&&(this.SIOTransferStarted=!1,this.serialBitsShifted=0,this.SIOCNT_IRQ))},GameBoyAdvanceSerial.prototype.clockMultiplayer=function(){this.SIODATA_A=0|this.SIODATA8,this.SIODATA_B=65535,this.SIODATA_C=65535,this.SIODATA_D=65535,this.SIOTransferStarted=!1,this.SIOCOMMERROR=!0,this.SIOCNT_IRQ},GameBoyAdvanceSerial.prototype.clockUART=function(){this.serialBitsShifted=1+(0|this.serialBitsShifted)|0,this.SIOCNT_UART_FIFO_ENABLE?8==(0|this.serialBitsShifted)&&(this.serialBitsShifted=0,this.SIOCNT_UART_FIFO=0|Math.max((0|this.SIOCNT_UART_FIFO)-1|0,0),0==(0|this.SIOCNT_UART_FIFO)&&this.SIOCNT_IRQ):8==(0|this.serialBitsShifted)&&(this.serialBitsShifted=0,this.SIOCNT_IRQ)},GameBoyAdvanceSerial.prototype.writeSIODATA_A0=function(t){t|=0,this.SIODATA_A=65280&this.SIODATA_A|t},GameBoyAdvanceSerial.prototype.readSIODATA_A0=function(){return 255&this.SIODATA_A},GameBoyAdvanceSerial.prototype.writeSIODATA_A1=function(t){t|=0,this.SIODATA_A=255&this.SIODATA_A|t<<8},GameBoyAdvanceSerial.prototype.readSIODATA_A1=function(){return this.SIODATA_A>>8},GameBoyAdvanceSerial.prototype.writeSIODATA_B0=function(t){t|=0,this.SIODATA_B=65280&this.SIODATA_B|t},GameBoyAdvanceSerial.prototype.readSIODATA_B0=function(){return 255&this.SIODATA_B},GameBoyAdvanceSerial.prototype.writeSIODATA_B1=function(t){t|=0,this.SIODATA_B=255&this.SIODATA_B|t<<8},GameBoyAdvanceSerial.prototype.readSIODATA_B1=function(){return this.SIODATA_B>>8},GameBoyAdvanceSerial.prototype.writeSIODATA_C0=function(t){t|=0,this.SIODATA_C=65280&this.SIODATA_C|t},GameBoyAdvanceSerial.prototype.readSIODATA_C0=function(){return 255&this.SIODATA_C},GameBoyAdvanceSerial.prototype.writeSIODATA_C1=function(t){t|=0,this.SIODATA_C=255&this.SIODATA_C|t<<8},GameBoyAdvanceSerial.prototype.readSIODATA_C1=function(){return this.SIODATA_C>>8},GameBoyAdvanceSerial.prototype.writeSIODATA_D0=function(t){t|=0,this.SIODATA_D=65280&this.SIODATA_D|t},GameBoyAdvanceSerial.prototype.readSIODATA_D0=function(){return 255&this.SIODATA_D},GameBoyAdvanceSerial.prototype.writeSIODATA_D1=function(t){t|=0,this.SIODATA_D=255&this.SIODATA_D|t<<8},GameBoyAdvanceSerial.prototype.readSIODATA_D1=function(){return this.SIODATA_D>>8},GameBoyAdvanceSerial.prototype.writeSIOCNT0=function(t){if((0|this.RCNTMode)<2)switch(0|this.SIOCNT_MODE){case 0:case 1:this.SIOShiftClockExternal=1&t,this.SIOShiftClockDivider=0!=(2&t)?8:64,this.SIOCNT0_DATA=11&t,0!=(128&t)?this.SIOTransferStarted||(this.SIOTransferStarted=!0,this.serialBitsShifted=0,this.shiftClocks=0):this.SIOTransferStarted=!1;break;case 2:this.SIOBaudRate=3&t,this.SIOShiftClockDivider=0|this.SIOMultiplayerBaudRate[0|this.SIOBaudRate],this.SIOMULT_PLAYER_NUMBER=t>>4&3,this.SIOCOMMERROR=0!=(64&t),0!=(128&t)?this.SIOTransferStarted||(this.SIOTransferStarted=!0,0==(0|this.SIOMULT_PLAYER_NUMBER)&&(this.SIODATA_A=65535,this.SIODATA_B=65535,this.SIODATA_C=65535,this.SIODATA_D=65535),this.serialBitsShifted=0,this.shiftClocks=0):this.SIOTransferStarted=!1;break;case 3:this.SIOBaudRate=3&t,this.SIOShiftClockDivider=0|this.SIOMultiplayerBaudRate[0|this.SIOBaudRate],this.SIOCNT_UART_MISC=(207&t)>>2,this.SIOCNT_UART_CTS=0!=(4&t)}},GameBoyAdvanceSerial.prototype.readSIOCNT0=function(){if(this.RCNTMode<2)switch(this.SIOCNT_MODE){case 0:case 1:return 116|(this.SIOTransferStarted?128:0)|this.SIOCNT0_DATA;case 2:return(this.SIOTransferStarted?128:0)|(this.SIOCOMMERROR?64:0)|this.SIOMULT_PLAYER_NUMBER<<4|this.SIOBaudRate;case 3:return this.SIOCNT_UART_MISC<<2|(4==this.SIOCNT_UART_FIFO?48:32)|this.SIOBaudRate}return 255},GameBoyAdvanceSerial.prototype.writeSIOCNT1=function(t){this.SIOCNT_IRQ=64&t,this.SIOCNT_MODE=t>>4&3,this.SIOCNT_UART_RECV_ENABLE=0!=(8&t),this.SIOCNT_UART_SEND_ENABLE=0!=(4&t),this.SIOCNT_UART_PARITY_ENABLE=0!=(2&t),this.SIOCNT_UART_FIFO_ENABLE=0!=(1&t)},GameBoyAdvanceSerial.prototype.readSIOCNT1=function(){return 128|this.SIOCNT_IRQ|this.SIOCNT_MODE<<4|(this.SIOCNT_UART_RECV_ENABLE?8:0)|(this.SIOCNT_UART_SEND_ENABLE?4:0)|(this.SIOCNT_UART_PARITY_ENABLE?2:0)|(this.SIOCNT_UART_FIFO_ENABLE?2:0)},GameBoyAdvanceSerial.prototype.writeSIODATA8_0=function(t){t|=0,this.SIODATA8=65280&this.SIODATA8|t,(0|this.RCNTMode)<2&&3==(0|this.SIOCNT_MODE)&&this.SIOCNT_UART_FIFO_ENABLE&&(this.SIOCNT_UART_FIFO=0|Math.min(1+(0|this.SIOCNT_UART_FIFO)|0,4))},GameBoyAdvanceSerial.prototype.readSIODATA8_0=function(){return 255&this.SIODATA8},GameBoyAdvanceSerial.prototype.writeSIODATA8_1=function(t){t|=0,this.SIODATA8=255&this.SIODATA8|t<<8},GameBoyAdvanceSerial.prototype.readSIODATA8_1=function(){return this.SIODATA8>>8},GameBoyAdvanceSerial.prototype.writeRCNT0=function(t){if(2==(0|this.RCNTMode)){this.RCNTDataBits;this.RCNTDataBits=15&t,this.RCNTDataBitFlow=t>>4,this.RCNTIRQ&&this.RCNTDataBits}},GameBoyAdvanceSerial.prototype.readRCNT0=function(){return this.RCNTDataBitFlow<<4|this.RCNTDataBits},GameBoyAdvanceSerial.prototype.writeRCNT1=function(t){this.RCNTMode=t>>6,this.RCNTIRQ=0!=(1&t),2!=(0|this.RCNTMode)&&(this.RCNTDataBits=0,this.RCNTDataBitFlow=0)},GameBoyAdvanceSerial.prototype.readRCNT1=function(){return this.RCNTMode<<6|(this.RCNTIRQ?63:62)},GameBoyAdvanceSerial.prototype.writeJOYCNT=function(t){this.JOYBUS_IRQ=t<<25>>31,this.JOYBUS_CNTL_FLAGS&=~(7&t)},GameBoyAdvanceSerial.prototype.readJOYCNT=function(){return 64|this.JOYBUS_CNTL_FLAGS|184&this.JOYBUS_IRQ},GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV0=function(t){this.JOYBUS_RECV0=0|t},GameBoyAdvanceSerial.prototype.readJOYBUS_RECV0=function(){return this.JOYBUS_STAT=247&this.JOYBUS_STAT,0|this.JOYBUS_RECV0},GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV1=function(t){this.JOYBUS_RECV1=0|t},GameBoyAdvanceSerial.prototype.readJOYBUS_RECV1=function(){return this.JOYBUS_STAT=247&this.JOYBUS_STAT,0|this.JOYBUS_RECV1},GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV2=function(t){this.JOYBUS_RECV2=0|t},GameBoyAdvanceSerial.prototype.readJOYBUS_RECV2=function(){return this.JOYBUS_STAT=247&this.JOYBUS_STAT,0|this.JOYBUS_RECV2},GameBoyAdvanceSerial.prototype.writeJOYBUS_RECV3=function(t){this.JOYBUS_RECV3=0|t},GameBoyAdvanceSerial.prototype.readJOYBUS_RECV3=function(){return this.JOYBUS_STAT=247&this.JOYBUS_STAT,0|this.JOYBUS_RECV3},GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND0=function(t){this.JOYBUS_SEND0=0|t,this.JOYBUS_STAT=2|this.JOYBUS_STAT},GameBoyAdvanceSerial.prototype.readJOYBUS_SEND0=function(){return 0|this.JOYBUS_SEND0},GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND1=function(t){this.JOYBUS_SEND1=0|t,this.JOYBUS_STAT=2|this.JOYBUS_STAT},GameBoyAdvanceSerial.prototype.readJOYBUS_SEND1=function(){return 0|this.JOYBUS_SEND1},GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND2=function(t){this.JOYBUS_SEND2=0|t,this.JOYBUS_STAT=2|this.JOYBUS_STAT},GameBoyAdvanceSerial.prototype.readJOYBUS_SEND2=function(){return 0|this.JOYBUS_SEND2},GameBoyAdvanceSerial.prototype.writeJOYBUS_SEND3=function(t){this.JOYBUS_SEND3=0|t,this.JOYBUS_STAT=2|this.JOYBUS_STAT},GameBoyAdvanceSerial.prototype.readJOYBUS_SEND3=function(){return 0|this.JOYBUS_SEND3},GameBoyAdvanceSerial.prototype.writeJOYBUS_STAT=function(t){this.JOYBUS_STAT=0|t},GameBoyAdvanceSerial.prototype.readJOYBUS_STAT=function(){return 197|this.JOYBUS_STAT};
//# sourceMappingURL=build-index.7e582ca2.js.map