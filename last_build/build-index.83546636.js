"use strict";function GameBoyAdvanceChannel4Synth(e){this.sound=e,this.currentSampleLeft=0,this.currentSampleRight=0,this.totalLength=64,this.envelopeVolume=0,this.FrequencyPeriod=32,this.lastSampleLookup=0,this.BitRange=32767,this.VolumeShifter=15,this.currentVolume=0,this.consecutive=!0,this.envelopeSweeps=0,this.envelopeSweepsLast=-1,this.canPlay=!1,this.Enabled=0,this.counter=0,this.leftEnable=0,this.rightEnable=0,this.nr42=0,this.nr43=0,this.nr44=0,this.cachedSample=0,this.intializeWhiteNoise(),this.noiseSampleTable=this.LSFR15Table}GameBoyAdvanceChannel4Synth.prototype.intializeWhiteNoise=function(){var e=1;this.LSFR15Table=getInt8Array(524288);for(var t=32767,h=16383,n=0;n<32768;++n)e=1-(1&t),this.LSFR15Table[32768|n]=e,this.LSFR15Table[65536|n]=2*e,this.LSFR15Table[98304|n]=3*e,this.LSFR15Table[131072|n]=4*e,this.LSFR15Table[163840|n]=5*e,this.LSFR15Table[196608|n]=6*e,this.LSFR15Table[229376|n]=7*e,this.LSFR15Table[262144|n]=8*e,this.LSFR15Table[294912|n]=9*e,this.LSFR15Table[327680|n]=10*e,this.LSFR15Table[360448|n]=11*e,this.LSFR15Table[393216|n]=12*e,this.LSFR15Table[425984|n]=13*e,this.LSFR15Table[458752|n]=14*e,this.LSFR15Table[491520|n]=15*e,t=(h=t>>1)|(1&(h^t))<<14;for(this.LSFR7Table=getInt8Array(2048),t=127,n=0;n<128;++n)e=1-(1&t),this.LSFR7Table[128|n]=e,this.LSFR7Table[256|n]=2*e,this.LSFR7Table[384|n]=3*e,this.LSFR7Table[512|n]=4*e,this.LSFR7Table[640|n]=5*e,this.LSFR7Table[768|n]=6*e,this.LSFR7Table[896|n]=7*e,this.LSFR7Table[1024|n]=8*e,this.LSFR7Table[1152|n]=9*e,this.LSFR7Table[1280|n]=10*e,this.LSFR7Table[1408|n]=11*e,this.LSFR7Table[1536|n]=12*e,this.LSFR7Table[1664|n]=13*e,this.LSFR7Table[1792|n]=14*e,this.LSFR7Table[1920|n]=15*e,t=(h=t>>1)|(1&(h^t))<<6},GameBoyAdvanceChannel4Synth.prototype.disabled=function(){this.totalLength=64,this.nr42=0,this.envelopeVolume=0,this.nr43=0,this.FrequencyPeriod=32,this.lastSampleLookup=0,this.BitRange=32767,this.VolumeShifter=15,this.currentVolume=0,this.noiseSampleTable=this.LSFR15Table,this.nr44=0,this.consecutive=!0,this.envelopeSweeps=0,this.envelopeSweepsLast=-1,this.canPlay=!1,this.Enabled=0,this.counter=0},GameBoyAdvanceChannel4Synth.prototype.clockAudioLength=function(){(0|this.totalLength)>1?this.totalLength=(0|this.totalLength)-1|0:1==(0|this.totalLength)&&(this.totalLength=0,this.enableCheck(),this.sound.unsetNR52(247))},GameBoyAdvanceChannel4Synth.prototype.clockAudioEnvelope=function(){(0|this.envelopeSweepsLast)>-1&&((0|this.envelopeSweeps)>0?this.envelopeSweeps=(0|this.envelopeSweeps)-1|0:this.envelopeType?(0|this.envelopeVolume)<15?(this.envelopeVolume=1+(0|this.envelopeVolume)|0,this.currentVolume=(0|this.envelopeVolume)<<(0|this.VolumeShifter),this.envelopeSweeps=0|this.envelopeSweepsLast):this.envelopeSweepsLast=-1:(0|this.envelopeVolume)>0?(this.envelopeVolume=(0|this.envelopeVolume)-1|0,this.currentVolume=(0|this.envelopeVolume)<<(0|this.VolumeShifter),this.envelopeSweeps=0|this.envelopeSweepsLast):this.envelopeSweepsLast=-1)},GameBoyAdvanceChannel4Synth.prototype.computeAudioChannel=function(){0==(0|this.counter)&&(this.lastSampleLookup=1+(0|this.lastSampleLookup)&this.BitRange,this.counter=0|this.FrequencyPeriod)},GameBoyAdvanceChannel4Synth.prototype.enableCheck=function(){(this.consecutive||(0|this.totalLength)>0)&&this.canPlay?this.Enabled=15:this.Enabled=0},GameBoyAdvanceChannel4Synth.prototype.volumeEnableCheck=function(){this.canPlay=(0|this.nr42)>7,this.enableCheck()},GameBoyAdvanceChannel4Synth.prototype.outputLevelCache=function(){var e=this.cachedSample&this.Enabled;this.currentSampleLeft=this.leftEnable&e,this.currentSampleRight=this.rightEnable&e},GameBoyAdvanceChannel4Synth.prototype.setChannelOutputEnable=function(e){e|=0,this.rightEnable=e<<28>>31,this.leftEnable=e<<24>>31},GameBoyAdvanceChannel4Synth.prototype.updateCache=function(){this.cachedSample=0|this.noiseSampleTable[this.currentVolume|this.lastSampleLookup],this.outputLevelCache()},GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_L0=function(e){e|=0,this.totalLength=64-(63&e)|0,this.enableCheck()},GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_L1=function(e){e|=0,this.envelopeType=0!=(8&e),this.nr42=255&e,this.volumeEnableCheck()},GameBoyAdvanceChannel4Synth.prototype.readSOUND4CNT_L=function(){return 0|this.nr42},GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_H0=function(e){e|=0,this.FrequencyPeriod=Math.max((7&e)<<4,8)<<(2+(e>>4&15)|0);var t=8&e;(8==(0|t)&&32767==(0|this.BitRange)||0==(0|t)&&127==(0|this.BitRange))&&(this.lastSampleLookup=0,this.BitRange=8==(0|t)?127:32767,this.VolumeShifter=8==(0|t)?7:15,this.currentVolume=this.envelopeVolume<<(0|this.VolumeShifter),this.noiseSampleTable=8==(0|t)?this.LSFR7Table:this.LSFR15Table),this.nr43=255&e},GameBoyAdvanceChannel4Synth.prototype.readSOUND4CNT_H0=function(){return 0|this.nr43},GameBoyAdvanceChannel4Synth.prototype.writeSOUND4CNT_H1=function(e){e|=0,this.nr44=255&e,this.consecutive=0==(64&e),0!=(128&e)&&(this.envelopeVolume=this.nr42>>4,this.currentVolume=this.envelopeVolume<<(0|this.VolumeShifter),this.envelopeSweepsLast=(7&this.nr42)-1|0,0==(0|this.totalLength)&&(this.totalLength=64),0!=(64&e)&&this.sound.setNR52(8)),this.enableCheck()},GameBoyAdvanceChannel4Synth.prototype.readSOUND4CNT_H1=function(){return 0|this.nr44};
//# sourceMappingURL=build-index.83546636.js.map
