"use strict";function GlueCodeMixer(t){var e=this;this.audio=new XAudioServer(2,this.sampleRate,0,this.bufferAmount,null,(function(){e.checkHeartbeats()}),(function(){e.checkPostHeartbeats()}),1,(function(){e.disableAudio()}),t),this.outputUnits=[],this.outputUnitsValid=[],this.initializeBuffer()}function GlueCodeMixerInput(t){this.mixer=t,this.volume=1}function AudioBufferWrapper(t,e,i,r,u){this.channelCount=t,this.mixerChannelCount=e,this.bufferAmount=i,this.sampleRate=r,this.mixerSampleRate=u,this.initialize()}function AudioSimpleBuffer(t,e){this.channelCount=t,this.bufferAmount=e,this.outBufferSize=this.channelCount*this.bufferAmount,this.stackLength=0,this.buffer=getFloat32Array(this.outBufferSize)}GlueCodeMixer.prototype.sampleRate=44100,GlueCodeMixer.prototype.bufferAmount=44100,GlueCodeMixer.prototype.channelCount=2,GlueCodeMixer.prototype.initializeBuffer=function(){this.buffer=new AudioSimpleBuffer(this.channelCount,this.bufferAmount)},GlueCodeMixer.prototype.appendInput=function(t){if(this.audio){for(var e=0;e<this.outputUnits.length&&this.outputUnits[e];e++);this.outputUnits[e]=t,this.outputUnitsValid.push(t),t.registerStackPosition(e)}else"function"==typeof t.errorCallback&&t.errorCallback()},GlueCodeMixer.prototype.unregister=function(t){this.outputUnits[t]=null,this.outputUnitsValid=[];for(var e=0,i=this.outputUnits.length;e<i;++e)this.outputUnits[e]&&this.outputUnitsValid.push(this.outputUnits)},GlueCodeMixer.prototype.checkHeartbeats=function(){for(var t=this.outputUnitsValid.length,e=0;e<t;++e)this.outputUnitsValid[e].heartBeatCallback()},GlueCodeMixer.prototype.checkPostHeartbeats=function(){for(var t=this.outputUnitsValid.length,e=0;e<t;++e)this.outputUnitsValid[e].postHeartBeatCallback()},GlueCodeMixer.prototype.checkAudio=function(){if(this.audio){for(var t=this.outputUnitsValid.length,e=0,i=0;e<t;++e)this.outputUnitsValid[e].prepareShift();for(var r=0,u=this.findLowestBufferCount();r<u;++r){for(e=0,i=0;e<t;++e)i+=this.outputUnitsValid[e].shift();this.buffer.push(i)}var f=this.buffer.count();this.audio.writeAudioNoCallback(this.buffer.buffer,f),this.buffer.reset()}},GlueCodeMixer.prototype.findLowestBufferCount=function(){for(var t=0,e=0,i=this.outputUnitsValid.length;e<i;++e){var r=this.outputUnitsValid[e].buffer.resampledSamplesLeft();r>0&&(t=t>0?Math.min(t,r):r)}return Math.min(t,this.channelCount*this.bufferAmount)},GlueCodeMixer.prototype.disableAudio=function(){this.audio=null},GlueCodeMixerInput.prototype.initialize=function(t,e,i,r,u,f){this.channelCount=t,this.sampleRate=e,this.bufferAmount=i,this.heartBeatCallback=r,this.postHeartBeatCallback=u,this.errorCallback=f;var s=this.buffer;this.buffer=new AudioBufferWrapper(this.channelCount,this.mixer.channelCount,this.bufferAmount,this.sampleRate,this.mixer.sampleRate),s&&this.buffer.copyOld(s)},GlueCodeMixerInput.prototype.register=function(){this.mixer.appendInput(this)},GlueCodeMixerInput.prototype.setVolume=function(t){this.volume=Math.min(Math.max(t,0),1)},GlueCodeMixerInput.prototype.prepareShift=function(){this.buffer.resampleRefill()},GlueCodeMixerInput.prototype.shift=function(){return this.buffer.shift()*this.volume},GlueCodeMixerInput.prototype.push=function(t,e,i){this.buffer.push(t,e,i),this.mixer.checkAudio()},GlueCodeMixerInput.prototype.pushDeferred=function(t,e,i){this.buffer.push(t,e,i)},GlueCodeMixerInput.prototype.flush=function(){this.mixer.checkAudio()},GlueCodeMixerInput.prototype.remainingBuffer=function(){return this.buffer.remainingBuffer()+Math.floor(this.mixer.audio.remainingBuffer()*this.sampleRate/this.mixer.sampleRate/this.mixer.channelCount)*this.mixer.channelCount},GlueCodeMixerInput.prototype.registerStackPosition=function(t){this.stackPosition=t},GlueCodeMixerInput.prototype.unregister=function(){this.mixer.unregister(this.stackPosition)},GlueCodeMixerInput.prototype.setBufferSpace=function(t){this.buffer.setBufferSpace(t)},AudioBufferWrapper.prototype.initialize=function(){this.inBufferSize=this.bufferAmount*this.mixerChannelCount,this.inBuffer=getFloat32Array(this.inBufferSize),this.resampler=new Resampler(this.sampleRate,this.mixerSampleRate,this.mixerChannelCount,this.inBuffer),this.outBufferSize=this.resampler.outputBuffer.length,this.outBuffer=getFloat32Array(this.outBufferSize),this.inputOffset=0,this.resampleBufferStart=0,this.resampleBufferEnd=0},AudioBufferWrapper.prototype.copyOld=function(t){for(this.resampleRefill();t.resampleBufferStart!=t.resampleBufferEnd;)this.outBuffer[this.resampleBufferEnd++]=t.outBuffer[t.resampleBufferStart++],this.resampleBufferEnd==this.outBufferSize&&(this.resampleBufferEnd=0),this.resampleBufferStart==this.resampleBufferEnd&&(this.resampleBufferStart+=this.mixerChannelCount,this.resampleBufferStart==this.outBufferSize&&(this.resampleBufferStart=0)),t.resampleBufferStart==t.outBufferSize&&(t.resampleBufferStart=0)},AudioBufferWrapper.prototype.push=function(t,e,i){var r=Math.min(t.length,i);if(this.channelCount<this.mixerChannelCount)for(;e<r&&this.inputOffset<this.inBufferSize;){for(var u=this.channelCount;u<this.mixerChannelCount;++u)this.inBuffer[this.inputOffset++]=t[e];for(u=0;u<this.channelCount&&e<r;++u)this.inBuffer[this.inputOffset++]=t[e++]}else if(this.channelCount==this.mixerChannelCount)for(;e<r&&this.inputOffset<this.inBufferSize;)this.inBuffer[this.inputOffset++]=t[e++];else for(;e<r&&this.inputOffset<this.inBufferSize;){for(u=0;u<this.mixerChannelCount&&e<r;++u)this.inBuffer[this.inputOffset++]=t[e++];e+=this.channelCount-this.mixerChannelCount}},AudioBufferWrapper.prototype.shift=function(){var t=0;return this.resampleBufferStart!=this.resampleBufferEnd&&(t=this.outBuffer[this.resampleBufferStart++],this.resampleBufferStart==this.outBufferSize&&(this.resampleBufferStart=0)),t},AudioBufferWrapper.prototype.resampleRefill=function(){if(this.inputOffset>0){for(var t=this.resampler.resampler(this.inputOffset),e=this.resampler.outputBuffer,i=0;i<t;)this.outBuffer[this.resampleBufferEnd++]=e[i++],this.resampleBufferEnd==this.outBufferSize&&(this.resampleBufferEnd=0),this.resampleBufferStart==this.resampleBufferEnd&&(this.resampleBufferStart+=this.mixerChannelCount,this.resampleBufferStart==this.outBufferSize&&(this.resampleBufferStart=0));this.inputOffset=0}},AudioBufferWrapper.prototype.setBufferSpace=function(t){for(;this.inputOffset<t&&this.inputOffset<this.inBufferSize;)this.inBuffer[this.inputOffset++]=0},AudioBufferWrapper.prototype.remainingBuffer=function(){return Math.floor(this.resampledSamplesLeft()*this.resampler.ratioWeight/this.mixerChannelCount)*this.mixerChannelCount+this.inputOffset},AudioBufferWrapper.prototype.resampledSamplesLeft=function(){return(this.resampleBufferStart<=this.resampleBufferEnd?0:this.outBufferSize)+this.resampleBufferEnd-this.resampleBufferStart},AudioSimpleBuffer.prototype.push=function(t){this.stackLength<this.outBufferSize&&(this.buffer[this.stackLength++]=t)},AudioSimpleBuffer.prototype.count=function(){return this.stackLength},AudioSimpleBuffer.prototype.reset=function(){this.stackLength=0};
//# sourceMappingURL=build-index.1ede5006.js.map
