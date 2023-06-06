var gWarpRemappingList = 0x083d5788 - 0x08000000;
var gWarpRemappingList_size = 632;

/*
*   THIS IS CURRENTLY UNUSED
*   Offsets auto generated with /tools/inigen
*   Currently the offsets are packaged in the jar. 
*   This file was created so I could pass in the offsets dynamically and keep them all in one place but currently I'm not doing that 
*/
var EMERALD_EX_OFFSETS = 
{
    "[Emerald EX Warp Rando (U)]" : {

        "Game"                              : "SPXW",
        "Version"                           : 0,
        "TableFile"                         : "gba_english",
        "FreeSpace"                         : 0x1A20000,
        "PokedexOrder"                      : 0x382E12,
        "PokemonCount"                      : 1206,
        "PokemonNameLength"                 : 11,
        "PokemonMovesets"                   : 0x3B906C,
        "PokemonTMHMCompat"                 : 0x383F64,
        "PokemonEvolutions"                 : 0x3A173C,
        "StarterPokemon"                    : 0x7D4FC4,
        "StarterItems"                      : 0xCDD5A,
        "TrainerData"                       : 0x369AF8,
        "WildPokemon"                       : 0x750524,
        "TrainerEntrySize"                  : 40,
        "TrainerCount"                      : 0x357,
        "TrainerClassNames"                 : 0x36979C,
        "TrainerClassCount"                 : 66,
        "TrainerClassNameLength"            : 13,
        "TrainerNameLength"                 : 12,
        "DoublesTrainerClasses"             : [34, 46, 55, 56, 57],
        "ItemEntrySize"                     : 44,
        "ItemCount"                         : 604,
        "MoveCount"                         : 754,
        "MoveDescriptions"                  : 0x85762C,
        "MoveNameLength"                    : 13,
        "AbilityNameLength"                 : 13,
        "TmMoves"                           : 0x84C738,
        "MoveTutorData"                     : 0x84AAA0,
        "MoveTutorMoves"                    : 30,
        "ItemImages"                        : 0x84977C,
        "TmPals"                            : [0x19E2160,0x19E20C0,0x19E2318,0x19E2188,0x19E22A0,0x19E22F0,0x19E21D8,0x19E22C8,0x19E2250,0x19E22C8,0x19E2200,0x19E2110,0x19E21D8,0x19E2278,0x19E2138,0x19E21B0,0x19E20E8,0x19E2228,0x19F0C30],
        "IntroCryOffset"                    : 0x30DA4,
        "IntroSpriteOffset"                 : 0x31BC4,
        "ItemBallPic"                       : 59,
        "TradeTableOffset"                  : 0x3D4844,
        "TradeTableSize"                    : 4,
        "TradesUnused"                      : [],
        "CatchingTutorialOpponentMonOffset" : 0xCD39C,
        "CatchingTutorialPlayerMonOffset"   : 0x15B4E8,
        "PCPotionOffset"                    : 0x804F14,
        "StaticPokemonSupport"              : 1,
        "StaticPokemon[]"                   : [
                                                 [0x239C5F,0x239C84,0x239C87,0x239D09,0x239D17],
                                                 [0x239C71,0x239D27,0x239D2A,0x239DAC,0x239DBA],
                                                 [0x23A1CA,0x23A26D,0x23A270,0x23A472,0x23A480],
                                                 [0x23A1DC,0x23A29D,0x23A2A0,0x23A4E5,0x23A4F3],
                                                 [0x23A1EE,0x23A2CD,0x23A2D0,0x23A558,0x23A566],
                                                 [0x23A200,0x23A2FD,0x23A300,0x23A5CB,0x23A5D9],
                                                 [0x23A212,0x23A32D,0x23A330,0x23A63E,0x23A64C],
                                                 [0x23A224,0x23A35D,0x23A360,0x23A6B1,0x23A6BF],
                                                 [0x23A236,0x23A38D,0x23A390,0x23A724,0x23A732],
                                                 [0x23A248,0x23A3BD,0x23A3C0,0x23A797,0x23A7A5],
                                                 [0x23A25A,0x23A3ED,0x23A3F0,0x23A80A,0x23A818],
                                                 [0x263F4B,0x263F59,0x263FB3],
                                                 [0x264021,0x26402F,0x264089],
                                                 [0x25688F,0x256898,0x2568E3],
                                                 [0x261E5D,0x261E66,0x261EB1],
                                                 [0x261F64,0x261F6D,0x261FB8],
                                                 [0x262639,0x262642,0x26268D],
                                                 [0x29B385,0x29B38E],
                                                 [0x21D771,0x21D77A],
                                                 [0x2606A4,0x2606AB],
                                                 [0x2606F6,0x2606FD],
                                                 [0x260748,0x26074F],
                                                 [0x25C8D6,0x25C8DD],
                                                 [0x25C928,0x25C92F],
                                                 [0x26BC3E,0x26BC4C],
                                                 [0x26BACA],
                                                 [0x26BADD],
                                                 [0x290F0F,0x290F1F,0x290F69,0x290F74],
                                                 [0x290D35,0x290D6F,0x290DC4,0x290DCF],
                                                 [0x2920C7,0x2920F6,0x292145,0x292150],
                                                 [0x29220F,0x29221A,0x292264,0x29226F],
                                                 [0x24B604,0x24B607,0x24B689,0x24B69A],
                                                 [0x298F7B,0x298F7E],
                                                 [0x20CB14,0x20CB23],
                                              ],
       "TMTextSpdc[]"                       : [
                                                [3 ,0x24DD8C,"The TECHNICAL MACHINE I handed you contains [move].\\p… … … … … …"],
                                                [4 ,0x249605,"TATE: That TM04 contains... LIZA: [move]!\\pTATE: It’s a move that’s perfect... LIZA: For any POKéMON!\\p… … … … … …"],
                                                [5 ,0x21A625,"All my POKéMON does is [move]... No one dares to come near me...\\pSigh... If you would, please take this TM away..."],
                                                [5 ,0x21A647,"TM05 contains [move]."],
                                                [8 ,0x22499C,"That TM08 contains [move].\\p… … … … … …"],
                                                [9 ,0x215084,"I like filling my mouth with seeds, then spitting them out fast!\\pI like you, so you can have this!\\pUse it on a POKéMON, and it will learn [move].\\pWhat does that have to do with firing seeds? Well, nothing!"],
                                                [24,0x2077D8,"WATTSON: Wahahahaha!\\pI knew it, \\v01\\v05! I knew I’d made the right choice asking you!\\pThis is my thanks - a TM containing [move]!\\pGo on, you’ve earned it!"],
                                                [31,0x24F71B,"TM31 contains [move]! It’s a move so horrible that I can’t describe it."],
                                                [34,0x236180,"That TM34 there contains [move]. You can count on it!\\p… … … … … …"],
                                                [39,0x23BC38,"That TM39 contains [move].\\pIf you use a TM, it instantly teaches the move to a POKéMON.\\pRemember, a TM can be used only once, so think before you use it."],
                                                [40,0x23F313,"TM40 contains [move].\\p… … … … … …"],
                                                [41,0x230C00,"That’s, like, TM41, you know? Hey, it’s [move], you hearing me?\\pHey, now, you listen here, like, I’m not laying a torment on you!"],
                                                [42,0x22D082,"DAD: TM42 contains [move].\\pIt might be able to turn a bad situation into an advantage."],
                                                [47,0x256B22,"STEVEN: Okay, thank you.\\pYou went through all this trouble to deliver that. I need to thank you.\\pLet me see... I’ll give you this TM.\\pIt contains my favorite move, [move]."],
                                                [50,0x226962,"That TM50 contains [move]."]
                                              ],
        "MoveTutorTextSpdc[]"               : [
                                                [4 ,0x2F1379,"Sigh…\\pSOOTOPOLIS’s GYM LEADER is really lovably admirable.\\pBut that also means I have many rivals for his attention.\\pHe’s got appeal with a [move]. I couldn’t even catch his eye.\\pPlease, let me teach your POKéMON the move [move]!"],
                                                [4 ,0x2F139C,"Okay, which POKéMON should I teach [move]?"],
                                                [15,0x2F1311,"I can’t do this anymore!\\pIt’s utterly hopeless!\\pI’m a FIGHTING-type TRAINER, so I can’t win at the MOSSDEEP GYM no matter how hard I try!\\pArgh! Punch! Punch! Punch! Punch! Punch! Punch!\\pWhat, don’t look at me that way! I’m only hitting the ground!\\pOr do you want me to teach your POKéMON [move]?"],
                                                [15,0x2F1364,"I want you to win at the MOSSDEEP GYM using that [move]!"],
                                                [12,0x2F13E1,"I don’t intend to be going nowhere fast in the sticks like this forever.\\pYou watch me, I’ll get out to the city and become a huge hit.\\pSeriously, I’m going to cause a huge explosion of popularity!\\pIf you overheard that, I’ll happily teach [move] to your POKéMON!"],
                                                [12,0x2F1404,"Fine! [move] it is! Which POKéMON wants to learn it?"],
                                                [12,0x2F1434,"For a long time, I’ve taught POKéMON how to use [move], but I’ve yet to ignite my own explosion…\\pMaybe it’s because deep down, I would rather stay here…"],
                                                [29,0x2F1109,"There’s a move that is wickedly cool.\\pIt’s called [move].\\nWant me to teach it to a POKéMON?"],
                                                [8 ,0x2F11D9,"I want all sorts of things! But I used up my allowance…\\pWouldn’t it be nice if there were a spell that made money appear when you waggle a finger?\\pIf you want, I can teach your POKéMON the move [move].\\pMoney won’t appear, but your POKéMON will do well in battle. Yes?"],
                                                [8 ,0x2F122C,"When a POKéMON uses [move], all sorts of nice things happen."],
                                                [7 ,0x2F1171,"Ah, young one!\\pI am also a young one, but I mimic the styles and speech of the elderly folks of this town.\\pWhat do you say, young one? Would you agree to it if I were to offer to teach the move [move]?"],
                                                [7 ,0x2F11C4,"[move] is a move of great depth.\\pCould you execute it to perfection as well as me…?"],
                                                [7 ,0x2F11BA,"Oh, boo! I wanted to teach [move] to your POKéMON!"],
                                                [16,0x2F10A1,"Did you know that you can go from here a long way in that direction without changing direction?\\pI might even be able to roll that way.\\pDo you think your POKéMON will want to roll, too?\\pI can teach one the move [move] if you’d like."],
                                                [24,0x2F1241,"Humph! My wife relies on HIDDEN POWER to stay awake.\\pShe should just take a nap like I do.\\pI can teach your POKéMON how to [move]. Interested?"],
                                                [24,0x2F1294,"I’ve never once gotten my wife’s coin trick right.\\pI would be happy if I got it right even as I teach [move]…"],
                                                [14,0x2F12A9,"When I see the wide world from up here on the roof…\\pI think about how nice it would be if there were more than just one me so I could enjoy all sorts of lives.\\pOf course it’s not possible. Giggle…\\pI know! Would you be interested in having a POKéMON learn [move]?"],
                                                [14,0x2F12CC,"Giggle… Which POKéMON do you want me to teach [move]?"],
                                                [14,0x2F12F2,"Oh, no?\\pA POKéMON can do well in a battle using it, you know."],
                                                [25,0x2F0FFF,"Heh! My POKéMON totally rules! It’s cooler than any POKéMON!\\pI was lipping off with a swagger in my step like that when the CHAIRMAN chewed me out.\\pThat took the swagger out of my step.\\pIf you’d like, I’ll teach the move [move] to a POKéMON of yours."],
                                                [25,0x2F1022,"All right, which POKéMON wants to learn how to [move]?"],
                                                [25,0x2F108C,"I’ll just praise my POKéMON from now on without the [move]."]
                                              ],                                      
        "CheckValueOffset"                  : 0x8B0D60,
        "MD5Hash"                           : "bd096a03683b741555186c7dff5f1ab2",                                      
    }
}

function printAsINI(name) {

    let output =  name + "\u000A";

    let offsets = EMERALD_EX_OFFSETS[name];

    output += createINILine(offsets, "Game"                             , false);  
    output += createINILine(offsets, "Version"                          , false);     
    output += createINILine(offsets, "TableFile"                        , false);       
    output += createINILine(offsets, "FreeSpace"                        , true );       
    output += createINILine(offsets, "PokedexOrder"                     , true );          
    output += createINILine(offsets, "PokemonCount"                     , false);          
    output += createINILine(offsets, "PokemonNameLength"                , false);               
    output += createINILine(offsets, "PokemonMovesets"                  , true );             
    output += createINILine(offsets, "PokemonTMHMCompat"                , true );               
    output += createINILine(offsets, "PokemonEvolutions"                , true );               
    output += createINILine(offsets, "StarterPokemon"                   , true );            
    output += createINILine(offsets, "StarterItems"                     , true );          
    output += createINILine(offsets, "TrainerData"                      , true );         
    output += createINILine(offsets, "WildPokemon"                      , true );         
    output += createINILine(offsets, "TrainerEntrySize"                 , false);              
    output += createINILine(offsets, "TrainerCount"                     , true );          
    output += createINILine(offsets, "TrainerClassNames"                , true );               
    output += createINILine(offsets, "TrainerClassCount"                , false);               
    output += createINILine(offsets, "TrainerClassNameLength"           , false);                    
    output += createINILine(offsets, "TrainerNameLength"                , false);               
    output += createINILine(offsets, "DoublesTrainerClasses"            , false);                   
    output += createINILine(offsets, "ItemEntrySize"                    , false);           
    output += createINILine(offsets, "ItemCount"                        , false);       
    output += createINILine(offsets, "MoveCount"                        , false);       
    output += createINILine(offsets, "MoveDescriptions"                 , true );              
    output += createINILine(offsets, "MoveNameLength"                   , false);            
    output += createINILine(offsets, "AbilityNameLength"                , false);               
    output += createINILine(offsets, "TmMoves"                          , true );     
    output += createINILine(offsets, "MoveTutorData"                    , true );           
    output += createINILine(offsets, "MoveTutorMoves"                   , false);            
    output += createINILine(offsets, "ItemImages"                       , true );        
    output += createINILine(offsets, "TmPals"                           , true );    
    output += createINILine(offsets, "IntroCryOffset"                   , true );            
    output += createINILine(offsets, "IntroSpriteOffset"                , true );               
    output += createINILine(offsets, "ItemBallPic"                      , false);         
    output += createINILine(offsets, "TradeTableOffset"                 , true );              
    output += createINILine(offsets, "TradeTableSize"                   , false);            
    output += createINILine(offsets, "TradesUnused"                     , false);          
    output += createINILine(offsets, "CatchingTutorialOpponentMonOffset", true );                               
    output += createINILine(offsets, "CatchingTutorialPlayerMonOffset"  , true );                             
    output += createINILine(offsets, "PCPotionOffset"                   , true );            
    output += createINILine(offsets, "StaticPokemonSupport"             , false); 
    

    for (let i = 0; i < offsets["StaticPokemon[]"].length; i++) {
        output += createINIStaticPokemonLine(offsets, "StaticPokemon[]", i);
    }

    for (let i = 0; i < offsets["TMTextSpdc[]"].length; i++) {
        output += createINIMoveLine(offsets, "TMTextSpdc[]", i);
    }

    for (let i = 0; i < offsets["MoveTutorTextSpdc[]"].length; i++) {
        output += createINIMoveLine(offsets, "MoveTutorTextSpdc[]", i);
    }

    output += createINILine(offsets, "PokedexOrder"        , true ); // PokedexOrder for the second time? that's bang out of order.                            
    output += createINILine(offsets, "CheckValueOffset"    , true );            
    output += createINILine(offsets, "MD5Hash"             , false); 


    downloadINI(output);

}

function downloadINI(content) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', "zzzzzzz.ini");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function createINIMoveLine(offsets, property, index) {

    let value = offsets[property][index];

    value[1] = defautHexModifier(value[1]);

    return createLine(property, value, true, true);

}

function createINIStaticPokemonLine(offsets, property, index) {

    let value = offsets[property][index];

    value = defautHexModifier(value, true);

    return createLine(property, value, true, true);

}

function createINILine(offsets, property, isHex) {

    let value = offsets[property];
    let isArray = Array.isArray(value);

    value = isHex ? defautHexModifier(value, isArray) : value;

    return createLine(property, value, isArray, isHex);

}

function createLine(property, value, isArray, isCompact) {

    let line = ""

    line += property;
    line += "=";

    value = isArray ? "[" + value + "]" : value
    value = (isArray && !isCompact) ? value.replaceAll(",", ", ") : value;

    line += value;
    line += "\u000A";

    return line;

}

function defautHexModifier(value, isArray) {

    return isArray ? value.map(i => "0x" + i.toString(16).toUpperCase()) : "0x" + value.toString(16).toUpperCase();

}