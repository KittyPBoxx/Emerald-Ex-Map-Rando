var upr_config = {
    "romName":"Emerald EX (U)",
    "updatedFromOldVersion":false,
    "currentMiscTweaks":2080,
    "changeImpossibleEvolutions":false,
    "makeEvolutionsEasier":false,
    "raceMode":false,
    "blockBrokenMoves":false,
    "limitPokemon":false,
    "baseStatisticsMod":"UNCHANGED",
    "standardizeEXPCurves":false,
    "baseStatsFollowEvolutions":false,
    "updateBaseStats":false,
    "baseStatRange":0,
    "dontRandomizeRatio":false,
    "evosBuffStats":false,
    "abilitiesMod":"UNCHANGED",
    "allowWonderGuard":false,
    "abilitiesFollowEvolutions":false,
    "banTrappingAbilities":false,
    "banNegativeAbilities":false,
    "startersMod":"COMPLETELY_RANDOM",
    "customStarters":[252,255,258],
    "randomizeStartersHeldItems":false,
    "banBadRandomStarterHeldItems":false,
    "banLegendaryStarters":false,
    "onlyLegendaryStarters":false,
    "typesMod":"UNCHANGED",
    "evolutionsMod":"UNCHANGED",
    "evosSimilarStrength":false,
    "evosSameTyping":false,
    "evosMaxThreeStages":false,
    "evosForceChange":false,
    "randomizeMovePowers":false,
    "randomizeMoveAccuracies":false,
    "randomizeMovePPs":false,
    "randomizeMoveTypes":false,
    "randomizeMoveCategory":false,
    "updateMoves":false,
    "updateMovesLegacy":false,
    "movesetsMod":"COMPLETELY_RANDOM",
    "startWithFourMoves":true,
    "reorderDamagingMoves":false,
    "movesetsForceGoodDamaging":false,
    "movesetsGoodDamagingPercent":0,
    "trainersMod":"RANDOM",
    "rivalCarriesStarterThroughout":false,
    "trainersUsePokemonOfSimilarStrength":false,
    "trainersMatchTypingDistribution":false,
    "trainersBlockLegendaries":false,
    "trainersBlockEarlyWonderGuard":false,
    "randomizeTrainerNames":false,
    "randomizeTrainerClassNames":false,
    "trainersForceFullyEvolved":true,
    "trainersForceFullyEvolvedLevel":60,
    "trainersLevelModified":false,
    "trainersLevelModifier":0,
    "wildPokemonMod":"RANDOM",
    "wildPokemonRestrictionMod":"NONE",
    "useTimeBasedEncounters":false,
    "blockWildLegendaries":false,
    "useMinimumCatchRate":false,
    "minimumCatchRateLevel":1,
    "randomizeWildPokemonHeldItems":false,
    "banBadRandomWildPokemonHeldItems":false,
    "condenseEncounterSlots":false,
    "catchEmAllReasonableSlotsOnly":false,
    "staticPokemonMod":"COMPLETELY_RANDOM",
    "tmsMod":"RANDOM",
    "tmLevelUpMoveSanity":false,
    "keepFieldMoveTMs":false,
    "fullHMCompat":false,
    "tmsForceGoodDamaging":false,
    "tmsGoodDamagingPercent":0,
    "tmsHmsCompatibilityMod":"FULL",
    "moveTutorMovesMod":"RANDOM",
    "tutorLevelUpMoveSanity":false,
    "keepFieldMoveTutors":false,
    "tutorsForceGoodDamaging":false,
    "tutorsGoodDamagingPercent":0,
    "moveTutorsCompatibilityMod":"FULL",
    "inGameTradesMod":"UNCHANGED",
    "randomizeInGameTradesNicknames":false,
    "randomizeInGameTradesOTs":false,
    "randomizeInGameTradesIVs":false,
    "randomizeInGameTradesItems":false,
    "fieldItemsMod":"RANDOM",
    "banBadRandomFieldItems":false,
    "currentRestrictions": {
        "allow_gen1": false, 
        "allow_gen2": false, 
        "allow_gen3": false, 
        "allow_gen4": false, 
        "allow_gen5": false,

        "assoc_g1_g2": false, 
        "assoc_g1_g4": false,
        
        "assoc_g2_g1": false,
        "assoc_g2_g3": false, 
        "assoc_g2_g4": false,

        "assoc_g3_g2": false, 
        "assoc_g3_g4": false,

        "assoc_g4_g1": false,
        "assoc_g4_g2": false, 
        "assoc_g4_g3": false,
    }
};


function getUPRJsonConfig() {

    /* GENERAL */
    upr_config.raceMode         = document.getElementById("generalOptions_raceMode").checked;
    upr_config.blockBrokenMoves = document.getElementById("generalOptions_noGameBreakingMoves").checked;

    /* LIMIT */

    upr_config.limitPokemon = document.getElementById("limitPokemon_switch").checked;

    upr_config.currentRestrictions.allow_gen1 = document.getElementById("limitPokemon_includePokemonFrom_Gen1").checked;
    upr_config.currentRestrictions.allow_gen2 = document.getElementById("limitPokemon_includePokemonFrom_Gen2").checked;
    upr_config.currentRestrictions.allow_gen3 = document.getElementById("limitPokemon_includePokemonFrom_Gen3").checked;

    if (upr_config.currentRestrictions.allow_gen1) {
        assoc_g1_g2 = document.getElementById("limitPokemon_relatedPokemonFrom_Gen2").checked;
    } else if (upr_config.currentRestrictions.allow_gen2) {
        assoc_g2_g1 = document.getElementById("limitPokemon_relatedPokemonFrom_Gen1").checked;
        assoc_g2_g3 = document.getElementById("limitPokemon_relatedPokemonFrom_Gen3").checked;
    } else if (upr_config.currentRestrictions.allow_gen3) {
        assoc_g3_g2 = document.getElementById("limitPokemon_relatedPokemonFrom_Gen2").checked;
    }

    /* BASE STATS */

    if (document.getElementById("pokemonBaseStatisticsForm_unchanged").checked) {
        upr_config.baseStatisticsMod = "UNCHANGED";  
    } else if (document.getElementById("pokemonBaseStatisticsForm_shuffle").checked) {
        upr_config.baseStatisticsMod = "SHUFFLE";  
    } else if (document.getElementById("pokemonBaseStatisticsForm_random").checked) {
        upr_config.baseStatisticsMod = "RANDOM";  
    } else if (document.getElementById("pokemonBaseStatisticsForm_randomBTS").checked) {
        upr_config.baseStatisticsMod = "RANDOMBST";  
    } else if (document.getElementById("pokemonBaseStatisticsForm_randomBTSPercent").checked) {
        upr_config.baseStatisticsMod = "RANDOMBSTPERC";  
    } else if (document.getElementById("pokemonBaseStatisticsForm_equalizeBTS").checked) {
        upr_config.baseStatisticsMod =  "EQUALIZE";  
    }

    upr_config.standardizeEXPCurves       = document.getElementById("pokemonBaseStatisticsForm_standardizeExpCurves").checked;            
    upr_config.baseStatsFollowEvolutions  = document.getElementById("pokemonBaseStatisticsForm_followEvolutions").checked;                 
    upr_config.updateBaseStats            = document.getElementById("pokemonBaseStatisticsForm_updateBaseStats").checked; 
    upr_config.evosBuffStats              = document.getElementById("pokemonBaseStatisticsForm_staticEvoStatGain").checked;  
    upr_config.baseStatRange              = document.getElementById("pokemonBaseStatisticsForm_randomBTSPercent_slider").value    
    upr_config.dontRandomizeRatio         = document.getElementById("pokemonBaseStatisticsForm_maintainStatRatio").checked;  
   
    /* ABILITIES */

    if (document.getElementById("pokemonAbilities_switch").checked) {
        upr_config.abilitiesMod  = "RANDOMIZE"
    } else {
        upr_config.abilitiesMod  = "UNCHANGED"
    }

    upr_config.allowWonderGuard               = document.getElementById("pokemonAbilities_AllowWonderGuard").checked;
    upr_config.abilitiesFollowEvolutions      = document.getElementById("pokemonAbilities_FollowEvolutions").checked;
    upr_config.banTrappingAbilities           = document.getElementById("pokemonAbilities_BanTrappingAbiliies").checked;
    upr_config.banNegativeAbilities           = document.getElementById("pokemonAbilities_BanNegativeAbilities").checked;
   // = document.getElementById("pokemonAbilities_BanStupidAbilities").checked; 

    /* TYPES */

    if (document.getElementById("pokemonTypes_unchanged".checked)) {
        upr_config.typesMod = "UNCHANGED";
    } else if (document.getElementById("pokemonTypes_RandomFollowEvolutions".checked)) {
        upr_config.typesMod = "RANDOM_FOLLOW_EVOLUTIONS";
    } else if (document.getElementById("pokemonTypes_RandomFollowCompletely".checked)) {
        upr_config.typesMod = "COMPLETELY_RANDOM";
    }

    /* EVOS */

    if (document.getElementById("pokemonEvolutions_switch").checked) {
        upr_config.evolutionsMod = "RANDOM";
    } else {
        upr_config.evolutionsMod = "UNCHANGED";
    }

    upr_config.evosSimilarStrength        = document.getElementById("pokemonEvolutions_similarStrength").checked;
    upr_config.evosSameTyping             = document.getElementById("pokemonEvolutions_sameTypings").checked;
    upr_config.evosMaxThreeStages         = document.getElementById("pokemonEvolutions_limitEvolutionsToThreeStages").checked;
    upr_config.evosForceChange            = document.getElementById("pokemonEvolutions_forceChange").checked;
       
    upr_config.changeImpossibleEvolutions = document.getElementById("pokemonEvolutions_changeImpossibleEvos").checked;
    upr_config.makeEvolutionsEasier       = document.getElementById("pokemonEvolutions_makeEvolutionsEasier").checked;

    /* STARTERS */

    if (document.getElementById("starterPokemon_unchanged".checked)) {
        upr_config.startersMod = "UNCHANGED";       
    } else if (document.getElementById("starterPokemon_randomCompletely".checked)) {
        upr_config.startersMod = "COMPLETELY_RANDOM";
    } else if (document.getElementById("starterPokemon_randomBasicPokemonWithTwoEvolutions".checked)) {
        upr_config.startersMod = "RANDOM_WITH_TWO_EVOLUTIONS";
    } else if (document.getElementById("starterPokemon_randomBasicPokemonWithOneEvolution".checked)) {
        upr_config.startersMod = "RANDOM_WITH_ONE_EVOLUTION";
    } else if (document.getElementById("starterPokemon_randomBasicPokemonWithZeroEvolutions".checked)) {
        upr_config.startersMod = "RANDOM_WITH_NO_EVOLUTIONS";
    } 

    upr_config.banLegendaryStarters  = document.getElementById("starterPokemon_banLegendaryStarters").checked;              
    upr_config.onlyLegendaryStarters = document.getElementById("starterPokemon_onlyLegendaryStarters").checked;   
     
    /* MOVE DATA */

    upr_config.randomizeMovePowers     = document.getElementById("moveData_randomizerMovePower").checked;
    upr_config.randomizeMoveAccuracies = document.getElementById("moveData_randomizerMoveAccuracy").checked
    upr_config.randomizeMovePPs        = document.getElementById("moveData_randomizerMovePP").checked;
    upr_config.randomizeMoveTypes      = document.getElementById("moveData_randomizerMoveTypes").checked; 
    upr_config.updateMoves             = document.getElementById("moveData_UpdateMoves").checked;
    upr_config.updateMovesLegacy       = document.getElementById("moveData_Legacy").checked;

    /* MOVESETS */
    if (document.getElementById("pokemonMovesets_unchanged").checked) {
        upr_config.movesetsMod = "UNCHANGED";
    } else if (document.getElementById("pokemonMovesets_randomPreferringSameType").checked) {
        upr_config.movesetsMod = "RANDOM_PREFER_SAME_TYPE";
    } else if (document.getElementById("pokemonMovesets_randomCompletely").checked) {
        upr_config.movesetsMod = "COMPLETELY_RANDOM";
    } else if (document.getElementById("pokemonMovesets_metronomeOnlyMode").checked) {
        upr_config.movesetsMod = "METRONOME_ONLY";
    }

    upr_config.startWithFourMoves          =   document.getElementById("pokemonMovesets_EveryPokemonStartsWithFourMoves").checked;
    upr_config.reorderDamagingMoves        =   document.getElementById("pokemonMovesets_reorderDamagingMoves").checked;
    upr_config.movesetsForceGoodDamaging   =   document.getElementById("pokemonMovesets_forcePercentOfGoodDamagingMoves").checked;
    upr_config.movesetsGoodDamagingPercent =   document.getElementById("pokemonMovesets_forcePercentOfGoodDamagingMoveSlider").value;

    /* TRAINERS */

    if (document.getElementById("pokemonTrainers_unchanged").checked) {
        upr_config.trainersMod = "UNCHANGED";
    } else if (document.getElementById("pokemonTrainers_random").checked) {
        upr_config.trainersMod = "RANDOM";
    } else if (document.getElementById("pokemonTrainers_typeThemed").checked) {
        upr_config.trainersMod = "TYPE_THEMED";
    }

    upr_config.rivalCarriesStarterThroughout       = document.getElementById("pokemonTrainers_rivalCarriesStarterThroughGame").checked;
    upr_config.trainersUsePokemonOfSimilarStrength = document.getElementById("pokemonTrainers_tryToUsePokemonWithSimilarStrength").checked;
    upr_config.trainersMatchTypingDistribution     = document.getElementById("pokemonTrainers_weightTypesByNumberOfPokemonWithThem").checked;
    upr_config.trainersBlockLegendaries            = document.getElementById("pokemonTrainers_dontUseLegendaries").checked;
    upr_config.trainersBlockEarlyWonderGuard       = document.getElementById("pokemonTrainers_noEarlyWonderGuard").checked;

    upr_config.randomizeTrainerNames            = document.getElementById("pokemonTrainers_randomizeTrainerNames").checked;
    upr_config.randomizeTrainerClassNames       = document.getElementById("pokemonTrainers_randomizeTrainerClassNames").checked;
    upr_config.trainersForceFullyEvolved        = document.getElementById("pokemonTrainers_forceEvolveAtLevel").checked;
    upr_config.trainersForceFullyEvolvedLevel   = document.getElementById("pokemonTrainers_forceEvolveAtLevelSlider").value;
    upr_config.trainersLevelModified            = document.getElementById("pokemonTrainers_percentageLevelModifier").checked;
    upr_config.trainersLevelModifier            = document.getElementById("pokemonTrainers_percentageLevelModifierSlider").value;       

    /* WILD POKEMON */

    if (document.getElementById("wildPokemon_unchanged").checked) {
        upr_config.wildPokemonMod = "UNCHANGED";
    } else if (document.getElementById("wildPokemon_random").checked) {
        upr_config.wildPokemonMod = "RANDOM";
    } else if (document.getElementById("wildPokemon_areaOneToOneMapping").checked) {
        upr_config.wildPokemonMod = "AREA_MAPPING";
    } else if (document.getElementById("wildPokemon_globalOneToOneMapping").checked) {
        upr_config.wildPokemonMod = "GLOBAL_MAPPING";
    }
    
    if (document.getElementById("wildPokemon_none").checked) {
        upr_config.wildPokemonRestrictionMod = "NONE";
    } else if (document.getElementById("wildPokemon_similarStrength").checked) {
        upr_config.wildPokemonRestrictionMod = "SIMILAR_STRENGTH";
    } else if (document.getElementById("wildPokemon_catchEmAllMode").checked) {
        upr_config.wildPokemonRestrictionMod = "CATCH_EM_ALL";
    } else if (document.getElementById("wildPokemon_TypeThemedAreas").checked) {
        upr_config.wildPokemonRestrictionMod = "TYPE_THEME_AREAS";
    }

    upr_config.useTimeBasedEncounters           = document.getElementById("wildPokemon_UseTimeBasedEncounters").checked;
    upr_config.blockWildLegendaries             = document.getElementById("wildPokemon_dontUseLegendaries").checked;
    upr_config.useMinimumCatchRate              = document.getElementById("wildPokemon_setMinimumCatchRate").checked;
    upr_config.minimumCatchRateLevel            = document.getElementById("wildPokemon_setMinimumCatchRateSlider").value;;
    upr_config.randomizeWildPokemonHeldItems    = document.getElementById("wildPokemon_randomizeHeldItems").checked;
    upr_config.banBadRandomWildPokemonHeldItems = document.getElementById("wildPokemon_banBadItems").checked;

    /* STATIC POKEMON */

    if (document.getElementById("staticPokemon_unchanged").checked) {
        upr_config.staticPokemonMod = "UNCHANGED";
    } else if (document.getElementById("staticPokemon_randomLegendaryToLegendary").checked) {
        upr_config.staticPokemonMod = "RANDOM_MATCHING";
    } else if (document.getElementById("staticPokemon_randomCompletely").checked) {
        upr_config.staticPokemonMod = "COMPLETELY_RANDOM";
    }

    /* TM/HM */

    if (document.getElementById("tmsAndHms_tmMoves_unchanged").checked) {
        upr_config.tmsMod = "UNCHANGED";
    } else if (document.getElementById("tmsAndHms_tmMoves_random").checked) {
        upr_config.tmsMod = "RANDOM";
    }

    upr_config.fullHMCompat           = document.getElementById("tmsAndHms_tmMoves_fullHMCompatibility").checked;
    upr_config.tmLevelUpMoveSanity    = document.getElementById("tmsAndHms_tmMoves_tmLevelupMoveSanity").checked;
    upr_config.keepFieldMoveTMs       = document.getElementById("tmsAndHms_tmMoves_keepFieldMoveTMs").checked;
    upr_config.tmsForceGoodDamaging   = document.getElementById("tmsAndHms_tmMoves_forcePercentOfGoodDamagingMoves").checked;
    upr_config.tmsGoodDamagingPercent = document.getElementById("tmsAndHms_tmMoves_forcePercentOfGoodDamagingMovesSlider").value;

    if (document.getElementById("tmsAndHms_TMHMCompatibility_unchanged").checked) {
        upr_config.tmsHmsCompatibilityMod = "UNCHANGED";
    } else if (document.getElementById("tmsAndHms_TMHMCompatibility_randomPreferSameType").checked) {
        upr_config.tmsHmsCompatibilityMod = "RANDOM_PREFER_TYPE";
    } else if (document.getElementById("tmsAndHms_TMHMCompatibility_randomCompletely").checked) {
        upr_config.tmsHmsCompatibilityMod = "COMPLETELY_RANDOM";
    } else if (document.getElementById("tmsAndHms_TMHMCompatibility_fullCompatibility").checked) {
        upr_config.tmsHmsCompatibilityMod = "FULL";
    }

    /* TUTORS */

    if (document.getElementById("moveTutors_moveTutorMoves_unchanged").checked) {
        upr_config.moveTutorMovesMod = "UNCHANGED";
    } else if (document.getElementById("moveTutors_moveTutorMoves_random").checked) {
        upr_config.moveTutorMovesMod = "RANDOM";
    }

    if (document.getElementById("moveTutors_moveTutorCompatibility_unchanged").checked) {
        upr_config.moveTutorsCompatibilityMod = "UNCHANGED";
    } else if (document.getElementById("moveTutors_moveTutorCompatibility_randomPreferSameType").checked) {
        upr_config.moveTutorsCompatibilityMod = "RANDOM_PREFER_TYPE";
    } else if (document.getElementById("moveTutors_moveTutorCompatibility_randomCompletely").checked) {
        upr_config.moveTutorsCompatibilityMod = "COMPLETELY_RANDOM";
    } else if (document.getElementById("moveTutors_moveTutorCompatibility_randomFullCompatibility").checked) {
        upr_config.moveTutorsCompatibilityMod = "FULL";
    }

    upr_config.tutorLevelUpMoveSanity     = document.getElementById("moveTutors_moveTutorMoves_tutorLevelupMoveSanity").checked;
    upr_config.keepFieldMoveTutors        = document.getElementById("moveTutors_moveTutorMoves_keepFieldMoveTutors").checked;
    upr_config.tutorsForceGoodDamaging    = document.getElementById("moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMoves").checked;
    upr_config.tutorsGoodDamagingPercent  = document.getElementById("moveTutors_moveTutorMoves_forcePercentOfGoodDamagingMovesSlider").value;

    /* TRADES */

    if (document.getElementById("inGameTrades_unchanged").checked) {
        upr_config.inGameTradesMod = "UNCHANGED";
    } else if (document.getElementById("inGameTrades_randomizeGivenPokemonOnly").checked) {
        upr_config.inGameTradesMod = "RANDOMIZE_GIVEN";
    } else if (document.getElementById("inGameTrades_randomizeGivenAndRequestedPokemon").checked) {
        upr_config.inGameTradesMod = "RANDOMIZE_GIVEN_AND_REQUESTED";
    }

    upr_config.randomizeInGameTradesNicknames = document.getElementById("inGameTrades_randomizeNicknames").checked;
    upr_config.randomizeInGameTradesOTs       =  document.getElementById("inGameTrades_randomizeOTs").checked;
    upr_config.randomizeInGameTradesIVs       =  document.getElementById("inGameTrades_randomizeIVs").checked;
    upr_config.randomizeInGameTradesItems     =  document.getElementById("inGameTrades_randomizeItems").checked;

    /* FIELD ITEMS */
    if (document.getElementById("fieldItems_unchanged").checked) {
        upr_config.fieldItemsMod = "UNCHANGED";
    } else if (document.getElementById("fieldItems_shuffle").checked) {
        upr_config.fieldItemsMod = "SHUFFLE";
    } else if (document.getElementById("fieldItems_randomize").checked) {
        upr_config.fieldItemsMod = "RANDOM";
    }

    upr_config.banBadRandomFieldItems = document.getElementById("fieldItems_banBadItems").checked;

    /* MISC */
    upr_config.currentMiscTweaks = 0;

    if (document.getElementById("miscTweaks_randomizePCPotion").checked) {
        upr_config.currentMiscTweaks = upr_config.currentMiscTweaks | 32;
    }

    if (document.getElementById("miscTweaks_randomizeNationalDexAtStart").checked) {
        upr_config.currentMiscTweaks = upr_config.currentMiscTweaks | 128;
    }

    if (document.getElementById("miscTweaks_lowerCasePokemonNames").checked) {
        upr_config.currentMiscTweaks = upr_config.currentMiscTweaks | 1024;
    }

    if (document.getElementById("miscTweaks_randomizeCatchingTutorial").checked) {
        upr_config.currentMiscTweaks = upr_config.currentMiscTweaks | 2048;
    }

    if (document.getElementById("miscTweaks_banLuckyEgg").checked) {
        upr_config.currentMiscTweaks = upr_config.currentMiscTweaks | 4096;
    }

    return JSON.stringify(upr_config);
}