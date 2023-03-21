/**
 * Random Warp Script
 */

// Ruby/Saphire (0x020297f0) where to find current warp

var isWarping = false;
var switchingGameState = 0; // 0 - Not Switching Game, 
                            // 1 - Playing exit transition before switch
                            // 2 - Playing enterance after switch 
var randomWarpsEnabled = true;

/******************/
/* Warp Addresses */
/******************/
/**
 *  Order of events for a warp script
 * 
 *  1) A player steps on a warp tile
 *  2) A write8 is perforemed to bank, then map, then warp for current game
 *  3) Several read8s are performed to bank, then map, then warp 
 *  4) Exit animation is played (i.e walking through a door) and screen fades to black
 *  5) A write32 is done to the last bank address
 *  6) New map is loaded and fades in then enterance animation is played 
 * 
 * 
 *  Warp flow:
 * 
 *  Within game:
 *  Wait for write to warp address -> switch to warping state -> wait for next read from warp address -> make save state -> before reading overwrite it -> continue  
 * 
 *  To another game:
 *  Wait for write to warp address -> switch to warping state -> wait for next read from warp address -> take a save state -> increment game state -> resume playing ->
 *  wait for write to previous warp address (player exit map in first game) -> load state from different game (copying data accross) that was take just before warp ->
 *  make screen black -> overwrite next warp location -> increment warp state ->  wait for write to previous warp address (player exit map in load state from second game) -> 
 *  make screen visible -> continue
 */
const EMERALD_LAST_BANK = 0x02032eDC;

const EMERALD_CURRENT_BANK = 0x2032ee4;
const EMERALD_CURRENT_MAP  = 0x2032ee5;
const EMERALD_CURRENT_WARP = 0x2032ee6;

const EMERALD_MAP_TYPE = 0x203732F; // Used for enabling teleports/fly anywhere (0x2 for city, 0x4 for underground) 

var flagManager; // only global to help debugging
var isInSafari = false;

const SPEEDUP_HACKS_MODE = { ON: 2, BATTLE_ONLY: 1, OFF: 0}
var speedupHackState = SPEEDUP_HACKS_MODE.ON;

function setSpeedupHackState(mode) {
    if (mode == SPEEDUP_HACKS_MODE.ON) {
        bypassWait = true;
        speedupHackState = SPEEDUP_HACKS_MODE.ON
    } else if (mode == SPEEDUP_HACKS_MODE.BATTLE_ONLY) {
        bypassWait = false;
        speedupHackState = SPEEDUP_HACKS_MODE.BATTLE_ONLY;
    } else if (mode == SPEEDUP_HACKS_MODE.OFF) {
        bypassWait = false;
        speedupHackState = SPEEDUP_HACKS_MODE.OFF;
    }
}

async function disableBypassWait() {
    bypassWait = false;
    await delay(500);
    bypassWait = true;
}

GameBoyAdvanceCPU.prototype.write32WithoutIntercept = GameBoyAdvanceCPU.prototype.write32;
GameBoyAdvanceCPU.prototype.write32 = function (address, data) { 

    if (address == EMERALD_LAST_BANK)  {
        isInSafari = new FlagManager().getFlag(IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR), EMERALD_SYS_FLAGS_OFFSET, 0x2C)
        specialPostWarpHandling();
    } else if (address == 0x02038c5c && speedupHackState == SPEEDUP_HACKS_MODE.ON) {
        if (data == -1) {
            disableBypassWait();
        }
    } else if (address == 0x02020004) {
        // Make emulation more accurate :/
        data = 0;
    } else if (address == 0x02025364 && speedupHackState == SPEEDUP_HACKS_MODE.BATTLE_ONLY) {
        bypassWait = true;
    }    

    this.write32WithoutIntercept(address, data);
}

// GameBoyAdvanceCPU.prototype.write16WithoutIntercept = GameBoyAdvanceCPU.prototype.write16;
// GameBoyAdvanceCPU.prototype.write16 = function (address, data) { 



//     this.write16WithoutIntercept(address, data);
// }

 GameBoyAdvanceCPU.prototype.write8WithoutIntercept = GameBoyAdvanceCPU.prototype.write8;
 GameBoyAdvanceCPU.prototype.write8 = function (address, data) { 

    if (address == EMERALD_CURRENT_WARP){
        isWarping = randomWarpsEnabled || forceNextWarp;
    } else if (address == 0x02024f0e && data != 0 && speedupHackState == SPEEDUP_HACKS_MODE.BATTLE_ONLY) {
        bypassWait = false;
    }
    
    this.write8WithoutIntercept(address, data);
 }


const EMERALD_MOVEMENT_MODE_OFFSET = 0x02037590;
const FIRE_RED_MOVEMENT_MODE_OFFSET = 0x02037078;
const MOVEMENT_MODE_WALK = 0x01;
const MOVEMENT_MODE_BIKE = 0x02;
const MOVEMENT_MODE_SURF = 0x08;
var teleportAnywhere = false;
GameBoyAdvanceCPU.prototype.read8WithoutIntercept = GameBoyAdvanceCPU.prototype.read8;
GameBoyAdvanceCPU.prototype.read8 = function (address) {

    if (teleportAnywhere) {
        if (address == EMERALD_MAP_TYPE){
            return 2;
        }
    }

    if (!isWarping) return this.read8WithoutIntercept(address);

    if (address == EMERALD_CURRENT_BANK) 
    {
        // Base game Emerald
        address = this.handleWarpRedirection(address, IodineGUI.Iodine.IOCore.cartridge.romCode);
        
    }

    return this.read8WithoutIntercept(address);
}

var reverseNextWarp = false; // Set true when loading a save state that was going through a warp
var forceNextWarp = null;
GameBoyAdvanceCPU.prototype.handleWarpRedirection = function (address, romCode) {

    let bank = this.read8WithoutIntercept(address);
    let map = this.read8WithoutIntercept(address + 1);
    let warpNo = this.read8WithoutIntercept(address + 2);
    

    let usingHomeWarp = this.handelHomeWarp(romCode, bank, map, warpNo);
    
    if (warpNo == 255 && !usingHomeWarp) { 
        // Avoid scripted warps, route connections without zone e.t.c
        return address; 
    }

    let pkWarp = null;
    let trigger = romCode + "," + bank + "," + map + "," + warpNo;

    if (forceNextWarp) {
        let toParts = forceNextWarp.split(",");
        pkWarp = new PKWarp(trigger, toParts[0], toParts[1], toParts[2], toParts[3], forceNextWarp)
        reverseNextWarp = false;
        forceNextWarp = null;
    } else if(reverseNextWarp && warpList.get(trigger)) {
        let source = warpList.get(trigger).source;
        let toParts = source.split(",");
        pkWarp = new PKWarp(trigger, toParts[0], toParts[1], toParts[2], toParts[3], source)
        reverseNextWarp = false;
    } else {
        pkWarp = warpList.get(trigger);
        console.log("Warping triggered for " + trigger); 
    }

    if (pkWarp) {

        pkWarp = specialPreWarpHandling(pkWarp);

        IodineGUI.Iodine.pause();

        IodineGUI.Iodine.saveStateManager.saveState(romCode, true);

        this.write8(EMERALD_CURRENT_BANK, pkWarp.toBank);
        this.write8(EMERALD_CURRENT_MAP, pkWarp.toMap);
        this.write8(EMERALD_CURRENT_WARP, pkWarp.toWarpNo);

        specialDuringWarpHandling(pkWarp);

        IodineGUI.Iodine.play();

        console.log("Warping sending to " + pkWarp.toRomCode + "," + pkWarp.toBank + "," + pkWarp.toMap + "," + pkWarp.toWarpNo); 
    } else {
        console.log("Warping sending to vanilla"); 
    }
    
    isWarping = false;

    return address;
}

// Home Warp function use the same script as the safari zone 
// If we are currently in the safari zone we run the script normally otherwise we modify the location to send us home
GameBoyAdvanceCPU.prototype.handelHomeWarp = function(romCode, bank, map, warpNo) {

    if (bank == 23 && map == 0 && warpNo == 255) {
        if (!isInSafari) {
            forceNextWarp = forceNextWarp || "E,1,3,0";
            writeGameVar("E", 0x40A4, 0);
            return true;
        }
    }

    return false;
}

// Some warps may need special handling to avoid bugs
/*
*   PreWarp handling takes place as soon as a warps has been triggered. This is useful if you need to alter the location
*   that a warp would be going to
*/
function specialPreWarpHandling(pkwarp) {

    // let destination = pkwarp.toRomCode + "," + pkwarp.toBank + "," + pkwarp.toMap + "," + pkwarp.toWarpNo;

    return pkwarp;
}

/*
*   DuringWarp handling takes place before the warp had happened but after the new rom has been loaded
*   This is useful for when you need to set a flag/var in  a game you are loading before the new map loads
*/
function specialDuringWarpHandling(pkwarp) {
    
    let destination = pkwarp.toRomCode + "," + pkwarp.toBank + "," + pkwarp.toMap + "," + pkwarp.toWarpNo;

    // Open Regi Caves

    // Show Mirage Tower

    // Make sure it dosn't think we are on cycling road

    // Make sure guy is moved from from devon corp floor one
    
    // If trickmaster reached end state we need to reset him

    // If muesum defeated we need to open up that warp in slateport

    // If Petalburg Gym make either catch tutorial or battle
    if (destination == "E,8,1,0") {
        // If catch tutorial hasn't been done we set to that
        // otherwise we set to battle state
        let normanState = readGameVar("E", 0x4085);
        if (normanState < 2) {
            writeGameVar("E", 0x4085, 0)
        } else {
            writeGameVar("E", 0x4085, 6)
        }
    } 

    // If Mauville Gym make battle
    if (destination == "E,10,0,0") {
        new FlagManager().setFlag(IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR), 0x1270, 0x391, 0);
    }

    // Make sure we can get waterfall
}

/*
*   PostWarp handling takes place after the warp has finished
*   This is useful for when you need to trigger an event after the new map has loaded
*/
function specialPostWarpHandling() {

    // Need to pass in the current warp address
    // Fix the "Jesus warps" in seafloor cavern for emerald

    if (IodineGUI.Iodine.IOCore.cartridge.romCode === "E") {
        let bank = IodineGUI.Iodine.IOCore.cpu.read8WithoutIntercept(EMERALD_CURRENT_BANK);
        let map = IodineGUI.Iodine.IOCore.cpu.read8WithoutIntercept(EMERALD_CURRENT_BANK + 1);
        let warpNo = IodineGUI.Iodine.IOCore.cpu.read8WithoutIntercept(EMERALD_CURRENT_BANK + 2);

        let destination = "E" + "," + bank + "," + map + "," + warpNo;

        if (destination == "E,24,33,2") {
            // Seafloor caven stop walking on water
            forceStateAfterDelay(MOVEMENT_MODE_SURF, 1000);
        } else if (destination == "E,0,4,1" || destination == "E,0,4,4" || destination == "E,0,4,5" || destination == "E,0,4,6" || destination == "E,0,4,7" || destination == "E,0,4,8" || 
                   destination == "E,0,15,0" || destination == "E,0,15,1" || destination == "E,0,15,2" || destination == "E,0,15,3" || destination == "E,0,15,4" || destination == "E,0,15,") {
            if (document.getElementById("autoBike").checked) {
                M.toast({html: 'Auto Bike Off', displayLength:1000 });
                document.getElementById("autoBike").click();
            }
            // Somewhere we can't use a bike (fortree or pacifidlog)
            forceStateAfterDelay(MOVEMENT_MODE_WALK, 1000);
        } else if (destination == "E,16,0,0") {
            // E4 rooms needs to walk fowards when entering
            writeGameVar("E", 0x409C, 0);
        } else if (destination == "E,16,0,1")  {
            writeGameVar("E", 0x409C, 1);
        } else if (destination == "E,16,1,0") {
            writeGameVar("E", 0x409C, 1);
        } else if (destination == "E,16,1,1") {
            writeGameVar("E", 0x409C, 2);
        } else if (destination == "E,16,2,0") {
            writeGameVar("E", 0x409C, 2);
        } else if (destination == "E,16,2,1") {
            writeGameVar("E", 0x409C, 3);
        } else if (destination == "E,16,3,0") {
            writeGameVar("E", 0x409C, 3);
        } else if (destination == "E,16,3,1") {
            writeGameVar("E", 0x409C, 4);
        }

    }
}

async function forceStateAfterDelay(movementMode, delayTime) {
    await delay(delayTime/IodineGUI.Iodine.getSpeed());
    forcePlayerState(movementMode);
}

async function quickSpeedUp(duration) {
    let currentSpeed = IodineGUI.Iodine.getSpeed();
    IodineGUI.Iodine.setSpeed(4);
    IodineGUI.mixerInput.volume = 0.0
    await delay(duration);
    IodineGUI.Iodine.setSpeed(currentSpeed);
    IodineGUI.mixerInput.volume = 0.1
}

function quickHideScreen() {
    let elmnt = document.getElementById("emulator_target");
    elmnt.classList.remove("quick-hide");
    elmnt.offsetWidth
    elmnt.classList.add("quick-hide")
}

function readWRAMSlice(address, length) {
    let startAddress = (address - 0x02000000);
    let endAddress = startAddress + length;
    return IodineGUI.Iodine.IOCore.memory.externalRAM.slice(startAddress, endAddress);
}
function spliceWRAM(address, length, data) {
    let startAddress = (address - 0x02000000);
    for (let i = 0; i<length; i++) {
        IodineGUI.Iodine.IOCore.memory.externalRAM[startAddress + i] = data[i];
    }
}


/***********************/
/* Dynamic rom patches */  
/***********************/
/**
 * Patches out an area in the ROM 
 */

var currentlySaving = false;
GameBoyAdvanceMultiCartridge.prototype.readROM8WithoutIntercept = GameBoyAdvanceMultiCartridge.prototype.readROM8;
GameBoyAdvanceMultiCartridge.prototype.readROM8 = function (address) {

    if (currentlySaving) {
        if ((address == 3084361 || address == 8455992)) {
            console.log("saved");
            saveAfterDelay();
            currentlySaving = false;
        }
    }

    return this.readROM8WithoutIntercept(address);
}

async function saveAfterDelay() {
    await delay(200);
    IodineGUI.Iodine.exportSave();
}

GameBoyAdvanceSaves.prototype.saveIntercept = function(address, data) {
    if (address == 0 && data == 48) {
        currentlySaving = true;
    } 
}


const EMERALD_CURRENT_GROUND_OFFSET = 0x0203735B;
const CURRENT_GROUND_LAND = 0x33;
const CURRENT_GROUND_WATER = 0x11;
const CURRENT_GROUND_LADDER = 0x30;
const CURRENT_GROUND_ELEVATED = 0x44;

const EMERALD_STATE_OFFSET = 0x02037591;
function forcePlayerState(state) {

    if(!IodineGUI.Iodine.IOCore) return;

    IodineGUI.Iodine.IOCore.cpu.write8(EMERALD_MOVEMENT_MODE_OFFSET, state);
    IodineGUI.Iodine.IOCore.cpu.write8(EMERALD_STATE_OFFSET, state); 
    if (state == MOVEMENT_MODE_SURF) {
        IodineGUI.Iodine.IOCore.cpu.write8(EMERALD_CURRENT_GROUND_OFFSET, CURRENT_GROUND_WATER); 
    } else if (IodineGUI.Iodine.IOCore.cpu.read8(EMERALD_CURRENT_GROUND_OFFSET) == CURRENT_GROUND_ELEVATED) {
        IodineGUI.Iodine.IOCore.cpu.write8(EMERALD_CURRENT_GROUND_OFFSET, CURRENT_GROUND_ELEVATED); 
    } else {
        IodineGUI.Iodine.IOCore.cpu.write8(EMERALD_CURRENT_GROUND_OFFSET, CURRENT_GROUND_LADDER); 
    }
}


function dynamicMemorySlice(dynamicPointer, offsetInDynamic, length) {
    let dynamicBlock = IodineGUI.Iodine.IOCore.cpu.read32(dynamicPointer);
    let startAddress = (dynamicBlock + offsetInDynamic - 0x02000000);
    let endAddress = startAddress + length;
    return IodineGUI.Iodine.IOCore.memory.externalRAM.slice(startAddress, endAddress);    
}

function dynamicMemorySplice(dynamicPointer, offsetInDynamic, length, data) {
    let dynamicBlock = IodineGUI.Iodine.IOCore.cpu.read32(dynamicPointer);
    let startAddress = (dynamicBlock + offsetInDynamic - 0x02000000);
    for (let i = 0; i<length; i++) {
        IodineGUI.Iodine.IOCore.memory.externalRAM[startAddress + i] = data[i];
    }
}


/******************/
/* Data Addresses */
/******************/
/**
 *  Addresses for save data, Team is not copied here because we use where it is statically stored in memory
 *  Addresses are offsets from the 32bit addresses that can be found using the pointers (ptr locations are static)
 *  Money is xor'd against 32bit xor key, item quantity is xor'd against the first 2 bytes of that key.
 *  
 *  Dynamicly Addressed memory means the three sections of data move in memory (hence we need to look the up with ptrs)
 *  These change each time the bag is accessed or a warp is triggered (and at various other times)
 * 
 *  There are 3 dynamic sections. SAV1 (mostly relating to team and items)
 *  SAV2 (storing the xor key, and trainer data, play time, settings, seen mons e.t.c)
 *  We don't deal with SAV3 but it's mostly boxed pokemon / box config   
 */


// DYNAMIC SAV1 PTRs
const EMERALD_SAVE_1_PTR = 0x03005D8C;

// DYNAMIC SAV2 PTRs
const EMERALD_SAVE_2_PTR = 0x03005d90;

// DYNAMIC SAV3 PTRs
const EMERALD_SAVE_3_PTR = 0x03005d94;

/*******************/
/* Flag Management */
/*******************/

// This handles any general vars/flags that need to be transfered when switching games

// IN DYNAMIC SAV1
// The equations are so the offsets line up the the flags defined in the decomp projects
// https://github.com/pret/pokeemerald/blob/master/include/constants/flags.h
// https://github.com/pret/pokeemerald/blob/master/include/constants/vars.h
const EMERALD_BASE_FLAGS_OFFSET   = 0x1270;
const EMERALD_SYS_FLAGS_OFFSET    = 0x137C;
const EMERALD_BADGE1_OFFSET       = 0x7;
const EMERALD_BADGE2_OFFSET       = 0x8;
const EMERALD_BADGE3_OFFSET       = 0x9;
const EMERALD_BADGE4_OFFSET       = 0xA;
const EMERALD_BADGE5_OFFSET       = 0xB;
const EMERALD_BADGE6_OFFSET       = 0xC;
const EMERALD_BADGE7_OFFSET       = 0xD;
const EMERALD_BADGE8_OFFSET       = 0xE;
const EMERALD_RUNNING_SHOE_OFFSET = 0x60;
const EMERALD_POKEDEX_OFFSET      = 0x1; 
const EMERALD_NATIONAL_DEX_OFFSET = 0x36;
const EMERALD_BADGE_OFFSETS = [EMERALD_BADGE1_OFFSET, 
                               EMERALD_BADGE2_OFFSET, 
                               EMERALD_BADGE3_OFFSET, 
                               EMERALD_BADGE4_OFFSET, 
                               EMERALD_BADGE5_OFFSET, 
                               EMERALD_BADGE6_OFFSET, 
                               EMERALD_BADGE7_OFFSET, 
                               EMERALD_BADGE8_OFFSET];

const EMERALD_BASE_VAR_OFFSET = 0x139c;

const EMERALD_STARTER_CHOICE_OFFSET = 0x4023;

function FlagManager(hasBike) {
    this.badge1 = null;
    this.badge2 = null;
    this.badge3 = null;
    this.badge4 = null;
    this.badge5 = null;
    this.badge6 = null;
    this.badge7 = null;
    this.badge8 = null;
    this.hasRunningShoes = null;
    this.HMState = null;
    this.hasBike = hasBike;
    this.repelSteps = null;
    this.starterChoice = null;
}

FlagManager.prototype.getFlag = function (saveOffset, sectionOffset, flagOffset) {

    // let flagByte = IodineGUI.Iodine.IOCore.cpu.read8(saveOffset + sectionOffset + Math.ceil((flagOffset + 1) / 8) - 1);
    // let flagBit = flagOffset % 8;

    // return !!+flagByte.toString(2).padStart(8, 0).split("").reverse()[flagBit];
}

FlagManager.prototype.setFlag = function (saveOffset, sectionOffset, flagOffset, value) {

    // let flagByte = IodineGUI.Iodine.IOCore.cpu.read8(saveOffset + sectionOffset + Math.ceil((flagOffset + 1) / 8) - 1);
    // let flagBit = flagOffset % 8;

    // let byteArr = flagByte.toString(2).padStart(8, 0).split("").reverse();
    // byteArr[flagBit] = value;

    // IodineGUI.Iodine.IOCore.cpu.write8(saveOffset + sectionOffset + Math.ceil((flagOffset + 1) / 8) - 1, parseInt(byteArr.reverse().join(""), 2));

}

FlagManager.prototype.readFlags = function (game) {
        this.readEmeraldFlags();
}

FlagManager.prototype.readEmeraldFlags = function () {
    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR);

    this.badge1          = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE1_OFFSET);
    this.badge2          = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE2_OFFSET);
    this.badge3          = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE3_OFFSET);
    this.badge4          = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE4_OFFSET);
    this.badge5          = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE5_OFFSET);
    this.badge6          = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE6_OFFSET);
    this.badge7          = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE7_OFFSET);
    this.badge8          = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE8_OFFSET);
    this.hasRunningShoes = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_RUNNING_SHOE_OFFSET);

    this.repelSteps = readGameVar("E", EMERALD_REPEL_STEPS_OFFSET);
}

FlagManager.prototype.writeFlags = function (game, lastGame) {
        this.writeEmeraldFlags();
}

FlagManager.prototype.writeEmeraldFlags = function () {

    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR);

    this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_RUNNING_SHOE_OFFSET, +this.hasRunningShoes);

    // Enable national dex
    this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_NATIONAL_DEX_OFFSET, 1);
    writeGameVar("E", 0x404E, 0x0302);
    let save2Start = IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_2_PTR);
    IodineGUI.Iodine.IOCore.cpu.write8(save2Start + 26, 0xDA);

    // Open regi doors
    this.setFlag(save1Start, EMERALD_BASE_FLAGS_OFFSET, 0xE4, 1);

    // Not On Bike Path
    modifySystemFlag("E", 0x2B, 0);

    if (badgeSync) {
        
        let badge1 = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE1_OFFSET);
        let badge2 = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE2_OFFSET);
        let badge3 = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE3_OFFSET);
        let badge4 = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE4_OFFSET);
        let badge5 = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE5_OFFSET);
        let badge6 = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE6_OFFSET);
        let badge7 = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE7_OFFSET);
        let badge8 = this.getFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE8_OFFSET);

        let updatedBadges = this.HMState.updateBadges("E", badge1, badge2, badge3, badge4, badge5, badge6, badge7, badge8);

        this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE1_OFFSET, +(updatedBadges[0] || badge1));
        this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE2_OFFSET, +(updatedBadges[1] || badge2));
        this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE3_OFFSET, +(updatedBadges[2] || badge3));
        this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE4_OFFSET, +(updatedBadges[3] || badge4));
        this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE5_OFFSET, +(updatedBadges[4] || badge5));
        this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE6_OFFSET, +(updatedBadges[5] || badge6));
        this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE7_OFFSET, +(updatedBadges[6] || badge7));
        this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_BADGE8_OFFSET, +(updatedBadges[7] || badge8));

    }

    writeGameVar("E", EMERALD_REPEL_STEPS_OFFSET, this.repelSteps);

    if (this.starterChoice) {
        writeGameVar("E", EMERALD_STARTER_CHOICE_OFFSET, this.starterChoice);
    }
}


function modifyBadge(game, badgeNumber, shouldGiveOrRemoveBit) {

    let badgeOffsets = game == "FR" ? FIRE_RED_BADGE_OFFSETS : EMERALD_BADGE_OFFSETS
    modifySystemFlag(game, badgeOffsets[badgeNumber - 1], shouldGiveOrRemoveBit);

}

function modifyRunningShoes(game, shouldGiveOrRemoveBit) {

    let offset = game == "FR" ? FIRE_RED_RUNNING_SHOE_OFFSET : EMERALD_RUNNING_SHOE_OFFSET
    modifySystemFlag(game, offset, shouldGiveOrRemoveBit);

}

function modifySystemFlag(game, offset, shouldGiveOrRemoveBit) {

    let manager = new FlagManager();
    manager.readFlags(game);

    let savePtr = EMERALD_SAVE_1_PTR;
    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(savePtr);

    let sysFlagOffset = EMERALD_SYS_FLAGS_OFFSET;

    manager.setFlag(save1Start, sysFlagOffset, offset, shouldGiveOrRemoveBit);

}

function readSystemFlag(game, offset) {

    let manager = new FlagManager();
    manager.readFlags(game);

    let savePtr = EMERALD_SAVE_1_PTR;
    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(savePtr);

    let sysFlagOffset = EMERALD_SYS_FLAGS_OFFSET;

    return manager.getFlag(save1Start, sysFlagOffset, offset);

}
function writeGameVar(game, offset, data) {

    // let savePtr = EMERALD_SAVE_1_PTR;
    // let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(savePtr);

    // let baseVarOffset = EMERALD_BASE_VAR_OFFSET;

    // IodineGUI.Iodine.IOCore.cpu.write16(save1Start + baseVarOffset + ((offset - 0x4000) * 2), data);
}

function readGameVar(game, offset) {

    // let savePtr = EMERALD_SAVE_1_PTR;
    // let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(savePtr);

    // let baseVarOffset = EMERALD_BASE_VAR_OFFSET;

    // return IodineGUI.Iodine.IOCore.cpu.read16(save1Start + baseVarOffset + ((offset - 0x4000) * 2));
}