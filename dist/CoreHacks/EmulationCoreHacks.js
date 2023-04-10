/**
 * Random Warp Script
 */
var isWarping = false;
var randomWarpsEnabled = true;
var needsPositioningAfterWarp = false;
var fromEscalator = false;
var mapHeaderChanged = false;

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
 *  Warp flow:
 * 
 *  Within game:
 *  Wait for write to warp address -> 
 *  switch to warping state -> 
 *  wait for next read from warp address -> 
 *  before reading overwrite it -> 
 *  update flags e.t.c
 *  continue  
 */
const EMERALD_CURRENT_BANK = 0x2032ee4;
const EMERALD_CURRENT_MAP  = 0x2032ee5;
const EMERALD_CURRENT_WARP = 0x2032ee6;

// These are from the normally dynamic save block 
// gSaveBlock1Ptr->location.x e.t.c
const X_VAL_POST_WARP = 0x02026688;
const Y_VAL_POST_WARP = 0x0202668A;

var flagManager; // only global to help debugging

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

var disableWaitCount = 0;
async function disableBypassWait() {
    bypassWait = false;
    disableWaitCount = Math.max(disableWaitCount + 1, 2);
    while(disableWaitCount > 0 ) {
        await delay(500);
        disableWaitCount--
    }
    disableWaitCount = 0;
    bypassWait = true;
}

var usingHomeWarp = false;
GameBoyAdvanceCPU.prototype.write32WithoutIntercept = GameBoyAdvanceCPU.prototype.write32;
GameBoyAdvanceCPU.prototype.write32 = function (address, data) { 


    if (address == 0x2037f18 && needsPositioningAfterWarp) {
        // ensure gMapHeader has changed before we try and fix the players position 
        mapHeaderChanged = true;
    }

    if (address == 0x02038c5c && speedupHackState == SPEEDUP_HACKS_MODE.ON) {
        if (data == -1) {
            disableBypassWait();
        }
    } else if (address == 0x02020004) {
        // Make emulation more accurate :/
        data = 0;
    } else if (address == 0x02025364 && speedupHackState == SPEEDUP_HACKS_MODE.BATTLE_ONLY) {
        bypassWait = true;
    }    

    if (usingHomeWarp && address == EMERALD_CURRENT_BANK){
        this.write8(EMERALD_CURRENT_BANK, 0);
        this.write8(EMERALD_CURRENT_MAP, 10);
        this.write8(EMERALD_CURRENT_WARP, 5);
        needsPositioningAfterWarp = warpsNeedingPositionForces.get("E,0,10,5");
        usingHomeWarp = false;
        return;
    }

    this.write32WithoutIntercept(address, data);
}

GameBoyAdvanceCPU.prototype.write16WithoutIntercept = GameBoyAdvanceCPU.prototype.write16;
GameBoyAdvanceCPU.prototype.write16 = function (address, data) { 

    if (needsPositioningAfterWarp && mapHeaderChanged) {
        if (address == X_VAL_POST_WARP) {
    
            return this.write16WithoutIntercept(address, needsPositioningAfterWarp[0]);
    
        } else if (address == Y_VAL_POST_WARP) {
    
            console.log("finished warp setting position after")
            let yLocation = needsPositioningAfterWarp[1];
            needsPositioningAfterWarp = false;
            mapHeaderChanged = false;
            return this.write16WithoutIntercept(address, yLocation);
        }
    } else if (fromEscalator) {
        if (address == X_VAL_POST_WARP) {
    
            fromEscalator = false;
            data = data - 1;
    
        }
    }

    this.write16WithoutIntercept(address, data);
}

 GameBoyAdvanceCPU.prototype.write8WithoutIntercept = GameBoyAdvanceCPU.prototype.write8;
 GameBoyAdvanceCPU.prototype.write8 = function (address, data) { 

    if (address == EMERALD_CURRENT_WARP){
        isWarping = randomWarpsEnabled || forceNextWarp;
    } else if (address == 0x02024f0e && data != 0 && speedupHackState == SPEEDUP_HACKS_MODE.BATTLE_ONLY) {
        bypassWait = false;
    }
    
    this.write8WithoutIntercept(address, data);
 }

GameBoyAdvanceCPU.prototype.read8WithoutIntercept = GameBoyAdvanceCPU.prototype.read8;
GameBoyAdvanceCPU.prototype.read8 = function (address) {

    if (!isWarping) return this.read8WithoutIntercept(address);

    if (address == EMERALD_CURRENT_BANK) 
    {
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
    
    if (warpNo == 255) { 

        // Special Fix for norman after the tutorial
        if (romCode + "," + bank + "," + map + "," + warpNo == "E,8,1,255") {
            writeGameVar(0x4085, 6);
            modifyBaseFlag(0x2D6, 1);
            modifyBaseFlag(0x362, 1);
        }

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

        this.write8(EMERALD_CURRENT_BANK, pkWarp.toBank);
        this.write8(EMERALD_CURRENT_MAP, pkWarp.toMap);
        this.write8(EMERALD_CURRENT_WARP, pkWarp.toWarpNo);

        specialWarpHandling(pkWarp, trigger);

        console.log("Warping sending to " + pkWarp.toRomCode + "," + pkWarp.toBank + "," + pkWarp.toMap + "," + pkWarp.toWarpNo); 
    } else {
        console.log("Warping sending to vanilla"); 
    }
    
    isWarping = false;

    return address;
}

var warpsNeedingPositionForces = new Map();
warpsNeedingPositionForces.set("E,0,1,5"    , [0x1E, 0x1B]);
warpsNeedingPositionForces.set("E,0,5,0"    , [0x1B, 0x07]);
warpsNeedingPositionForces.set("E,0,2,0"    , [0x08, 0x06]);
warpsNeedingPositionForces.set("E,0,7,5"    , [0x2D, 0x07]);
warpsNeedingPositionForces.set("E,0,7,9"    , [0x35, 0x1D]);
warpsNeedingPositionForces.set("E,0,7,4"    , [0x09, 0x07]);
warpsNeedingPositionForces.set("E,0,8,2"    , [0x12, 0x2A]);
warpsNeedingPositionForces.set("E,0,11,3"   , [0x11, 0x0E]);
warpsNeedingPositionForces.set("E,0,12,5"   , [0x09, 0x02]);
warpsNeedingPositionForces.set("E,0,14,4"   , [0x08, 0x02]);
warpsNeedingPositionForces.set("E,0,15,0"   , [0x08, 0x10]);
warpsNeedingPositionForces.set("E,0,26,0"   , [0x0D, 0x72]);
warpsNeedingPositionForces.set("E,11,0,2"   , [0x0E, 0x02]);
warpsNeedingPositionForces.set("E,14,9,2"   , [0x0D, 0x02]);
warpsNeedingPositionForces.set("E,14,10,2"  , [0x0d, 0x02]);
warpsNeedingPositionForces.set("E,16,10,2"  , [0x09, 0x02]);
warpsNeedingPositionForces.set("E,24,8,2"   , [0x1D, 0x0D]);
warpsNeedingPositionForces.set("E,24,8,3"   , [0x1C, 0x15]);
warpsNeedingPositionForces.set("E,24,9,0"   , [0x1D, 0x0D]);
warpsNeedingPositionForces.set("E,24,9,1"   , [0x1C, 0x15]);
warpsNeedingPositionForces.set("E,24,13,4"  , [0x10, 0x13]);
warpsNeedingPositionForces.set("E,24,16,4"  , [0x0B, 0x09]);
warpsNeedingPositionForces.set("E,24,16,2"  , [0x0A, 0x0C]);
warpsNeedingPositionForces.set("E,24,17,5"  , [0x06, 0x0C]);
warpsNeedingPositionForces.set("E,24,17,4"  , [0x0A, 0x0C]);
warpsNeedingPositionForces.set("E,24,18,2"  , [0x0C, 0x0A]);
warpsNeedingPositionForces.set("E,24,18,3"  , [0x0C, 0x0C]);
warpsNeedingPositionForces.set("E,24,19,3"  , [0x0C, 0x0A]);
warpsNeedingPositionForces.set("E,24,19,4"  , [0x0C, 0x0C]);
warpsNeedingPositionForces.set("E,24,24,10" , [0x20, 0x13]);
warpsNeedingPositionForces.set("E,24,25,5"  , [0x05, 0x08]);
warpsNeedingPositionForces.set("E,24,25,9"  , [0x20, 0x14]);
warpsNeedingPositionForces.set("E,24,29,2"  , [0x06, 0x01]);
warpsNeedingPositionForces.set("E,24,78,0"  , [0x11, 0x0D]);
warpsNeedingPositionForces.set("E,24,81,0"  , [0x03, 0x01]);
warpsNeedingPositionForces.set("E,24,82,1"  , [0x07, 0x01]);
warpsNeedingPositionForces.set("E,24,95,0"  , [0x12, 0x0C]);
warpsNeedingPositionForces.set("E,24,96,0"  , [0x12, 0x0C]);
warpsNeedingPositionForces.set("E,26,74,1"  , [0x05, 0x05]);
warpsNeedingPositionForces.set("E,26,87,0"  , [0x0E, 0x13]);
warpsNeedingPositionForces.set("E,0,10,5"   , [0x0A, 0x09]);
warpsNeedingPositionForces.set("E,11,2,0"   , [0x02, 0x02]);

var escalatorTriggers = new Set();
escalatorTriggers.add("E,8,5,0"  );
escalatorTriggers.add("E,9,12,0" );
escalatorTriggers.add("E,10,6,0" );
escalatorTriggers.add("E,11,6,0" );
escalatorTriggers.add("E,12,3,0" );
escalatorTriggers.add("E,13,7,0" );
escalatorTriggers.add("E,14,4,0" );
escalatorTriggers.add("E,15,3,0" );
escalatorTriggers.add("E,16,13,0");
escalatorTriggers.add("E,16,14,0");
escalatorTriggers.add("E,2,3,0"  );
escalatorTriggers.add("E,3,2,0"  );
escalatorTriggers.add("E,4,6,0"  );
escalatorTriggers.add("E,5,5,0"  );
escalatorTriggers.add("E,6,5,0"  );
escalatorTriggers.add("E,7,1,0"  );

/*
*   DuringWarp handling takes place before the warp had happened but after the new rom has been loaded
*   This is useful for when you need to set a flag/var in  a game you are loading before the new map loads
*/
function specialWarpHandling(pkwarp, trigger) {
    
    let destination = pkwarp.toRomCode + "," + pkwarp.toBank + "," + pkwarp.toMap + "," + pkwarp.toWarpNo;

    // If Petalburg Gym make either catch tutorial or battle
    if (destination == "E,8,1,0") {
        // If catch tutorial hasn't been done we set to that
        // otherwise we set to battle state
        let normanState = readGameVar(0x4085);
        if (normanState < 2) {
            writeGameVar(0x4085, 0)
        } else {
            writeGameVar(0x4085, 6)
        }
    } else if (destination == "E,16,0,0") {
        // E4 rooms needs to walk fowards when entering
        writeGameVar(0x409C, 0);
    } else if (destination == "E,16,0,1")  {
        writeGameVar(0x409C, 1);
    } else if (destination == "E,16,1,0") {
        writeGameVar(0x409C, 1);
    } else if (destination == "E,16,1,1") {
        writeGameVar(0x409C, 2);
    } else if (destination == "E,16,2,0") {
        writeGameVar(0x409C, 2);
    } else if (destination == "E,16,2,1") {
        writeGameVar(0x409C, 3);
    } else if (destination == "E,16,3,0") {
        writeGameVar(0x409C, 3);
    } else if (destination == "E,16,3,1") {
        writeGameVar(0x409C, 4);
    } else  if (destination == "E,10,0,0") {
        // If Mauville Gym make battle
        new FlagManager().setFlag(IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR), 0x1270, 0x391, 0);
    } else if (destination == "E,29,1,0" || destination == "E,29,1,1") {
        // Make Sure the trick master won't crash the game
        if (readGameVar("E", 0x4044) > 7) {
            writeGameVar("E", 0x4044, 7);
        }
    } else if (warpsNeedingPositionForces.get(destination)) {

        // Some warps will break expected connections if we use an escalator / teleport 
        // so we need to fix the post warp position manually
        
        needsPositioningAfterWarp = warpsNeedingPositionForces.get(destination);

        // If the trigger was an escalator we need to apply the movement script to the position correction  
        if (escalatorTriggers.has(trigger)) {
            needsPositioningAfterWarp[0]--;
        }
        
    } else if (escalatorTriggers.has(trigger)) {

        // In general if it's from an escalator we move the warp left 1 even if it's not a special warp

        fromEscalator = true;

    }

    new FlagManager().writeFlags();
}

/***********************/
/* Dynamic rom patches */  
/***********************/


const MAP_TYPE_ADDRESS = 0x2037f2f;
const MAP_TYPES = {
    NONE       : 0,
    TOWN       : 1,
    CITY       : 2,
    ROUTE      : 3,
    UNDERGROUND: 4,
    UNDERWATER : 5,
    OCEAN_ROUTE: 6,
    UNKNOWN    : 7, // Not used by any map.
    INDOOR     : 8,
    SECRET_BASE: 9
};

function isMapOutside() {
    let mapType = IodineGUI.Iodine.IOCore.cpu.read8(MAP_TYPE_ADDRESS);
    return mapType == MAP_TYPES.NONE ||
           mapType == MAP_TYPES.TOWN ||
           mapType == MAP_TYPES.CITY ||
           mapType == MAP_TYPES.ROUTE ||
           mapType == MAP_TYPES.UNDERWATER ||
           mapType == MAP_TYPES.OCEAN_ROUTE;
}

GameBoyAdvanceMultiCartridge.prototype.readROM16WithoutIntercept = GameBoyAdvanceMultiCartridge.prototype.readROM16;
GameBoyAdvanceMultiCartridge.prototype.readROM16 = function (address) {
    
    if (address == 0xb9f78) {
        console.log("Destination to escape warp");

        if (isMapOutside()) {
            usingHomeWarp = true;
        }
    }   

    return this.readROM16WithoutIntercept(address);
}

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
const EMERALD_SAVE_1_PTR = 0x03004cac;

// DYNAMIC SAV2 PTRs
const EMERALD_SAVE_2_PTR = 0x03004cb0;

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

function FlagManager() {
    this.badge1 = null;
    this.badge2 = null;
    this.badge3 = null;
    this.badge4 = null;
    this.badge5 = null;
    this.badge6 = null;
    this.badge7 = null;
    this.badge8 = null;
    this.hasRunningShoes = null;
}

FlagManager.prototype.getFlag = function (saveOffset, sectionOffset, flagOffset) {

    let flagByte = IodineGUI.Iodine.IOCore.cpu.read8(saveOffset + sectionOffset + Math.ceil((flagOffset + 1) / 8) - 1);
    let flagBit = flagOffset % 8;

    return !!+flagByte.toString(2).padStart(8, 0).split("").reverse()[flagBit];
}

FlagManager.prototype.setFlag = function (saveOffset, sectionOffset, flagOffset, value) {

    let flagByte = IodineGUI.Iodine.IOCore.cpu.read8(saveOffset + sectionOffset + Math.ceil((flagOffset + 1) / 8) - 1);
    let flagBit = flagOffset % 8;

    let byteArr = flagByte.toString(2).padStart(8, 0).split("").reverse();
    byteArr[flagBit] = value;

    IodineGUI.Iodine.IOCore.cpu.write8(saveOffset + sectionOffset + Math.ceil((flagOffset + 1) / 8) - 1, parseInt(byteArr.reverse().join(""), 2));

}

FlagManager.prototype.readFlags = function () {
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
}

FlagManager.prototype.writeFlags = function () {

    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(EMERALD_SAVE_1_PTR);

    this.setFlag(save1Start, EMERALD_SYS_FLAGS_OFFSET, EMERALD_RUNNING_SHOE_OFFSET, +this.hasRunningShoes);

    // Open regi doors
    this.setFlag(save1Start, EMERALD_BASE_FLAGS_OFFSET, 0xE4, 1);

    // Not On Bike Path
    modifySystemFlag(0x2B, 0);

    // Open Sootopolis Gym Door
    this.setFlag(save1Start, EMERALD_BASE_FLAGS_OFFSET, 0x9E, 1);

    // Sootopolis always in nice state
    writeGameVar(0x405E, 0);
    this.setFlag(save1Start, EMERALD_BASE_FLAGS_OFFSET, 0x81, 1);

    // Rae-Rae always available
    writeGameVar(0x40D7, 0);
    this.setFlag(save1Start, EMERALD_BASE_FLAGS_OFFSET, 0x50, 0);

    // Show steven on the bridge
    // TOOD: we don't need to do this if they alread have the devon scope
    this.setFlag(save1Start, EMERALD_BASE_FLAGS_OFFSET, 0x3CC, 0);

    // Make sure the magma embelem can always be got
    // TODO: we don't need to do this if they already have the magma embelem
    writeGameVar(0x40B9, 0);
}


function modifyBadge(badgeNumber, shouldGiveOrRemoveBit) {

    modifySystemFlag(EMERALD_BADGE_OFFSETS[badgeNumber - 1], shouldGiveOrRemoveBit);

}

function modifyRunningShoes(shouldGiveOrRemoveBit) {

    modifySystemFlag(EMERALD_RUNNING_SHOE_OFFSET, shouldGiveOrRemoveBit);

}

function modifySystemFlag(offset, shouldGiveOrRemoveBit) {

    let manager = new FlagManager();
    manager.readFlags();

    let savePtr = EMERALD_SAVE_1_PTR;
    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(savePtr);

    let sysFlagOffset = EMERALD_SYS_FLAGS_OFFSET;

    manager.setFlag(save1Start, sysFlagOffset, offset, shouldGiveOrRemoveBit);
}

function modifyBaseFlag(offset, shouldGiveOrRemoveBit) {

    let manager = new FlagManager();
    manager.readFlags();

    let savePtr = EMERALD_SAVE_1_PTR;
    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(savePtr);

    let sysFlagOffset = EMERALD_BASE_FLAGS_OFFSET;

    manager.setFlag(save1Start, sysFlagOffset, offset, shouldGiveOrRemoveBit);

}

function readSystemFlag(offset) {

    let manager = new FlagManager();
    manager.readFlags(game);

    let savePtr = EMERALD_SAVE_1_PTR;
    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(savePtr);

    let sysFlagOffset = EMERALD_SYS_FLAGS_OFFSET;

    return manager.getFlag(save1Start, sysFlagOffset, offset);

}

function readBaseFlag(offset) {

    let manager = new FlagManager();
    manager.readFlags(game);

    let savePtr = EMERALD_SAVE_1_PTR;
    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(savePtr);

    let sysFlagOffset = EMERALD_BASE_FLAGS_OFFSET;

    return manager.getFlag(save1Start, sysFlagOffset, offset);

}

function writeGameVar(offset, data) {

    let savePtr = EMERALD_SAVE_1_PTR;
    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(savePtr);

    let baseVarOffset = EMERALD_BASE_VAR_OFFSET;

    IodineGUI.Iodine.IOCore.cpu.write16(save1Start + baseVarOffset + ((offset - 0x4000) * 2), data);
}

function readGameVar(offset) {

    let savePtr = EMERALD_SAVE_1_PTR;
    let save1Start = IodineGUI.Iodine.IOCore.cpu.read32(savePtr);

    let baseVarOffset = EMERALD_BASE_VAR_OFFSET;

    return IodineGUI.Iodine.IOCore.cpu.read16(save1Start + baseVarOffset + ((offset - 0x4000) * 2));
}