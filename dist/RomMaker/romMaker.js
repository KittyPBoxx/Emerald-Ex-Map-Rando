var gWarpRemappingList = 0x083d5788 - 0x08000000;
var gWarpRemappingList_size = 632;

cheerpjInit();

function RomPatcher() {
    this.EMERALD_EX_MD5  = "bd096a03683b741555186c7dff5f1ab2";
    this.PATCH_FILE_PATH = "EX2W.xdelta";

    /**
     * Section in the rom that holds the warp remappings
     * Up to 632 remappings can be added. First 3 bytes are source Second 3 bytes are destination. Then there are 2 unused bytes.
     * They MUST be inserted numerically sorted by source Bank, Map, WarpId
     * By default all values are at -1, -1, -1 -> 0, 0, 0
     * NB: these values are signed 8 bit values so 0xFF (255) in our json is -1 but this dosn't really become an issue
     * beause no warp tiles use values over 128
     */
    this.OFFSET_START_gWarpRemappingList         = gWarpRemappingList;
    this.ENTRY_COUNT_gWarpRemappingList          = gWarpRemappingList_size;
    this.ENTRY_SIZE_gWarpRemappingList           = 8; // 8 x (8 Bit values)  [3 source, 3 dest, 2 unused/padding]

    /* Config */
    this.applyBaseWarpRandoChanges = false;
    this.randomizeWarps            = false;
    this.romSeed                   = undefined;

    /* Patch Operation Chain */
    this.onConfigurationFinished       = this.resetROM;
    this.onROMReset                    = this.applyPatchFile;     
    this.onAppliedPatchFile            = this.applyDynamicBinaryChanges;
    this.onAppliedDynamicBinaryChanges = this.applyRandomWarps;
    this.onAppliedRandomWarps          = this.applyUPR;
    this.onAppliedUPR                  = this.saveAndDownload;

    /* UI Callbacks to Show progress */
    this.onStartRandomizationUI        = () => {};
    this.onPatchesAppliedUI            = () => {};
    this.onMapsGeneratedUI             = () => {};
    this.onPokemonRandomizedUI         = () => {};
    this.onErrorUI                     = () => {};
}

RomPatcher.prototype.setOnStartRandomizationUI = function(callback) {
    this.onStartRandomizationUI = callback;
}

RomPatcher.prototype.setOnPatchesAppliedUI = function(callback) {
    this.onPatchesAppliedUI = callback;
}

RomPatcher.prototype.setOnMapsGeneratedUI = function(callback) {
    this.onMapsGeneratedUI = callback;
}

RomPatcher.prototype.setOnPokemonRandomizedUI = function(callback) {
    this.onPokemonRandomizedUI = callback;
}

RomPatcher.prototype.setOnErrorUI = function(callback) {
    this.onErrorUI = callback;
}


RomPatcher.prototype.configureAndDownload = function (applyBaseWarpRandoChanges, randomizeWarps, romSeed) {
    this.applyBaseWarpRandoChanges = applyBaseWarpRandoChanges;
    this.randomizeWarps            = randomizeWarps;
    this.romSeed                   = romSeed;

    this.onStartRandomizationUI();
    this.onConfigurationFinished();
}

RomPatcher.prototype.resetROM = function () {
    if (this.modified) {
        this.addROM(romPatcher.ORIGINAL);
    }
    this.modified = true;

    this.onROMReset();
}

RomPatcher.prototype.applyPatchFile = function () {

    if (this.applyBaseWarpRandoChanges) {

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", this.PATCH_FILE_PATH, true);
        xmlhttp.responseType = "arraybuffer";
    
        xmlhttp.onload = (event) => {
            const arrayBuffer = xmlhttp.response; // Note: not req.responseText
            if (arrayBuffer) {
                romPatcher.ROM = new Uint8Array(new LibPatcher().applyPatch(romPatcher.ROM, arrayBuffer, true));
            }
            
            this.onPatchesAppliedUI();
            this.onAppliedPatchFile();
          };
    
        xmlhttp.send(null);

    } else {
        this.onPatchesAppliedUI();
        this.onAppliedPatchFile();
    }

}

RomPatcher.prototype.applyDynamicBinaryChanges = function () {

    if (this.applyBaseWarpRandoChanges)
    {
        // Update ROM code to SPXW so UPR knows to use different offsets
        // commented out offsets are from original Ex Speedchoice 0.4.0 
        this.patchROM8(0xAE, 0x58)
        this.patchROM8(0xAF, 0x57)

    }

    this.onAppliedDynamicBinaryChanges();
}

RomPatcher.prototype.applyRandomWarps = function () {

    if (this.randomizeWarps) {

        /* This is the callback Randomisation.js uses. That whole file needs refactoring */
        onNewMappingCreated = () => {

            let sortedRemappingList = [...warpList.entries()].sort(triggerEntrySort);
            let remappingCount = sortedRemappingList.length;
            let insertAfterNEntries = this.ENTRY_COUNT_gWarpRemappingList - remappingCount;
            let insertOffset = this.OFFSET_START_gWarpRemappingList + (insertAfterNEntries * this.ENTRY_SIZE_gWarpRemappingList);
            

            for (let i = 0; i < sortedRemappingList.length; i++) {

                let remapping = sortedRemappingList[i];

                let sourceArr = remapping[0].split(",").slice(1,4);
                let dest = remapping[1];
                let destArr = [dest.toBank, dest.toMap, dest.toWarpNo];
                
                this.patchROM8(insertOffset + ((i * this.ENTRY_SIZE_gWarpRemappingList) + 0), sourceArr[0]);
                this.patchROM8(insertOffset + ((i * this.ENTRY_SIZE_gWarpRemappingList) + 1), sourceArr[1]);
                this.patchROM8(insertOffset + ((i * this.ENTRY_SIZE_gWarpRemappingList) + 2), sourceArr[2]);

                this.patchROM8(insertOffset + ((i * this.ENTRY_SIZE_gWarpRemappingList) + 3), destArr[0]);
                this.patchROM8(insertOffset + ((i * this.ENTRY_SIZE_gWarpRemappingList) + 4), destArr[1]);
                this.patchROM8(insertOffset + ((i * this.ENTRY_SIZE_gWarpRemappingList) + 5), destArr[2]);

            }

            this.onMapsGeneratedUI();
            this.onAppliedRandomWarps();

        }

        setTimeout(() => {
            mapWarps(this.romSeed);
        }, 50);
    
    } else {
        this.onAppliedRandomWarps();
    }

}

function triggerEntrySort(a, b) {

    let t1 = a[0].split(",").map(s => parseInt(s)).slice(1,4);
    let t2 = b[0].split(",").map(s => parseInt(s)).slice(1,4);

    if (t1[0] !== t2[0]) {
        return t1[0] - t2[0]
    }

    if (t1[1] !== t2[1]) {
        return t1[1] - t2[1]
    }

    return t1[2] - t2[2]
}

RomPatcher.prototype.applyUPR = function () {

    cheerpjAddStringFile("/str/config.rnqs.json", getUPRJsonConfig());
    cheerpjAddStringFile("/str/rom.gba", this.ROM);

    var pacher = this; // Scope... plz...
    
    cheerpjRunMain("com.dabomstew.pkrandom.cli.CliRandomizer", "/app" + window.location.pathname + "UPR.jar", "-s", "/str/config.rnqs.json", "-i", "/str/rom.gba", "-o",  "/files/result.gba", "--seed", getHash(this.romSeed).toString()).then(() => {
        /* I have a feeling the indexDB errors are caused because we're doing a transacion here on the db (after cheerpj is "done") bu it still has transactions doing stuff...*/
        setTimeout(
            function() {
                let db;
                const request = indexedDB.open("cjFS_/files/", 4);
        
                request.onerror = (event) => console.error("Failed To Get Data From DB");
                request.onsuccess = (event) => {
                    db = event.target.result;
                    let trans = db.transaction(["files"], 'readwrite');
                    trans.objectStore("files").get("/result.gba").onsuccess = (event) => {
                        pacher.ROM = event.target.result.contents;
                        db.transaction(["files"], "readwrite").objectStore("files").delete("/result.gba");
                        cheerpjRemoveStringFile("/str/config.rnqs.json");
                        cheerpjRemoveStringFile("/str/rom.gba");
                        romPatcher.onPokemonRandomizedUI();
                        romPatcher.onAppliedUPR();
                    };
                };
            }, 5000);

    });
}

RomPatcher.prototype.saveAndDownload = function () {
    saveAs(new Blob([this.ROM.buffer]), "EmeraldExSpeedChoice_WarpRando_" + this.romSeed + ".gba");
}

RomPatcher.prototype.fileLoadROM = function(files, callback, warningCallback) {

    let thisPatcher = this;

    if (typeof files != "undefined") {
        for (let i = 0; i < files.length; i++) {
            if (files.length >= 1) {
                //Gecko 1.9.2+ (Standard Method)
                try {
                    var binaryHandle = new FileReader();
                    binaryHandle.onloadend = function () {
                        thisPatcher.addROM(this.result);
                        let romCode = thisPatcher.name.split("_")[1].slice(0,6);
                        callback(romCode);

                        if (romCode == "BPEE01") {
                            warningCallback("Unpatched Emerald Detected. " +  
                                            "Please patch ROM to EX 0.4.0 before loading.<br>" + 
                                            "<a href='https://github.com/RevoSucks/pokeemerald-ex-speedchoice/releases/tag/0.4.0' target='_blank'>Get Patch File</a><br>" + 
                                            "<a href='https://www.marcrobledo.com/RomPatcher.js/' target='_blank'>How To Patch</a>");
                        } else if (romCode != "SPDX01") {
                            warningCallback("Unknown Rom. Rom Should be Emerald Ex Speedchoice (U) 0.4.0");
                        } else if (md5(thisPatcher.ORIGINAL) != thisPatcher.EMERALD_EX_MD5) {
                            warningCallback("MD5 Check Failed. Unmodified Ex Speedchoice 0.4.0 expected.<br> MD5:" + thisPatcher.EMERALD_EX_MD5);
                        }
                    }
                    binaryHandle.readAsArrayBuffer(files[i]);
                }
                catch (error) {
                    try {
                        var result = files[i].getAsBinary();
                        var resultConverted = [];
                        for (var index = 0; index < result.length; ++index) {
                            resultConverted[index] = result.charCodeAt(index) & 0xFF;
                        }
                        thisPatcher.addROM(resultConverted);
                        let romCode = thisPatcher.name.split("_")[1].slice(0,6);
                        callback(romCode);
                        
                        if (romCode == "BPEE01") {
                            warningCallback("Unpatched Emerald Detected. " +  
                            "Please patch ROM to EX 0.4.0 before loading.<br>" + 
                            "<a href='https://github.com/RevoSucks/pokeemerald-ex-speedchoice/releases/tag/0.4.0' target='_blank'>Link: Get Patch File</a><br>" + 
                            "<a href='https://www.marcrobledo.com/RomPatcher.js/' target='_blank'>How To Patch</a>");
                        } else if (romCode != "SPDX01") {
                            warningCallback("Unknown Rom. Rom Should be Emerald Ex Speedchoice (U) 0.4.0");
                        } else if (md5(thisPatcher.ORIGINAL) != thisPatcher.EMERALD_EX_MD5) {
                            warningCallback("MD5 Check Failed. Unmodified Ex Speedchoice 0.4.0 expected.<br> MD5:" + thisPatcher.EMERALD_EX_MD5);
                        }
                    }
                    catch (error) {
                        alert("Could not load the processed ROM file!");
                        callback("ERR");
                        warningCallback("ROM could not be loaded.")
                    }
                }
            }
       }
    }
}

RomPatcher.prototype.addROM = function (ROM) {
    this.modified = false;
    this.ORIGINAL = ROM;
    this.ROM = this.getROMArray(new Uint8Array(ROM));
    this.decodeName();
}

RomPatcher.prototype.getROMArray = function (old_array) {
    this.ROMLength = Math.min((old_array.length >> 2) << 2, 0x2000000);
    this.EEPROMStart = ((this.ROMLength | 0) > 0x1000000) ? Math.max(this.ROMLength | 0, 0x1FFFF00) : 0x1000000;
    var newArray = new Uint8Array(this.ROMLength | 0);
    for (var index = 0; (index | 0) < (this.ROMLength | 0); index = ((index | 0) + 1) | 0) {
        newArray[index | 0] = old_array[index | 0] | 0;
    }
    return newArray;
}
RomPatcher.prototype.decodeName = function () {
    this.name = "GUID_";
    if ((this.ROMLength | 0) >= 0xC0) {
        for (var address = 0xAC; (address | 0) < 0xB3; address = ((address | 0) + 1) | 0) {
            if ((this.ROM[address | 0] | 0) > 0) {
                this.name += String.fromCharCode(this.ROM[address | 0] | 0);
            }
            else {
                this.name += "_";
            }
        }
    }
}

RomPatcher.prototype.patchROM8 = function (address, data) {
    address = address | 0;
    if ((address | 0) < (this.ROMLength | 0)) {
        this.ROM[address & 0x1FFFFFF] = data;
    }
}

var romPatcher = new RomPatcher();