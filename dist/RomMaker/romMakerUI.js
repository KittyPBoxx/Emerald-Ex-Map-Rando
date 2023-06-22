document.addEventListener('DOMContentLoaded', function() {

    document.getElementById("spriteContainer").appendChild(createPlayerTag(""));

    M.Range.init(document.querySelectorAll("input[type=range]"));

    M.Collapsible.init(document.querySelectorAll('.collapsible'), {});

    loadSavedConfig();
    setupInitialStates();

    romPatcher.setOnStartRandomizationUI(() => {
        document.getElementById("downloadProgress").classList.add("shown");
        document.getElementById("downloadProgressDesc").innerHTML = "Applying Patches";
    }); 
    romPatcher.setOnPatchesAppliedUI(() => {
        document.getElementById("downloadProgressDesc").innerHTML = "Applying Warp Randomizer";
    });    
    romPatcher.setOnMapsGeneratedUI(() => {
        document.getElementById("mapSpoilers").removeAttribute("disabled");
        document.getElementById("downloadProgressDesc").innerHTML = "Applying Pokemon Randomizer";
    });      
    romPatcher.setOnPokemonRandomizedUI(() => {
        document.getElementById("downloadProgress").classList.remove("shown");
    });
    romPatcher.setOnErrorUI((e) => {
        document.getElementById("downloadProgressDesc").innerHTML = "Error: " + e;
    });

    addEvent("change", document.getElementById("generalOptions_applyUprAfter"), e => {

        if (document.getElementById("generalOptions_applyUprAfter").checked) {
            romPatcher.separateupr = true;
            document.querySelectorAll(".upr-setting").forEach(e => e.classList.add("hide"));
        } else {
            romPatcher.separateupr = false;
            document.querySelectorAll(".upr-setting").forEach(e => e.classList.remove("hide"));
        }

    });

    addEvent("change", document.getElementById("load_config"), e => onConfigFileChange(e));
    addEvent("click", document.getElementById("export_config"), e => exportConfig());

    addEvent("change", document.getElementById("rom_load"), e => romPatcher.fileLoadROM(e.target.files, onRomLoaded, onWarning));
    addEvent("click", document.getElementById("newSeedButton"), e => generateNewSeed());
    addEvent("click", document.getElementById("randomizeButton"), e =>  {
        let applyBaseWarpRandoChanges = document.getElementById("generalOptions_applyWarpRandoBase").checked;
        let randomizeWarps = this.getElementById("warp_switch").checked;
        let romSeed = document.getElementById("seed_value").value;
        saveConfig();
        romPatcher.configureAndDownload(applyBaseWarpRandoChanges, randomizeWarps, romSeed);
    });
    addEvent("change", document.getElementById("seed_value"), e => updateSeed(e.target.value));

    addEvent("click", document.getElementById("mapSpoilers"), e => generateMapSpoiler(romPatcher.romSeed));

    addEvent("input", document.getElementById("generalOptionsForm"), e => onGeneralOptionsFormUpdated(e));
    addEvent("input", document.getElementById("limitPokemonForm"), e => onLimitFormUpdated(e));
    addEvent("input", document.getElementById("warpForm"), e => onWarpFormUpdated(e));
    addEvent("input", document.getElementById("pokemonBaseStatisticsForm"), e => onPokemonBaseStatisticsFormUpdated(e));
    addEvent("input", document.getElementById("pokemonAbilitiesForm"), e => onPokemonAbilitiesFormUpdated(e));
    addEvent("input", document.getElementById("pokemonTypesForm"), e => onPokemonTypesFormUpdated(e));
    addEvent("input", document.getElementById("randomizeEvolutionsForm"), e => onRandomizeEvolutionsFormUpdated(e));
    addEvent("input", document.getElementById("starterPokemonForm"), e => onStarterPokemonFormUpdated(e));
    addEvent("input", document.getElementById("moveDataForm"), e => onMoveDataFormUpdated(e));
    addEvent("input", document.getElementById("pokemonMovesetsForm"), e => onPokemonMovesetsFormUpdated(e));
    addEvent("input", document.getElementById("pokemonTrainersForm"), e => onPokemonTrainersFormUpdated(e));
    addEvent("input", document.getElementById("wildPokemonForm"), e => onWildPokemonFormUpdated(e));
    addEvent("input", document.getElementById("staticPokemonForm"), e => onStaticPokemonFormUpdated(e));
    addEvent("input", document.getElementById("tmsAndHmsForm"), e => onTmsAndHmsFormUpdated(e));
    addEvent("input", document.getElementById("moveTutorsForm"), e => onMoveTutorsFormUpdated(e));
    addEvent("input", document.getElementById("inGameTradesForm"), e => onInGameTradesFormUpdated(e));
    addEvent("input", document.getElementById("fieldItemsForm"), e => onFieldItemsFormUpdated(e));
    addEvent("input", document.getElementById("miscTweaksForm"), e => onMiscTweaksFormUpdated(e));
});

function createPlayerTag(seed) {

    let el = document.createElement("div");
    el.classList.add("sprite-img");
    el.classList.add("avatar");

    let backgrounds = ['#A0CDED', '#CDECAD', '#FFFAAE', '#FFC29F', '#F19A9C', '#AF8FC1'];

    let hashNumber = seed ? Math.abs(getHash(seed.toUpperCase())) + 78 : 0;

    let bgCol = backgrounds[hashNumber % 6];
    backgrounds.splice(hashNumber % 6, 1);
    let bgCol2 = backgrounds[(hashNumber + (hashNumber % 7)) % 5];
    let shiny = hashNumber % 4069 == 998 ? 'shiny/' : '';

    el.innerHTML = "<img class='circle'" + 
    "style='filter: blur(5px);position: absolute;background:" + "linear-gradient(197deg, " + bgCol + '40' + " 0%, " + bgCol + '70' + " 35%, " + bgCol2 + '96' + " 100%); transform: scale(1.3);outline: solid 1px " + bgCol + ";box-shadow: 0 3px 10px rgb(0 0 0 / 41%);'>";

    el.innerHTML += "<img class='circle'" + 
                   " src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + shiny + (hashNumber % 1009) + ".png'" + 
                   "style='background:" + "linear-gradient(197deg, " + bgCol + '40' + " 0%, " + bgCol + '70' + " 35%, " + bgCol2 + '96' + " 100%); transform: scale(1.3);outline: solid 1px " + bgCol + ";box-shadow: 0 3px 10px rgb(0 0 0 / 41%);'>";
    return el;
}

function onRomLoaded(romCode) {
    
    onWarning("");

    let knownRomLoaded = updateROMInfo(romCode);

    if (knownRomLoaded) {
        generateNewSeed();

        document.getElementById("newSeedButton").removeAttribute("disabled");
        document.getElementById("randomizeButton").removeAttribute("disabled");
        document.getElementById("seed_value").removeAttribute("disabled");
    } else {
        document.getElementById("newSeedButton").setAttribute("disabled", true);
        document.getElementById("randomizeButton").setAttribute("disabled", true);
        document.getElementById("seed_value").setAttribute("disabled", true);
    }
}

function onWarning(message) {
    document.getElementById("warningMessage").innerHTML = message;
}

function generateNewSeed() {
    updateSeed(Math.random().toString(36).substr(2, 6));
}

function updateSeed(seed) {
    document.getElementById("spriteContainer").replaceChildren(createPlayerTag(seed));
    document.getElementById("seed_value").value = seed;
}

function updateROMInfo(romCode) {

    document.getElementById("romInfoCard").innerHTML = "";
   
    let el = document.createElement("ul");

    let name = document.createElement("li");
    name.innerHTML = codeToName(romCode);

    el.appendChild(name);

    let code = document.createElement("li");
    code.innerHTML = romCode;
    
    el.appendChild(code);
   
    document.getElementById("romInfoCard").appendChild(el);

    return romCode == "SPDX01";
}

function showWarning(message) {
    //<a data-title="Dabomstew's Github" href="https://github.com/Dabomstew/UPR-Speedchoice">UPR SpeedChoice</a>
}

function codeToName(romCode) {

    let romName = "UNSUPPORTED GAME";

    if (romCode == "ERR") romCode = "Error Loading";

    if (romCode == "SPDX01") romName = "Emerald Ex (U)";
    
    if (romCode == "BPEE01") romName = "Emerald (U)";

    return romName;
}

function setupInitialStates() {
    onGeneralOptionsFormUpdated()
    onLimitFormUpdated();
    onWarpFormUpdated();
    onPokemonBaseStatisticsFormUpdated();
    onPokemonAbilitiesFormUpdated();
    onPokemonTypesFormUpdated();
    onRandomizeEvolutionsFormUpdated();
    onStarterPokemonFormUpdated();
    onMoveDataFormUpdated();
    onPokemonMovesetsFormUpdated();
    onPokemonTrainersFormUpdated();
    onWildPokemonFormUpdated();
    onStaticPokemonFormUpdated();
    onTmsAndHmsFormUpdated();
    onMoveTutorsFormUpdated();
    onInGameTradesFormUpdated();
    onFieldItemsFormUpdated();
    onMiscTweaksFormUpdated();
}

function onGeneralOptionsFormUpdated() {
    // let generalOptions_raceMode = document.getElementById("generalOptions_raceMode");
    // let generalOptions_noGameBreakingMoves = document.getElementById("generalOptions_noGameBreakingMoves");
    let generalOptions_applyWarpRandoBase = document.getElementById("generalOptions_applyWarpRandoBase");

    let warp_switch = document.getElementById("warp_switch");

    if (generalOptions_applyWarpRandoBase.checked) {
        warp_switch.removeAttribute("disabled"); 
    } else {
        warp_switch.setAttribute("disabled", true);
        warp_switch.checked = false;
    }
}

function onLimitFormUpdated(e) {

    let limitPokemon_switch = document.getElementById("limitPokemon_switch");

    let limitPokemon_includePokemonFrom_Gen1 = document.getElementById("limitPokemon_includePokemonFrom_Gen1");
    let limitPokemon_includePokemonFrom_Gen2 = document.getElementById("limitPokemon_includePokemonFrom_Gen2");
    let limitPokemon_includePokemonFrom_Gen3 = document.getElementById("limitPokemon_includePokemonFrom_Gen3");

    let limitPokemon_relatedPokemonFrom_Gen1 = document.getElementById("limitPokemon_relatedPokemonFrom_Gen1");
    let limitPokemon_relatedPokemonFrom_Gen2 = document.getElementById("limitPokemon_relatedPokemonFrom_Gen2");
    let limitPokemon_relatedPokemonFrom_Gen3 = document.getElementById("limitPokemon_relatedPokemonFrom_Gen3");

    if (limitPokemon_switch.checked) {
        limitPokemon_includePokemonFrom_Gen1.removeAttribute("disabled"); 
        limitPokemon_includePokemonFrom_Gen2.removeAttribute("disabled"); 
        limitPokemon_includePokemonFrom_Gen3.removeAttribute("disabled"); 
        limitPokemon_relatedPokemonFrom_Gen1.removeAttribute("disabled"); 
        limitPokemon_relatedPokemonFrom_Gen2.removeAttribute("disabled"); 
        limitPokemon_relatedPokemonFrom_Gen3.removeAttribute("disabled");

        if (limitPokemon_includePokemonFrom_Gen1.checked) {
            limitPokemon_relatedPokemonFrom_Gen1.checked = true;
            limitPokemon_relatedPokemonFrom_Gen1.setAttribute("disabled", true)
        }

        if (limitPokemon_includePokemonFrom_Gen2.checked) {
            limitPokemon_relatedPokemonFrom_Gen2.checked = true;
            limitPokemon_relatedPokemonFrom_Gen2.setAttribute("disabled", true)
        }

        if (limitPokemon_includePokemonFrom_Gen3.checked) {
            limitPokemon_relatedPokemonFrom_Gen3.checked = true;
            limitPokemon_relatedPokemonFrom_Gen3.setAttribute("disabled", true)
        }

        if (!limitPokemon_includePokemonFrom_Gen1.checked && 
            !limitPokemon_includePokemonFrom_Gen2.checked &&
            !limitPokemon_includePokemonFrom_Gen3.checked) {

            limitPokemon_relatedPokemonFrom_Gen1.checked = false;
            limitPokemon_relatedPokemonFrom_Gen2.checked = false;
            limitPokemon_relatedPokemonFrom_Gen3.checked = false;    

            limitPokemon_relatedPokemonFrom_Gen1.setAttribute("disabled", true)
            limitPokemon_relatedPokemonFrom_Gen2.setAttribute("disabled", true)
            limitPokemon_relatedPokemonFrom_Gen3.setAttribute("disabled", true)

        }


    } else {
        limitPokemon_includePokemonFrom_Gen1.setAttribute("disabled", true);
        limitPokemon_includePokemonFrom_Gen2.setAttribute("disabled", true);
        limitPokemon_includePokemonFrom_Gen3.setAttribute("disabled", true);
        limitPokemon_relatedPokemonFrom_Gen1.setAttribute("disabled", true)
        limitPokemon_relatedPokemonFrom_Gen2.setAttribute("disabled", true)
        limitPokemon_relatedPokemonFrom_Gen3.setAttribute("disabled", true)
    }

}

function onWarpFormUpdated(e) {

    let warp_switch = document.getElementById("warp_switch");
    let warp_level = document.getElementById("hoennLevel");

    if (warp_switch.checked) {
        warp_level.removeAttribute("disabled"); 
    } else {
        warp_level.setAttribute("disabled", true);
    }

}

function onPokemonBaseStatisticsFormUpdated() {

    let pokemonBaseStatisticsForm_unchanged        = document.getElementById("pokemonBaseStatisticsForm_unchanged");
    let pokemonBaseStatisticsForm_shuffle          = document.getElementById("pokemonBaseStatisticsForm_shuffle");
    let pokemonBaseStatisticsForm_random           = document.getElementById("pokemonBaseStatisticsForm_random");
    let pokemonBaseStatisticsForm_randomBTS        = document.getElementById("pokemonBaseStatisticsForm_randomBTS");
    let pokemonBaseStatisticsForm_randomBTSPercent = document.getElementById("pokemonBaseStatisticsForm_randomBTSPercent");
    let pokemonBaseStatisticsForm_equalizeBTS      = document.getElementById("pokemonBaseStatisticsForm_equalizeBTS");

    //let pokemonBaseStatisticsForm_standardizeExpCurves    = document.getElementById("pokemonBaseStatisticsForm_standardizeExpCurves");
    let pokemonBaseStatisticsForm_followEvolutions        = document.getElementById("pokemonBaseStatisticsForm_followEvolutions");
    let pokemonBaseStatisticsForm_updateBaseStats         = document.getElementById("pokemonBaseStatisticsForm_updateBaseStats");
    let pokemonBaseStatisticsForm_staticEvoStatGain       = document.getElementById("pokemonBaseStatisticsForm_staticEvoStatGain");
    let pokemonBaseStatisticsForm_randomBTSPercent_slider = document.getElementById("pokemonBaseStatisticsForm_randomBTSPercent_slider");
    let pokemonBaseStatisticsForm_maintainStatRatio       = document.getElementById("pokemonBaseStatisticsForm_maintainStatRatio");

    if (pokemonBaseStatisticsForm_unchanged.checked) {

        pokemonBaseStatisticsForm_followEvolutions.setAttribute("disabled", true);
        pokemonBaseStatisticsForm_staticEvoStatGain.setAttribute("disabled", true);
        pokemonBaseStatisticsForm_randomBTSPercent_slider.setAttribute("disabled", true)
        pokemonBaseStatisticsForm_maintainStatRatio.setAttribute("disabled", true);

        pokemonBaseStatisticsForm_followEvolutions.checked = false;
        pokemonBaseStatisticsForm_staticEvoStatGain.checked = false;
        pokemonBaseStatisticsForm_maintainStatRatio.checked = false;

    } else if (pokemonBaseStatisticsForm_shuffle.checked) {

        pokemonBaseStatisticsForm_followEvolutions.removeAttribute("disabled");
        pokemonBaseStatisticsForm_updateBaseStats.removeAttribute("disabled");

        pokemonBaseStatisticsForm_staticEvoStatGain.setAttribute("disabled", true);
        pokemonBaseStatisticsForm_randomBTSPercent_slider.setAttribute("disabled", true)
        pokemonBaseStatisticsForm_maintainStatRatio.setAttribute("disabled", true);

        pokemonBaseStatisticsForm_staticEvoStatGain.checked = false;
        pokemonBaseStatisticsForm_maintainStatRatio.checked = false;

    } else if (pokemonBaseStatisticsForm_random.checked) {

        pokemonBaseStatisticsForm_followEvolutions.removeAttribute("disabled");
        pokemonBaseStatisticsForm_updateBaseStats.removeAttribute("disabled");

        pokemonBaseStatisticsForm_staticEvoStatGain.setAttribute("disabled", true);
        pokemonBaseStatisticsForm_randomBTSPercent_slider.setAttribute("disabled", true)
        pokemonBaseStatisticsForm_maintainStatRatio.setAttribute("disabled", true);

        pokemonBaseStatisticsForm_staticEvoStatGain.checked = false;
        pokemonBaseStatisticsForm_maintainStatRatio.checked = false;

    } else if (pokemonBaseStatisticsForm_randomBTS.checked) {

        pokemonBaseStatisticsForm_followEvolutions.removeAttribute("disabled");
        pokemonBaseStatisticsForm_maintainStatRatio.removeAttribute("disabled");
        pokemonBaseStatisticsForm_staticEvoStatGain.removeAttribute("disabled");

        pokemonBaseStatisticsForm_updateBaseStats.setAttribute("disabled", true);
        pokemonBaseStatisticsForm_randomBTSPercent_slider.setAttribute("disabled", true)

        pokemonBaseStatisticsForm_updateBaseStats.checked = false;

    } else if (pokemonBaseStatisticsForm_randomBTSPercent.checked) {

        pokemonBaseStatisticsForm_followEvolutions.removeAttribute("disabled");
        pokemonBaseStatisticsForm_updateBaseStats.removeAttribute("disabled");
        pokemonBaseStatisticsForm_maintainStatRatio.removeAttribute("disabled");
        pokemonBaseStatisticsForm_randomBTSPercent_slider.removeAttribute("disabled");
        
        pokemonBaseStatisticsForm_staticEvoStatGain.setAttribute("disabled", true);
        
        pokemonBaseStatisticsForm_staticEvoStatGain.checked = false;

    } else if (pokemonBaseStatisticsForm_equalizeBTS.checked) {

        pokemonBaseStatisticsForm_followEvolutions.removeAttribute("disabled");
        pokemonBaseStatisticsForm_maintainStatRatio.removeAttribute("disabled");

        pokemonBaseStatisticsForm_updateBaseStats.setAttribute("disabled", true);
        pokemonBaseStatisticsForm_randomBTSPercent_slider.setAttribute("disabled", true)
        pokemonBaseStatisticsForm_staticEvoStatGain.setAttribute("disabled", true);

        pokemonBaseStatisticsForm_updateBaseStats.checked = false;
        pokemonBaseStatisticsForm_maintainStatRatio.checked = false;
    }
} 

function onPokemonAbilitiesFormUpdated() {

    let pokemonAbilities_switch = document.getElementById("pokemonAbilities_switch");

    let pokemonAbilities_AllowWonderGuard     = document.getElementById("pokemonAbilities_AllowWonderGuard");
    let pokemonAbilities_FollowEvolutions     = document.getElementById("pokemonAbilities_FollowEvolutions");
    let pokemonAbilities_BanTrappingAbiliies  = document.getElementById("pokemonAbilities_BanTrappingAbiliies");
    let pokemonAbilities_BanNegativeAbilities = document.getElementById("pokemonAbilities_BanNegativeAbilities");
    let pokemonAbilities_BanStupidAbilities   = document.getElementById("pokemonAbilities_BanStupidAbilities");

    if (pokemonAbilities_switch.checked) {
        pokemonAbilities_AllowWonderGuard.removeAttribute("disabled"); 
        pokemonAbilities_FollowEvolutions.removeAttribute("disabled"); 
        pokemonAbilities_BanTrappingAbiliies.removeAttribute("disabled"); 
        pokemonAbilities_BanNegativeAbilities.removeAttribute("disabled"); 
        pokemonAbilities_BanStupidAbilities.removeAttribute("disabled"); 
    } else {
        pokemonAbilities_AllowWonderGuard.setAttribute("disabled", true);
        pokemonAbilities_FollowEvolutions.setAttribute("disabled", true);
        pokemonAbilities_BanTrappingAbiliies.setAttribute("disabled", true);
        pokemonAbilities_BanNegativeAbilities.setAttribute("disabled", true);
        pokemonAbilities_BanStupidAbilities.setAttribute("disabled", true);

        pokemonAbilities_AllowWonderGuard.checked = false;
        pokemonAbilities_FollowEvolutions.checked = false;
        pokemonAbilities_BanTrappingAbiliies.checked = false;
        pokemonAbilities_BanNegativeAbilities.checked = false;
        pokemonAbilities_BanStupidAbilities.checked = false;
    }

}

function onPokemonTypesFormUpdated() {

    // let pokemonTypes_unchanged               = document.getElementById("pokemonTypes_unchanged");
    // let pokemonTypes_RandomFollowEvolutions  = document.getElementById("pokemonTypes_RandomFollowEvolutions");
    // let pokemonTypes_RandomFollowCompletely  = document.getElementById("pokemonTypes_RandomFollowCompletely");

} 

function onRandomizeEvolutionsFormUpdated() {

    let pokemonEvolutions_switch = document.getElementById("pokemonEvolutions_switch");

    let pokemonEvolutions_similarStrength              = document.getElementById("pokemonEvolutions_similarStrength");
    let pokemonEvolutions_sameTypings                  = document.getElementById("pokemonEvolutions_sameTypings");
    let pokemonEvolutions_limitEvolutionsToThreeStages = document.getElementById("pokemonEvolutions_limitEvolutionsToThreeStages");
    let pokemonEvolutions_forceChange                  = document.getElementById("pokemonEvolutions_forceChange");

    // let pokemonEvolutions_changeImpossibleEvos = document.getElementById("pokemonEvolutions_changeImpossibleEvos");
    // let pokemonEvolutions_makeEvolutionsEasier = document.getElementById("pokemonEvolutions_makeEvolutionsEasier");

    if (pokemonEvolutions_switch.checked) {
        pokemonEvolutions_similarStrength.removeAttribute("disabled"); 
        pokemonEvolutions_sameTypings.removeAttribute("disabled"); 
        pokemonEvolutions_limitEvolutionsToThreeStages.removeAttribute("disabled"); 
        pokemonEvolutions_forceChange.removeAttribute("disabled"); 
    } else {
        pokemonEvolutions_similarStrength.setAttribute("disabled", true);
        pokemonEvolutions_sameTypings.setAttribute("disabled", true);
        pokemonEvolutions_limitEvolutionsToThreeStages.setAttribute("disabled", true);
        pokemonEvolutions_forceChange.setAttribute("disabled", true);

        pokemonEvolutions_similarStrength.checked = false;
        pokemonEvolutions_sameTypings.checked = false;
        pokemonEvolutions_limitEvolutionsToThreeStages.checked = false;
        pokemonEvolutions_forceChange.checked = false;
    
    }
    
}

function onStarterPokemonFormUpdated() {

    // let starterPokemon_unchanged                            = document.getElementById("starterPokemon_unchanged");
    // let starterPokemon_randomCompletely                     = document.getElementById("starterPokemon_randomCompletely");
    // let starterPokemon_randomBasicPokemonWithTwoEvolutions  = document.getElementById("starterPokemon_randomBasicPokemonWithTwoEvolutions");
    // let starterPokemon_randomBasicPokemonWithOneEvolution   = document.getElementById("starterPokemon_randomBasicPokemonWithOneEvolution");
    let starterPokemon_randomBasicPokemonWithZeroEvolutions = document.getElementById("starterPokemon_randomBasicPokemonWithZeroEvolutions");

    let starterPokemon_banLegendaryStarters  = document.getElementById("starterPokemon_banLegendaryStarters");
    let starterPokemon_onlyLegendaryStarters = document.getElementById("starterPokemon_onlyLegendaryStarters");

    if (starterPokemon_randomBasicPokemonWithZeroEvolutions.checked) {
        starterPokemon_banLegendaryStarters.removeAttribute("disabled"); 
        starterPokemon_onlyLegendaryStarters.removeAttribute("disabled"); 
    } else {
        starterPokemon_banLegendaryStarters.setAttribute("disabled", true);
        starterPokemon_onlyLegendaryStarters.setAttribute("disabled", true);

        starterPokemon_banLegendaryStarters.checked = false;
        starterPokemon_onlyLegendaryStarters.checked = false;
    }

} 

function onMoveDataFormUpdated() {

    // let moveData_randomizerMovePower     = document.getElementById("moveData_randomizerMovePower");
    // let moveData_randomizerMoveAccuracy  = document.getElementById("moveData_randomizerMoveAccuracy");
    // let moveData_randomizerMovePP        = document.getElementById("moveData_randomizerMovePP");
    // let moveData_randomizerMoveTypes     = document.getElementById("moveData_randomizerMoveTypes");

    let moveData_UpdateMoves  = document.getElementById("moveData_UpdateMoves");
    let moveData_Legacy       = document.getElementById("moveData_Legacy");

    if (moveData_UpdateMoves.checked) {
        moveData_Legacy.removeAttribute("disabled"); 
    } else {
        moveData_Legacy.setAttribute("disabled", true);

        moveData_Legacy.checked = false;
    }

}

function onPokemonMovesetsFormUpdated() {

    let pokemonMovesets_unchanged                 = document.getElementById("pokemonMovesets_unchanged");
    // let pokemonMovesets_randomPreferringSameType  = document.getElementById("pokemonMovesets_randomPreferringSameType");
    // let pokemonMovesets_randomCompletely          = document.getElementById("pokemonMovesets_randomCompletely");
    let pokemonMovesets_metronomeOnlyMode         = document.getElementById("pokemonMovesets_metronomeOnlyMode");

    let pokemonMovesets_EveryPokemonStartsWithFourMoves       = document.getElementById("pokemonMovesets_EveryPokemonStartsWithFourMoves");
    let pokemonMovesets_reorderDamagingMoves                  = document.getElementById("pokemonMovesets_reorderDamagingMoves");
    let pokemonMovesets_forcePercentOfGoodDamagingMoves       = document.getElementById("pokemonMovesets_forcePercentOfGoodDamagingMoves");
    let pokemonMovesets_forcePercentOfGoodDamagingMoveSlider  = document.getElementById("pokemonMovesets_forcePercentOfGoodDamagingMoveSlider");

    if (pokemonMovesets_unchanged.checked || pokemonMovesets_metronomeOnlyMode.checked) {
        pokemonMovesets_EveryPokemonStartsWithFourMoves.setAttribute("disabled", true);
        pokemonMovesets_reorderDamagingMoves.setAttribute("disabled", true);
        pokemonMovesets_forcePercentOfGoodDamagingMoves.setAttribute("disabled", true);

        pokemonMovesets_EveryPokemonStartsWithFourMoves.checked = false;
        pokemonMovesets_reorderDamagingMoves.checked = false;
        pokemonMovesets_forcePercentOfGoodDamagingMoves.checked = false;
    } else {
        pokemonMovesets_EveryPokemonStartsWithFourMoves.removeAttribute("disabled"); 
        pokemonMovesets_reorderDamagingMoves.removeAttribute("disabled"); 
        pokemonMovesets_forcePercentOfGoodDamagingMoves.removeAttribute("disabled"); 
    }

    if (pokemonMovesets_forcePercentOfGoodDamagingMoves.checked) {
        pokemonMovesets_forcePercentOfGoodDamagingMoveSlider.removeAttribute("disabled");
    } else {
        pokemonMovesets_forcePercentOfGoodDamagingMoveSlider.setAttribute("disabled", true);
    }

}

function onPokemonTrainersFormUpdated() {

    let pokemonTrainers_unchanged  = document.getElementById("pokemonTrainers_unchanged");
    let pokemonTrainers_random     = document.getElementById("pokemonTrainers_random");
    let pokemonTrainers_typeThemed = document.getElementById("pokemonTrainers_typeThemed");

    let pokemonTrainers_rivalCarriesStarterThroughGame        = document.getElementById("pokemonTrainers_rivalCarriesStarterThroughGame");
    let pokemonTrainers_tryToUsePokemonWithSimilarStrength    = document.getElementById("pokemonTrainers_tryToUsePokemonWithSimilarStrength");
    let pokemonTrainers_weightTypesByNumberOfPokemonWithThem  = document.getElementById("pokemonTrainers_weightTypesByNumberOfPokemonWithThem");
    let pokemonTrainers_dontUseLegendaries                    = document.getElementById("pokemonTrainers_dontUseLegendaries");
    let pokemonTrainers_noEarlyWonderGuard                    = document.getElementById("pokemonTrainers_noEarlyWonderGuard");

    // let pokemonTrainers_randomizeTrainerNames         = document.getElementById("pokemonTrainers_randomizeTrainerNames");
    // let pokemonTrainers_randomizeTrainerClassNames    = document.getElementById("pokemonTrainers_randomizeTrainerClassNames");
    let pokemonTrainers_forceEvolveAtLevel            = document.getElementById("pokemonTrainers_forceEvolveAtLevel");
    let pokemonTrainers_forceEvolveAtLevelSlider      = document.getElementById("pokemonTrainers_forceEvolveAtLevelSlider");
    let pokemonTrainers_percentageLevelModifier       = document.getElementById("pokemonTrainers_percentageLevelModifier");
    let pokemonTrainers_percentageLevelModifierSlider = document.getElementById("pokemonTrainers_percentageLevelModifierSlider");

    if (pokemonTrainers_unchanged.checked) {
        pokemonTrainers_rivalCarriesStarterThroughGame.setAttribute("disabled", true);
        pokemonTrainers_tryToUsePokemonWithSimilarStrength.setAttribute("disabled", true);
        pokemonTrainers_weightTypesByNumberOfPokemonWithThem.setAttribute("disabled", true);
        pokemonTrainers_dontUseLegendaries.setAttribute("disabled", true);
        pokemonTrainers_noEarlyWonderGuard.setAttribute("disabled", true);

        pokemonTrainers_forceEvolveAtLevel.setAttribute("disabled", true);
        pokemonTrainers_percentageLevelModifier.setAttribute("disabled", true);

        pokemonTrainers_rivalCarriesStarterThroughGame.checked = false;
        pokemonTrainers_tryToUsePokemonWithSimilarStrength.checked = false;
        pokemonTrainers_weightTypesByNumberOfPokemonWithThem.checked = false;
        pokemonTrainers_dontUseLegendaries.checked = false;
        pokemonTrainers_noEarlyWonderGuard.checked = false;

        pokemonTrainers_forceEvolveAtLevel.checked = false;
        pokemonTrainers_percentageLevelModifier.checked = false;
    } else if (pokemonTrainers_random.checked) {

        pokemonTrainers_weightTypesByNumberOfPokemonWithThem.setAttribute("disabled", true);

        pokemonTrainers_rivalCarriesStarterThroughGame.removeAttribute("disabled");
        pokemonTrainers_tryToUsePokemonWithSimilarStrength.removeAttribute("disabled");
        pokemonTrainers_dontUseLegendaries.removeAttribute("disabled");
        pokemonTrainers_noEarlyWonderGuard.removeAttribute("disabled");

        pokemonTrainers_forceEvolveAtLevel.removeAttribute("disabled");
        pokemonTrainers_percentageLevelModifier.removeAttribute("disabled");
    
        pokemonTrainers_weightTypesByNumberOfPokemonWithThem.checked = false;
    } else if (pokemonTrainers_typeThemed.checked) {

        pokemonTrainers_weightTypesByNumberOfPokemonWithThem.removeAttribute("disabled");
        pokemonTrainers_rivalCarriesStarterThroughGame.removeAttribute("disabled");
        pokemonTrainers_tryToUsePokemonWithSimilarStrength.removeAttribute("disabled");
        pokemonTrainers_dontUseLegendaries.removeAttribute("disabled");
        pokemonTrainers_noEarlyWonderGuard.removeAttribute("disabled");

        pokemonTrainers_forceEvolveAtLevel.removeAttribute("disabled");
        pokemonTrainers_percentageLevelModifier.removeAttribute("disabled");

    }


    if (pokemonTrainers_forceEvolveAtLevel.checked) {
        pokemonTrainers_forceEvolveAtLevelSlider.removeAttribute("disabled");
    } else {
        pokemonTrainers_forceEvolveAtLevelSlider.setAttribute("disabled", true);
    }

    if (pokemonTrainers_percentageLevelModifier.checked) { 
        pokemonTrainers_percentageLevelModifierSlider.removeAttribute("disabled");
    } else {
        pokemonTrainers_percentageLevelModifierSlider.setAttribute("disabled", true);
    }
 
}

function onWildPokemonFormUpdated() {

    let wildPokemon_unchanged             = document.getElementById("wildPokemon_unchanged");
    let wildPokemon_random                = document.getElementById("wildPokemon_random");
    let wildPokemon_areaOneToOneMapping   = document.getElementById("wildPokemon_areaOneToOneMapping");
    let wildPokemon_globalOneToOneMapping = document.getElementById("wildPokemon_globalOneToOneMapping");

    let wildPokemon_none            = document.getElementById("wildPokemon_none");
    let wildPokemon_similarStrength = document.getElementById("wildPokemon_similarStrength");
    let wildPokemon_catchEmAllMode  = document.getElementById("wildPokemon_catchEmAllMode");
    let wildPokemon_TypeThemedAreas = document.getElementById("wildPokemon_TypeThemedAreas");

    let wildPokemon_UseTimeBasedEncounters     = document.getElementById("wildPokemon_UseTimeBasedEncounters");
    let wildPokemon_dontUseLegendaries         = document.getElementById("wildPokemon_dontUseLegendaries");
    let wildPokemon_setMinimumCatchRate        = document.getElementById("wildPokemon_setMinimumCatchRate");
    let wildPokemon_setMinimumCatchRateSlider  = document.getElementById("wildPokemon_setMinimumCatchRateSlider");
    let wildPokemon_randomizeHeldItems         = document.getElementById("wildPokemon_randomizeHeldItems");
    let wildPokemon_banBadItems                = document.getElementById("wildPokemon_banBadItems");

    if (wildPokemon_unchanged.checked) {

        wildPokemon_none.setAttribute("disabled", true);
        wildPokemon_similarStrength.setAttribute("disabled", true);
        wildPokemon_catchEmAllMode.setAttribute("disabled", true);
        wildPokemon_TypeThemedAreas.setAttribute("disabled", true);

        wildPokemon_UseTimeBasedEncounters.setAttribute("disabled", true);
        wildPokemon_dontUseLegendaries.setAttribute("disabled", true);

        wildPokemon_none.checked = false;
        wildPokemon_similarStrength.checked = false;
        wildPokemon_catchEmAllMode.checked = false;
        wildPokemon_TypeThemedAreas.checked = false;

        wildPokemon_UseTimeBasedEncounters.checked = false;
        wildPokemon_dontUseLegendaries.checked = false;

    } else if (wildPokemon_random.checked || wildPokemon_areaOneToOneMapping.checked) {

        wildPokemon_none.removeAttribute("disabled");
        wildPokemon_similarStrength.removeAttribute("disabled");
        wildPokemon_catchEmAllMode.removeAttribute("disabled");
        wildPokemon_TypeThemedAreas.removeAttribute("disabled");

        wildPokemon_UseTimeBasedEncounters.removeAttribute("disabled");
        wildPokemon_dontUseLegendaries.removeAttribute("disabled");

    } else if (wildPokemon_globalOneToOneMapping.checked) {

        wildPokemon_none.removeAttribute("disabled");
        wildPokemon_similarStrength.removeAttribute("disabled");

        wildPokemon_catchEmAllMode.setAttribute("disabled", true);
        wildPokemon_TypeThemedAreas.setAttribute("disabled", true);

        wildPokemon_UseTimeBasedEncounters.removeAttribute("disabled");
        wildPokemon_dontUseLegendaries.removeAttribute("disabled");

        wildPokemon_catchEmAllMode.checked = false;
        wildPokemon_TypeThemedAreas.checked = false;
    }

    if (wildPokemon_setMinimumCatchRate.checked) {
        wildPokemon_setMinimumCatchRateSlider.removeAttribute("disabled");
    } else {
        wildPokemon_setMinimumCatchRateSlider.setAttribute("disabled", true);
    }

    if (wildPokemon_randomizeHeldItems.checked) {
        wildPokemon_banBadItems.removeAttribute("disabled");
    } else {
        wildPokemon_banBadItems.setAttribute("disabled", true);
        wildPokemon_banBadItems.checked = false;
    }

}


function onStaticPokemonFormUpdated() {

    // let staticPokemon_unchanged                   = document.getElementById("staticPokemon_unchanged");
    // let staticPokemon_randomLegendaryToLegendary  = document.getElementById("staticPokemon_randomLegendaryToLegendary");
    // let staticPokemon_randomCompletely            = document.getElementById("staticPokemon_randomCompletely");

} 

function onTmsAndHmsFormUpdated() {

    let tmsAndHms_tmMoves_unchanged = document.getElementById("tmsAndHms_tmMoves_unchanged");
    let tmsAndHms_tmMoves_random    = document.getElementById("tmsAndHms_tmMoves_random");

    let tmsAndHms_tmMoves_fullHMCompatibility                   = document.getElementById("tmsAndHms_tmMoves_fullHMCompatibility");
    let tmsAndHms_tmMoves_tmLevelupMoveSanity                   = document.getElementById("tmsAndHms_tmMoves_tmLevelupMoveSanity");
    let tmsAndHms_tmMoves_keepFieldMoveTMs                      = document.getElementById("tmsAndHms_tmMoves_keepFieldMoveTMs");
    let tmsAndHms_tmMoves_forcePercentOfGoodDamagingMoves       = document.getElementById("tmsAndHms_tmMoves_forcePercentOfGoodDamagingMoves");
    let tmsAndHms_tmMoves_forcePercentOfGoodDamagingMovesSlider = document.getElementById("tmsAndHms_tmMoves_forcePercentOfGoodDamagingMovesSlider");

    let tmsAndHms_TMHMCompatibility_unchanged             = document.getElementById("tmsAndHms_TMHMCompatibility_unchanged");
    // let tmsAndHms_TMHMCompatibility_randomPreferSameType  = document.getElementById("tmsAndHms_TMHMCompatibility_randomPreferSameType");
    // let tmsAndHms_TMHMCompatibility_randomCompletely      = document.getElementById("tmsAndHms_TMHMCompatibility_randomCompletely");
    let tmsAndHms_TMHMCompatibility_fullCompatibility     = document.getElementById("tmsAndHms_TMHMCompatibility_fullCompatibility");

    if (!tmsAndHms_tmMoves_unchanged.checked || !tmsAndHms_TMHMCompatibility_unchanged.checked) {
        tmsAndHms_tmMoves_tmLevelupMoveSanity.removeAttribute("disabled");
    } else {
        tmsAndHms_tmMoves_tmLevelupMoveSanity.setAttribute("disabled", true);
        tmsAndHms_tmMoves_tmLevelupMoveSanity.checked = false;
    }

    if (tmsAndHms_TMHMCompatibility_fullCompatibility.checked) {
        tmsAndHms_tmMoves_fullHMCompatibility.setAttribute("disabled", true);

        tmsAndHms_tmMoves_fullHMCompatibility.checked = false;
    } else {
        tmsAndHms_tmMoves_fullHMCompatibility.removeAttribute("disabled");
    }

    if (tmsAndHms_tmMoves_random.checked) {
        tmsAndHms_tmMoves_keepFieldMoveTMs.removeAttribute("disabled");
        tmsAndHms_tmMoves_forcePercentOfGoodDamagingMoves.removeAttribute("disabled");
    } else {
        tmsAndHms_tmMoves_keepFieldMoveTMs.setAttribute("disabled", true);
        tmsAndHms_tmMoves_forcePercentOfGoodDamagingMoves.setAttribute("disabled", true);
    
        tmsAndHms_tmMoves_keepFieldMoveTMs.checked = false;
        tmsAndHms_tmMoves_forcePercentOfGoodDamagingMoves.checked = false;
    }

    if (tmsAndHms_tmMoves_forcePercentOfGoodDamagingMoves.checked) {
        tmsAndHms_tmMoves_forcePercentOfGoodDamagingMovesSlider.removeAttribute("disabled");
    } else {
        tmsAndHms_tmMoves_forcePercentOfGoodDamagingMovesSlider.setAttribute("disabled", true);
    }

}

function onMoveTutorsFormUpdated() {

    let moveTutors_moveTutorMoves_unchanged = document.getElementById("moveTutors_moveTutorMoves_unchanged");
    let moveTutors_moveTutorMoves_random    = document.getElementById("moveTutors_moveTutorMoves_random");

    let moveTutors_moveTutorMoves_tutorLevelupMoveSanity                = document.getElementById("moveTutors_moveTutorMoves_tutorLevelupMoveSanity");
    let moveTutors_moveTutorMoves_keepFieldMoveTutors                   = document.getElementById("moveTutors_moveTutorMoves_keepFieldMoveTutors");
    let moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMoves       = document.getElementById("moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMoves");
    let moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMovesSlider = document.getElementById("moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMovesSlider");

    let moveTutors_moveTutorCompatibility_unchanged               = document.getElementById("moveTutors_moveTutorCompatibility_unchanged");
    // let moveTutors_moveTutorCompatibility_randomPreferSameType    = document.getElementById("moveTutors_moveTutorCompatibility_randomPreferSameType");
    // let moveTutors_moveTutorCompatibility_randomCompletely        = document.getElementById("moveTutors_moveTutorCompatibility_randomCompletely");
    // let moveTutors_moveTutorCompatibility_randomFullCompatibility = document.getElementById("moveTutors_moveTutorCompatibility_randomFullCompatibility");

    if (!moveTutors_moveTutorMoves_unchanged.checked || !moveTutors_moveTutorCompatibility_unchanged.checked) {
        moveTutors_moveTutorMoves_tutorLevelupMoveSanity.removeAttribute("disabled");
    } else {
        moveTutors_moveTutorMoves_tutorLevelupMoveSanity.setAttribute("disabled", true);
        moveTutors_moveTutorMoves_tutorLevelupMoveSanity.checked = false;
    }

    if (moveTutors_moveTutorMoves_random.checked) {
        moveTutors_moveTutorMoves_keepFieldMoveTutors.removeAttribute("disabled");
        moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMoves.removeAttribute("disabled");
    } else {
        moveTutors_moveTutorMoves_keepFieldMoveTutors.setAttribute("disabled", true);
        moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMoves.setAttribute("disabled", true);
    
        moveTutors_moveTutorMoves_keepFieldMoveTutors.checked = false;
        moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMoves.checked = false;
    }

    if (moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMoves.checked) {
        moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMovesSlider.removeAttribute("disabled");
    } else {
        moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMovesSlider.setAttribute("disabled", true);
    }

} 

function onInGameTradesFormUpdated() {

    let inGameTrades_unchanged                            = document.getElementById("inGameTrades_unchanged");
    // let inGameTrades_randomizeGivenPokemonOnly         = document.getElementById("inGameTrades_randomizeGivenPokemonOnly");
    // let inGameTrades_randomizeGivenAndRequestedPokemon = document.getElementById("inGameTrades_randomizeGivenAndRequestedPokemon");

    let inGameTrades_randomizeNicknames = document.getElementById("inGameTrades_randomizeNicknames");
    let inGameTrades_randomizeOTs       = document.getElementById("inGameTrades_randomizeOTs");
    let inGameTrades_randomizeIVs       = document.getElementById("inGameTrades_randomizeIVs");
    let inGameTrades_randomizeItems     = document.getElementById("inGameTrades_randomizeItems");

    if (inGameTrades_unchanged.checked) {
        inGameTrades_randomizeNicknames.setAttribute("disabled", true);
        inGameTrades_randomizeOTs.setAttribute("disabled", true);
        inGameTrades_randomizeIVs.setAttribute("disabled", true);
        inGameTrades_randomizeItems.setAttribute("disabled", true);

        inGameTrades_randomizeNicknames.checked = false;
        inGameTrades_randomizeOTs.checked = false;
        inGameTrades_randomizeIVs.checked = false;
        inGameTrades_randomizeItems.checked = false;
    } else {
        inGameTrades_randomizeNicknames.removeAttribute("disabled");
        inGameTrades_randomizeOTs.removeAttribute("disabled");
        inGameTrades_randomizeIVs.removeAttribute("disabled");
        inGameTrades_randomizeItems.removeAttribute("disabled");
    }

} 

function onFieldItemsFormUpdated() {

    //let fieldItems_unchanged = document.getElementById("fieldItems_unchanged");
    // let fieldItems_shuffle   = document.getElementById("fieldItems_shuffle");
    let fieldItems_randomize = document.getElementById("fieldItems_randomize");

    let fieldItems_banBadItems = document.getElementById("fieldItems_banBadItems");

    if (fieldItems_randomize.checked) {
        fieldItems_banBadItems.removeAttribute("disabled");
    }  else {
        fieldItems_banBadItems.setAttribute("disabled", true);
        fieldItems_banBadItems.checked = false;
    }

} 

function onMiscTweaksFormUpdated() {

    // let miscTweaks_randomizePCPotion           = document.getElementById("miscTweaks_randomizePCPotion");
    // let miscTweaks_randomizeNationalDexAtStart = document.getElementById("miscTweaks_randomizeNationalDexAtStart");
    // let miscTweaks_lowerCasePokemonNames       = document.getElementById("miscTweaks_lowerCasePokemonNames");
    // let miscTweaks_randomizeCatchingTutorial   = document.getElementById("miscTweaks_randomizeCatchingTutorial");
    // let miscTweaks_banLuckyEgg                 = document.getElementById("miscTweaks_banLuckyEgg");

} 

function addEvent(sEvent, oElement, fListener) {
    oElement.addEventListener(sEvent, fListener, false);
}

function saveConfig() {
    let config = [...document.querySelectorAll('form input')].filter(i => !(i.type == "file") && !(i.type == "text") && i.id).map(i => { return {"id": i.id, "checked": i.checked, "value": i.value } });
    localStorage.setItem("EMERALD_EX_WARP_RANDO_CONFIG", JSON.stringify(config));
}

function loadSavedConfig() {
    let config = localStorage.getItem("EMERALD_EX_WARP_RANDO_CONFIG");
    loadConfig(config);
}

function loadConfig(config) {
    if (config) {
        config = JSON.parse(config);
        config.forEach(conf => {
            let el = document.getElementById(conf.id);
            if (el) {
                el.value = conf.value;
                if (conf.checked) {
                    el.setAttribute("checked", true);
                } else {
                    el.removeAttribute("checked");
                }
            }
        })
        setupInitialStates();
        if (document.getElementById("generalOptions_applyUprAfter").checked) {
            romPatcher.separateupr = true;
            document.querySelectorAll(".upr-setting").forEach(e => e.classList.add("hide"));
        } else {
            romPatcher.separateupr = false;
            document.querySelectorAll(".upr-setting").forEach(e => e.classList.remove("hide"));
        }
    }
}

function exportConfig() {
    let config = [...document.querySelectorAll('form input')].filter(i => !(i.type == "file") && !(i.type == "text") && i.id).map(i => { return {"id": i.id, "checked": i.checked, "value": i.value } });

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(config)));
    element.setAttribute('download', "Emerald_Ex_Map_Rando_Config.json");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function onConfigFileChange(event) {
    let reader = new FileReader();
    reader.onload = (event) => loadConfig(event.target.result);
    if (event.target.files[0]) {
        reader.readAsText(event.target.files[0]);
    }
}