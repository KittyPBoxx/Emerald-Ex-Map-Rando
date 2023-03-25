// FLAGS 
/*

### EMERALD ###

--- ITEMS

    STEVEN_LETTER    |                        | President Stones room
    DEVON_GOODS      |                        | Steven Cave
    BIKE             |                        | Mauville Bike Store
    GO_GOGGLES       |                        | Lavaridge After Flanary
    DEVON_SCOPE      |                        | Right of fortree
    MAGMA_EMBLEM     |                        | Mt Pyer top  

--- BADGES

    STONE_BADGE      | Hoenn Cut              |
    KNUCKLE_BADGE    | Hoenn Flash            |
    DYNAMO_BADGE     | Hoenn Rock Smash       |
    HEAT_BADGE       | Hoenn Strength         |
    BALANCE_BADGE    | Hoenn Surf             |
    FEATHER_BADGE    | Hoenn Fly              |
    MIND_BADGE       | Hoenn Dive             |
    RAIN_BADGE       | Hoenn Waterfall        |

--- HMS

    CUT              |                        | Cutters House Rustborough
    ROCK_SMASH       |                        | Mauville House
    STRENGTH         |                        | Rusturf Tunnel (after rocksmash)
    SURF             |                        | Petalburg Gym
    FLY              |                        | Bellow Fortree
    DIVE             |                        | Steven House after space center
    WATERFALL        |                        | Scootopolis (after raquaza)

--- STORY

    POKEDEX             |                                    | Littleroot Lab
    RIVAL_1             |                                    | Oldale
    CATCH_TUTTORIAL     |                                    | Petalburg Gym 
    STOLEN_GOODS_1      |                                    | Rustborough (After gym)
    PEKKO               | Rest House, Dewford, devon Corp f1 | Rusturf Tunnle Left(After stolen goods)
    DELIVER_GOODS_1     | Slateport Museum                   | Slateport Shipyard
    DELIVER_GOODS_2     | Above Slateport                    | Slateport Museum Top 
    METEOR_FALLS_MAGMA  |                                    |
    WEATHER_INSTITUTE   |                                    |
    MAGMA_HIDEOUT       |                                    |
    SLATEPORT_SUB       |                                    |
    AQUA_HIDEOUT        |                                    |
    SPACE_CENTER        |                                    | 
    SEAFLOOR_CAVERN     |                                    |
    SCOOTOPOLIS_BATTLE  |                                    |
    CAVE_OF_ORIGIN      | Skypillar                          |
    RAQUAZA_1           |                                    |

*/
/*
    Different combinations of flags are listed that would a flag possible
    If ALL values in ANY of the arrays are present the flag is set true
    
    Warp data contains a single flag, that flag is true then the connection is considered possible. In some cases it may be necasary to fairly specific flags
    these may require many composite flags. Or it many composite flags may trigger that specific flag.
    
    NB: This list is not comprehensive. If a progression flag is not in the list that basically means that the randomiser will never lock progression behind that connection
    i.e if I haven't told it a connection becomes possible after a hm/item e.t.c it will assume it never become possible
    This ensures the game should always be completeable. As more flags are added more complex maps randomisations can be generated.  

    NB 2: Some gyms require a specific hm to complete e.g celadon gym needs cut, olivine and blackthorn need strength e.t.c
    However I've not yet included those in the conditions
*/

var COMPOSITE_FLAGS = {

    // ITEMS
    "BIKE_1"           : { "flag":"BIKE"            , "condition" : ["L_MAUVILLE_BIKE_SHOP"]                                                                                         },
    "GO_GOGGLES"       : { "flag":"GO_GOGGLES"      , "condition" : ["L_RUSTBORO_CITY_GYM", "L_DEWFORD_TOWN_GYM", "L_MAUVILLE_CITY_GYM", "L_LAVARIDGE_TOWN_GYM", "L_LAVARIDGE_TOWN"] },
    "DEVON_SCOPE"      : { "flag":"DEVON_SCOPE"     , "condition" : ["L_DEVEN_CORP_PRESIDENT_OFFICE"]                                                                                },
        
    // HMS

    "HOENN_CUT_1"        : { "flag": "HOENN_CUT"        , "condition"  : ["L_RUSTBORO_CITY_GYM", "L_CUTTERS_HOUSE"]                        }, 

    "HOENN_ROCK_SMASH_1" : { "flag": "HOENN_ROCK_SMASH" , "condition"  : ["L_RUSTBORO_CITY_GYM", "L_DEWFORD_TOWN_GYM", "L_MAUVILLE_CITY_GYM", "L_MAUVILLE_CITY_ROCK_SMASH"]     },

    "HOENN_STRENGTH_1"   : { "flag": "HOENN_STRENGTH"     , "condition"  : ["L_RUSTURF_TUNNEL", "HOENN_ROCK_SMASH"]                                                                         },

    "HOENN_SURF"         : { "flag": "HOENN_SURF"         , "condition"  : ["L_RUSTBORO_CITY_GYM", "L_DEWFORD_TOWN_GYM", "L_MAUVILLE_CITY_GYM", "L_LAVARIDGE_TOWN_GYM", "L_PETALBURG_GYM"] },

    // TODO: no dive connections have been added yet
    "HOENN_DIVE"       : { "flag": "HOENN_DIVE"         , "condition"  : ["L_RUSTBORO_CITY_GYM", "L_DEWFORD_TOWN_GYM", "L_MAUVILLE_CITY_GYM", "L_LAVARIDGE_TOWN_GYM", "L_PETALBURG_GYM", "L_FORTREE_CITY_GYM", "L_MOSSDEEP_CITY_GYM", "L_MOSSDEEP_STEVEN_HOUSE", "L_SPACE_CENTER_TOP"] },

    //"HOENN_WATERFALL"  : { "flag": "HOENN_WATERFALL"   , "condition"   : ["L_RUSTBORO_CITY_GYM", "L_DEWFORD_TOWN_GYM", "L_MAUVILLE_CITY_GYM", "L_LAVARIDGE_TOWN_GYM", "L_PETALBURG_GYM", "L_FORTREE_CITY_GYM", "L_MOSSDEEP_CITY_GYM", "L_SOOTOPOLIS_CITY_GYM", "L_ICE_PATH_F1"] },
    // TODO Also all the flags you need to get waterfall in emerald

    // STORY
    "HOENN_POKEDEX"        : { "flag": "HOENN_POKEDEX"        , "condition"  : ["L_OLDALE_TOWN"]     },
    "HOENN_CATCH_TUTORIAL" : { "flag": "HOENN_CATCH_TUTORIAL" , "condition"  : ["L_PETALBURG_GYM"]                  },
    "TALK_TO_STONE"        : { "flag": "TALK_TO_STONE"        , "condition"  : ["L_PRESIDENTS_OFFICE"]              },
    "UNLOCK_SLATEPORT"     : { "flag": "UNLOCK_SLATEPORT"     , "condition"  : ["L_GRANITE_STEVEN"]                 },
    "RESCUE_PICO"          : { "flag": "RESCUE_PICO"          , "condition"  : ["L_RUSTBORO_CITY_GYM", "L_RUSTBORO", "L_RUSTURF_TUNNEL"]                                                                         },
    "NEW_MAUVILL"          : { "flag": "NEW_MAUVILL"          , "condition"  : ["L_RUSTBORO_CITY_GYM", "L_DEWFORD_TOWN_GYM", "L_MAUVILLE_CITY_GYM", "L_LAVARIDGE_TOWN_GYM", "L_PETALBURG_GYM", "L_MAUVILLE_CITY"]}

}

//TODO: strength for chuck and clair
//TODO: cut for erika

var LOCATIONS_TRIGGER = {

    "E,11,2,0" : "L_PRESIDENTS_OFFICE",
    "E,24,7,0" : "L_GRANITE_CAVE_F1",
    "E,0,2,0"  : "L_MAUVILLE_CITY",
    "E,0,3,3"  : "L_RUSTBORO",
    "E,10,1,0" : "L_MAUVILLE_BIKE_SHOP",
    "E,17,1,0" : "L_ROUTE_104_FLOWER_SHOP",
    "E,1,4,0"  : "L_BIRCH_LAB",
    "E,0,10,2" : "L_OLDALE_TOWN",
    "E,0,4,0"  : "L_DEVON_CORP_PRESIDENT_OFFICE",
    "E,11,11,0": "L_CUTTERS_HOUSE",
    "E,24,10,0": "L_GRANITE_STEVEN",
    "E,0,12,1" : "L_LAVARIDGE_TOWN",
    "E,10,2,0" : "L_MAUVILLE_CITY_ROCK_SMASH",
    "E,24,4,0" : "L_RUSTURF_TUNNEL",
    "E,14,7,0" : "L_MOSSDEEP_STEVEN_HOUSE",
    "E,14,10,0": "L_SPACE_CENTER_TOP",
    "E,15,0,0" : "L_SOOTOPOLIS_CITY_GYM",
    "E,11,3,0" : "L_RUSTBORO_CITY_GYM",
    "E,3,3,0"  : "L_DEWFORD_TOWN_GYM",
    "E,10,0,0" : "L_MAUVILLE_CITY_GYM",
    "E,4,1,0"  : "L_LAVARIDGE_TOWN_GYM",
    "E,8,1,0"  : "L_PETALBURG_GYM",
    "E,12,1,0" : "L_FORTREE_CITY_GYM",
    "E,14,0,0" : "L_MOSSDEEP_CITY_GYM",
}

var KEY_LOCATIONS = {
    "E,16,0,0" : "L_HOENN_LEAGUE_1",
    "E,16,1,0" : "L_HOENN_LEAGUE_2",
    "E,16,2,0" : "L_HOENN_LEAGUE_3",
    "E,16,3,0" : "L_HOENN_LEAGUE_4",
    "E,16,4,0" : "L_HOENN_LEAGUE_CHAMP",
    "E,24,107,0" : "L_STEVEN_FINAL_BOSS"
}

var FLAG_DATA = {
    "LOCATIONS_TRIGGER" : LOCATIONS_TRIGGER,
    "COMPOSITE_FLAGS" : COMPOSITE_FLAGS,
    "KEY_LOCATIONS" : KEY_LOCATIONS
}