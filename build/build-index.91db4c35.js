var isWarping=!1,randomWarpsEnabled=!0,needsPositioningAfterWarp=!1,fromEscalator=!1,mapHeaderChanged=!1;const EMERALD_CURRENT_BANK=33763044,EMERALD_CURRENT_MAP=33763045,EMERALD_CURRENT_WARP=33763046,X_VAL_POST_WARP=33711752,Y_VAL_POST_WARP=33711754;var flagManager;const SPEEDUP_HACKS_MODE={ON:2,BATTLE_ONLY:1,OFF:0};var speedupHackState=SPEEDUP_HACKS_MODE.ON;function setSpeedupHackState(e){e==SPEEDUP_HACKS_MODE.ON?(bypassWait=!0,speedupHackState=SPEEDUP_HACKS_MODE.ON):e==SPEEDUP_HACKS_MODE.BATTLE_ONLY?(bypassWait=!1,speedupHackState=SPEEDUP_HACKS_MODE.BATTLE_ONLY):e==SPEEDUP_HACKS_MODE.OFF&&(bypassWait=!1,speedupHackState=SPEEDUP_HACKS_MODE.OFF)}var disableWaitCount=0;async function disableBypassWait(){for(bypassWait=!1,disableWaitCount=Math.max(disableWaitCount+1,2);disableWaitCount>0;)await delay(500),disableWaitCount--;disableWaitCount=0,bypassWait=!0}var usingHomeWarp=!1;GameBoyAdvanceCPU.prototype.write32WithoutIntercept=GameBoyAdvanceCPU.prototype.write32,GameBoyAdvanceCPU.prototype.write32=function(e,t){if(33783576==e&&needsPositioningAfterWarp&&(mapHeaderChanged=!0),33786972==e&&speedupHackState==SPEEDUP_HACKS_MODE.ON?-1==t&&disableBypassWait():33685508==e?t=0:33706852==e&&speedupHackState==SPEEDUP_HACKS_MODE.BATTLE_ONLY&&(bypassWait=!0),usingHomeWarp&&33763044==e)return this.write8(33763044,0),this.write8(33763045,10),this.write8(33763046,5),needsPositioningAfterWarp=warpsNeedingPositionForces.get("E,0,10,5"),void(usingHomeWarp=!1);this.write32WithoutIntercept(e,t)},GameBoyAdvanceCPU.prototype.write16WithoutIntercept=GameBoyAdvanceCPU.prototype.write16,GameBoyAdvanceCPU.prototype.write16=function(e,t){if(needsPositioningAfterWarp&&mapHeaderChanged){if(33711752==e)return this.write16WithoutIntercept(e,needsPositioningAfterWarp[0]);if(33711754==e){console.log("finished warp setting position after");let t=needsPositioningAfterWarp[1];return needsPositioningAfterWarp=!1,mapHeaderChanged=!1,this.write16WithoutIntercept(e,t)}}else fromEscalator&&33711752==e&&(fromEscalator=!1,t-=1);this.write16WithoutIntercept(e,t)},GameBoyAdvanceCPU.prototype.write8WithoutIntercept=GameBoyAdvanceCPU.prototype.write8,GameBoyAdvanceCPU.prototype.write8=function(e,t){33763046==e?isWarping=randomWarpsEnabled||forceNextWarp:33705742==e&&0!=t&&speedupHackState==SPEEDUP_HACKS_MODE.BATTLE_ONLY&&(bypassWait=!1),this.write8WithoutIntercept(e,t)},GameBoyAdvanceCPU.prototype.read8WithoutIntercept=GameBoyAdvanceCPU.prototype.read8,GameBoyAdvanceCPU.prototype.read8=function(e){return isWarping?(33763044==e&&(e=this.handleWarpRedirection(e,IodineGUI.Iodine.IOCore.cartridge.romCode)),this.read8WithoutIntercept(e)):this.read8WithoutIntercept(e)};var reverseNextWarp=!1,forceNextWarp=null,useAutosaves=!1;async function saveSateAfterDelay(){await delay(200),IodineGUI.Iodine.saveStateManager.saveMultiState("LATEST")}GameBoyAdvanceCPU.prototype.handleWarpRedirection=function(e,t){let a=this.read8WithoutIntercept(e),i=this.read8WithoutIntercept(e+1),r=this.read8WithoutIntercept(e+2);if(255==r)return t+","+a+","+i+","+r=="E,8,1,255"&&(writeGameVar(16517,6),modifyBaseFlag(726,1),modifyBaseFlag(866,1)),e;let o=null,s=t+","+a+","+i+","+r;if(forceNextWarp){let e=forceNextWarp.split(",");o=new PKWarp(s,e[0],e[1],e[2],e[3],forceNextWarp),reverseNextWarp=!1,forceNextWarp=null}else if(reverseNextWarp&&warpList.get(s)){let e=warpList.get(s).source,t=e.split(",");o=new PKWarp(s,t[0],t[1],t[2],t[3],e),reverseNextWarp=!1}else o=warpList.get(s),console.log("Warping triggered for "+s);return o?(this.write8(33763044,o.toBank),this.write8(33763045,o.toMap),this.write8(33763046,o.toWarpNo),specialWarpHandling(o,s),console.log("Warping sending to "+o.toRomCode+","+o.toBank+","+o.toMap+","+o.toWarpNo)):console.log("Warping sending to vanilla"),useAutosaves&&saveSateAfterDelay(),isWarping=!1,e};var warpsNeedingPositionForces=new Map;warpsNeedingPositionForces.set("E,0,1,5",[30,27]),warpsNeedingPositionForces.set("E,0,5,0",[27,7]),warpsNeedingPositionForces.set("E,0,2,0",[8,6]),warpsNeedingPositionForces.set("E,0,7,5",[45,7]),warpsNeedingPositionForces.set("E,0,7,9",[53,29]),warpsNeedingPositionForces.set("E,0,7,4",[9,7]),warpsNeedingPositionForces.set("E,0,8,2",[18,42]),warpsNeedingPositionForces.set("E,0,11,3",[17,14]),warpsNeedingPositionForces.set("E,0,12,5",[9,2]),warpsNeedingPositionForces.set("E,0,14,4",[8,2]),warpsNeedingPositionForces.set("E,0,15,0",[8,16]),warpsNeedingPositionForces.set("E,0,26,0",[13,114]),warpsNeedingPositionForces.set("E,11,0,2",[14,2]),warpsNeedingPositionForces.set("E,14,9,2",[13,2]),warpsNeedingPositionForces.set("E,14,10,2",[13,2]),warpsNeedingPositionForces.set("E,16,10,2",[9,2]),warpsNeedingPositionForces.set("E,24,8,2",[29,13]),warpsNeedingPositionForces.set("E,24,8,3",[28,21]),warpsNeedingPositionForces.set("E,24,9,0",[29,13]),warpsNeedingPositionForces.set("E,24,9,1",[28,21]),warpsNeedingPositionForces.set("E,24,13,4",[16,19]),warpsNeedingPositionForces.set("E,24,16,4",[11,9]),warpsNeedingPositionForces.set("E,24,16,2",[10,12]),warpsNeedingPositionForces.set("E,24,17,5",[6,12]),warpsNeedingPositionForces.set("E,24,17,4",[10,12]),warpsNeedingPositionForces.set("E,24,18,2",[12,10]),warpsNeedingPositionForces.set("E,24,18,3",[12,12]),warpsNeedingPositionForces.set("E,24,19,3",[12,10]),warpsNeedingPositionForces.set("E,24,19,4",[12,12]),warpsNeedingPositionForces.set("E,24,24,10",[32,19]),warpsNeedingPositionForces.set("E,24,25,5",[5,8]),warpsNeedingPositionForces.set("E,24,25,9",[32,20]),warpsNeedingPositionForces.set("E,24,29,2",[6,1]),warpsNeedingPositionForces.set("E,24,78,0",[17,13]),warpsNeedingPositionForces.set("E,24,81,0",[3,1]),warpsNeedingPositionForces.set("E,24,82,1",[7,1]),warpsNeedingPositionForces.set("E,24,95,0",[18,12]),warpsNeedingPositionForces.set("E,24,96,0",[18,12]),warpsNeedingPositionForces.set("E,26,74,1",[5,5]),warpsNeedingPositionForces.set("E,26,87,0",[14,19]),warpsNeedingPositionForces.set("E,0,10,5",[10,9]),warpsNeedingPositionForces.set("E,11,2,0",[2,2]);var escalatorTriggers=new Set;function specialWarpHandling(e,t){let a=e.toRomCode+","+e.toBank+","+e.toMap+","+e.toWarpNo;if("E,8,1,0"==a){writeGameVar(16517,readGameVar(16501)<2?0:6),writeGameVar(16471,1)}else"E,16,0,0"==a?writeGameVar(16540,0):"E,16,0,1"==a||"E,16,1,0"==a?writeGameVar(16540,1):"E,16,1,1"==a||"E,16,2,0"==a?writeGameVar(16540,2):"E,16,2,1"==a||"E,16,3,0"==a?writeGameVar(16540,3):"E,16,3,1"==a?writeGameVar(16540,4):"E,10,0,0"==a?(new FlagManager).setFlag(IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR),4720,913,0):"E,29,1,0"==a||"E,29,1,1"==a?readGameVar("E",16452)>7&&writeGameVar("E",16452,7):warpsNeedingPositionForces.get(a)?(needsPositioningAfterWarp=warpsNeedingPositionForces.get(a),escalatorTriggers.has(t)&&needsPositioningAfterWarp[0]--):escalatorTriggers.has(t)&&(fromEscalator=!0);let i=new BagStoreage;i.readData(),new FlagManager(i).writeFlags()}escalatorTriggers.add("E,8,5,0"),escalatorTriggers.add("E,9,12,0"),escalatorTriggers.add("E,10,6,0"),escalatorTriggers.add("E,11,6,0"),escalatorTriggers.add("E,12,3,0"),escalatorTriggers.add("E,13,7,0"),escalatorTriggers.add("E,14,4,0"),escalatorTriggers.add("E,15,3,0"),escalatorTriggers.add("E,16,13,0"),escalatorTriggers.add("E,16,14,0"),escalatorTriggers.add("E,2,3,0"),escalatorTriggers.add("E,3,2,0"),escalatorTriggers.add("E,4,6,0"),escalatorTriggers.add("E,5,5,0"),escalatorTriggers.add("E,6,5,0"),escalatorTriggers.add("E,7,1,0");const MAP_TYPE_ADDRESS=33783599,MAP_TYPES={NONE:0,TOWN:1,CITY:2,ROUTE:3,UNDERGROUND:4,UNDERWATER:5,OCEAN_ROUTE:6,UNKNOWN:7,INDOOR:8,SECRET_BASE:9};function isMapOutside(){let e=IodineGUI.Iodine.IOCore.cpu.read8(33783599);return e==MAP_TYPES.NONE||e==MAP_TYPES.TOWN||e==MAP_TYPES.CITY||e==MAP_TYPES.ROUTE||e==MAP_TYPES.UNDERWATER||e==MAP_TYPES.OCEAN_ROUTE}GameBoyAdvanceMultiCartridge.prototype.readROM16WithoutIntercept=GameBoyAdvanceMultiCartridge.prototype.readROM16,GameBoyAdvanceMultiCartridge.prototype.readROM16=function(e){return 761720==e&&(console.log("Destination to escape warp"),isMapOutside()&&(usingHomeWarp=!0)),this.readROM16WithoutIntercept(e)};var currentlySaving=!1;async function saveAfterDelay(){await delay(200),IodineGUI.Iodine.exportSave()}GameBoyAdvanceMultiCartridge.prototype.readROM8WithoutIntercept=GameBoyAdvanceMultiCartridge.prototype.readROM8,GameBoyAdvanceMultiCartridge.prototype.readROM8=function(e){return currentlySaving&&(3084361!=e&&8455992!=e||(console.log("saved"),saveAfterDelay(),currentlySaving=!1)),this.readROM8WithoutIntercept(e)},GameBoyAdvanceSaves.prototype.saveIntercept=function(e,t){0==e&&48==t&&(currentlySaving=!0)};const EMERALD_SAVE_1_PTR=50351276,EMERALD_SAVE_2_PTR=50351280,EMERALD_XOR_KEY_OFFSET=172,EMERALD_XOR_KEY_LENGTH=4,EMERALD_ITEM_OFFSET=1376,EMERALD_ITEM_LENGTH=120,EMERALD_KEY_ITEM_OFFSET=1496,EMERALD_KEY_ITEM_LENGTH=120,EMERALD_BALL_OFFSET=1616,EMERALD_BALL_LENGTH=64,EMERALD_TM_OFFSET=1680,EMERALD_TM_LENGTH=256,EMERALD_BERRIES_OFFSET=1936,EMERALD_BERRIES_LENGTH=184;function BagStoreage(){this.itemPocket=new Map,this.keyItemsPocket=new Map,this.ballItemPocket=new Map,this.tmCase=new Map,this.berryPocket=new Map}BagStoreage.prototype.readData=function(){this.itemPocket.clear(),this.keyItemsPocket.clear(),this.ballItemPocket.clear(),this.tmCase.clear(),this.berryPocket.clear();let e=IodineGUI.Iodine.IOCore.cpu.read32(50351280),t=IodineGUI.Iodine.IOCore.cpu.read16(e+172),a=IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR);this.readItemSection(a,1376,120,this.itemPocket,t),this.readItemSection(a,1496,120,this.keyItemsPocket,t),this.readItemSection(a,1616,64,this.ballItemPocket,t),this.readItemSection(a,1680,256,this.tmCase,t),this.readItemSection(a,1936,184,this.berryPocket,t)},BagStoreage.prototype.writeData=function(e){let t=IodineGUI.Iodine.IOCore.cpu.read32(50351280),a=IodineGUI.Iodine.IOCore.cpu.read16(t+172),i=IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR);this.writeItemSection(i,1376,120,this.itemPocket,a,e),this.writeItemSection(i,1496,120,this.keyItemsPocket,a,!1),this.writeItemSection(i,1616,64,this.ballItemPocket,a,e),this.writeItemSection(i,1680,256,this.tmCase,a,e),this.writeItemSection(i,1936,184,this.berryPocket,a,e)},BagStoreage.prototype.readItemSection=function(e,t,a,i,r){for(let o=0;o<t+a;o+=4){let a=IodineGUI.Iodine.IOCore.cpu.read16(e+t+o);if(0==a)break;let s=IodineGUI.Iodine.IOCore.cpu.read16(e+t+o+2)^r;i.set(a,s)}},BagStoreage.prototype.writeItemSection=function(e,t,a,i,r,o){var s=[...i];for(let i=0;i<t+a;i+=4){if(s.length>i/4){let a=s[i/4][0],o=s[i/4][1]^r;IodineGUI.Iodine.IOCore.cpu.write16(e+t+i,a),IodineGUI.Iodine.IOCore.cpu.write16(e+t+i+2,o)}else{if(!o)break;{let a=ITEM_DATA.Nothing.number,o=0^r;IodineGUI.Iodine.IOCore.cpu.write16(e+t+i,a),IodineGUI.Iodine.IOCore.cpu.write16(e+t+i+2,o)}}}},BagStoreage.prototype.hasKeyItem=function(e){return this.keyItemsPocket.has(e)};const EMERALD_BASE_FLAGS_OFFSET=4720,EMERALD_SYS_FLAGS_OFFSET=4988,EMERALD_BADGE1_OFFSET=7,EMERALD_BADGE2_OFFSET=8,EMERALD_BADGE3_OFFSET=9,EMERALD_BADGE4_OFFSET=10,EMERALD_BADGE5_OFFSET=11,EMERALD_BADGE6_OFFSET=12,EMERALD_BADGE7_OFFSET=13,EMERALD_BADGE8_OFFSET=14,EMERALD_RUNNING_SHOE_OFFSET=96,EMERALD_POKEDEX_OFFSET=1,EMERALD_NATIONAL_DEX_OFFSET=54,EMERALD_BADGE_OFFSETS=[7,8,9,10,11,12,13,14],EMERALD_BASE_VAR_OFFSET=5020,EMERALD_STARTER_CHOICE_OFFSET=16419;function FlagManager(e){this.badge1=null,this.badge2=null,this.badge3=null,this.badge4=null,this.badge5=null,this.badge6=null,this.badge7=null,this.badge8=null,this.hasRunningShoes=null,this.bag=e}function modifyBadge(e,t){modifySystemFlag(EMERALD_BADGE_OFFSETS[e-1],t)}function modifyRunningShoes(e){modifySystemFlag(96,e)}function modifySystemFlag(e,t){let a=new FlagManager;a.readFlags();let i=EMERALD_SAVE_1_PTR,r=IodineGUI.Iodine.IOCore.cpu.read32(i);a.setFlag(r,4988,e,t)}function modifyBaseFlag(e,t){let a=new FlagManager;a.readFlags();let i=EMERALD_SAVE_1_PTR,r=IodineGUI.Iodine.IOCore.cpu.read32(i);a.setFlag(r,4720,e,t)}function readSystemFlag(e){let t=new FlagManager;t.readFlags(game);let a=EMERALD_SAVE_1_PTR,i=IodineGUI.Iodine.IOCore.cpu.read32(a);return t.getFlag(i,4988,e)}function readBaseFlag(e){let t=new FlagManager;t.readFlags(game);let a=EMERALD_SAVE_1_PTR,i=IodineGUI.Iodine.IOCore.cpu.read32(a);return t.getFlag(i,4720,e)}function writeGameVar(e,t){let a=EMERALD_SAVE_1_PTR,i=IodineGUI.Iodine.IOCore.cpu.read32(a);IodineGUI.Iodine.IOCore.cpu.write16(i+5020+2*(e-16384),t)}function readGameVar(e){let t=EMERALD_SAVE_1_PTR,a=IodineGUI.Iodine.IOCore.cpu.read32(t);return IodineGUI.Iodine.IOCore.cpu.read16(a+5020+2*(e-16384))}FlagManager.prototype.getFlag=function(e,t,a){let i=a%8;return!!+IodineGUI.Iodine.IOCore.cpu.read8(e+t+Math.ceil((a+1)/8)-1).toString(2).padStart(8,0).split("").reverse()[i]},FlagManager.prototype.setFlag=function(e,t,a,i){let r=a%8,o=IodineGUI.Iodine.IOCore.cpu.read8(e+t+Math.ceil((a+1)/8)-1).toString(2).padStart(8,0).split("").reverse();o[r]=i,IodineGUI.Iodine.IOCore.cpu.write8(e+t+Math.ceil((a+1)/8)-1,parseInt(o.reverse().join(""),2))},FlagManager.prototype.readFlags=function(){let e=IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR);this.badge1=this.getFlag(e,4988,7),this.badge2=this.getFlag(e,4988,8),this.badge3=this.getFlag(e,4988,9),this.badge4=this.getFlag(e,4988,10),this.badge5=this.getFlag(e,4988,11),this.badge6=this.getFlag(e,4988,12),this.badge7=this.getFlag(e,4988,13),this.badge8=this.getFlag(e,4988,14),this.hasRunningShoes=this.getFlag(e,4988,96)},FlagManager.prototype.writeFlags=function(){let e=IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR);this.setFlag(e,4988,96,+this.hasRunningShoes),this.setFlag(e,4720,228,1),modifySystemFlag(43,0),this.setFlag(e,4720,158,1),writeGameVar(16478,0),this.setFlag(e,4720,129,1),writeGameVar(16599,0),this.setFlag(e,4720,80,0),this.bag.hasKeyItem(ITEM_DATA["DEVON SCOPE"].number)||this.setFlag(e,4720,972,0),this.bag.hasKeyItem(ITEM_DATA["MAGMA EMBLEM"].number)||writeGameVar(16569,0)};
//# sourceMappingURL=build-index.91db4c35.js.map
