var mixedGameData = {};
Object.entries(EMERALD_WARPS).forEach(e => mixedGameData[e[0]] = e[1]);

var remappingsData = {};
var isHeadless = true;

// WarpList used by EmulationCoreHacks.js
var warpList = new Map();

function getMapData() {
    return mixedGameData;
}

function getRandomisationAlgorithm() {
    return generateRandomMappings;
}

function getRandomisationConfig() {
    let config = {};
    config.hoennLevel = document.getElementById("hoennLevel").value;
    return config;
}

function getFlagData() {
  return FLAG_DATA;
}

function mappingToWarps(mappingData) {
    let mappedList = new Map();

    mappingData.forEach(mapping => {
        let from = mapping.trigger;
        let to = mapping.target;
        let toParts = to.split(",");
        mappedList.set(from, new PKWarp(from, toParts[0], toParts[1], toParts[2], toParts[3], mapping.source));
    });

    return mappedList;
}

async function mapWarps(seed) {

    flagsState = {};
    unaddedConditionalEdges = {};

    let config = getRandomisationConfig();
    let mapData = getFilteredData();
    let flagData = getFlagData()
    remappingsData = getRandomisationAlgorithm().apply(null, [seed, mapData, flagData, config]);
    warpList = mappingToWarps(getAugmetedRemappingData(remappingsData));
    updateHashDisplay();

    if (typeof storageManager !== 'undefined') {
      storageManager.persist("RANDOM_MAPPING", new WarpListData(seed, config, warpList));
    }
}

function generateRandomMappings(seed, mapData, flagData, config) {
    
    let rng = new RNG(getHash(seed));
    let progressionState = initMappingGraph(mapData, isHeadless, new ProgressionState(flagData, config))

    var root = getInitialWarp(config);

    progressionState.unconnectedComponents = progressionState.unconnectedComponents.filter(a => !a.includes(root));

    var moreWarpsToMap = true;
    while(moreWarpsToMap) {
        moreWarpsToMap = doNextMapping(rng, root, progressionState);
        progressionState = updateProgressionState(progressionState, root);
    }

   return getBaseRemappingData();
}

function getInitialWarp(config) {
  return KEY_LOCATION_DATA["OLDALE TOWN"];
}

function filterIgnored(mapData) {
    return new Map([...mapData].filter(k => !k[1].ignore));
}

function filterByConfig(usabledWarps, config) {
    usabledWarps = new Map([...usabledWarps].filter(w => {
        let filterLevel = null;
        if (w[0][0] == "E") {
            filterLevel = config.hoennLevel;
        } else if (w[0][0] == "F") {
            filterLevel = config.kantoLevel;
        } else if (w[0][0] == "C") {
            filterLevel = config.johtoLevel;
        }

        return usabledWarps.get(w[0]).level && (+usabledWarps.get(w[0]).level <= +filterLevel);
    }));
    return usabledWarps;
}

function filteGroupedNotMain(mapData) {
    return new Map([...mapData].filter(k => k[1].groupMain || !k[1].grouped));
} 

function toMapBank(s) { 
    let arr = s.split(","); 
    return arr[0] + "," + arr[1] + "," + arr[2] 
}

function ProgressionState(flagData, config) {
  this.remainingConditionalEdges = new Set();
  this.flags = new Set();
  this.flagData = flagData;
  this.config = config;
  // Locations that may grant further progress
  this.unmarkedLocations = new Map(Object.entries(flagData.LOCATIONS_TRIGGER));
  this.unmarkedFlags = new Map(Object.entries(flagData.COMPOSITE_FLAGS));
  // Locations that will not grant progress but should be included anyway
  this.unmarkedKeyLocations = new Map(Object.entries(flagData.KEY_LOCATIONS))
}

ProgressionState.prototype.makeFinalLocationsKey = function (config) {

  let finalLocations = [];

  switch(this.config.hoennLevel) {
    case "1": finalLocations.push(HINTABLE_LOCATIONS["ROXANNE"])      ; break;
    case "2": finalLocations.push(HINTABLE_LOCATIONS["BRAWLY"])       ; break;
    case "3": finalLocations.push(HINTABLE_LOCATIONS["WATTSON"])      ; break; 
    case "4": finalLocations.push(HINTABLE_LOCATIONS["FLANNERY"])     ; break;
    case "5": finalLocations.push(HINTABLE_LOCATIONS["NORMAN"])       ; break;
    case "6": finalLocations.push(HINTABLE_LOCATIONS["WINONA"])       ; break;
    case "7": finalLocations.push(HINTABLE_LOCATIONS["TATE AND LIZA"]); break;
    case "8": finalLocations.push(HINTABLE_LOCATIONS["JUAN"])         ; break;
    case "9": 
    case "0": 
    case "10": 
    default:
      // E4 and upwards are key locations not progression anyway  
      break;
  }

  finalLocations.forEach(l => {
    if (this.unmarkedLocations.has(l)) {
      this.unmarkedKeyLocations.set(l, this.unmarkedLocations.get(l))
      this.unmarkedLocations.delete(l);
    }
  })

}

/** 
 *  Warp data model
 */
function WarpListData(seed, config, warpList) {
  this.warpList = Array.from(warpList.entries());
  this.seed = seed;
  this.config = config;
} 

function exportMapping() {
  storageManager.find("RANDOM_MAPPING").then(s => {
      let data = JSON.stringify(s);
      let file = new File([data], "WarpMapping.json", {type: "application/json;charset=utf-8"});
      saveAs(file);
  });
}

function importMapping() {
  let file = this.files[0];

  let reader = new FileReader();
  reader.readAsText(file,'UTF-8');

  reader.onload = readerEvent => {
      let content = readerEvent.target.result;
      let warpListData = JSON.parse(content);
      updateWarpListData(warpListData);
      storageManager.persist("RANDOM_MAPPING", warpListData);
   }
}

function updateWarpListData(warpListData) {
  document.getElementById("input_seed_text").value = warpListData.seed;

  document.getElementById("hoennLevel").value = warpListData.config.hoennLevel;
  M.FormSelect.getInstance(document.getElementById("hoennLevel"))._handleSelectChangeBound();

  warpList = new Map(warpListData.warpList);
  updateHashDisplay();
}

function updateHashDisplay() {
  document.getElementById("hashText").innerHTML = "CHECK: " + Math.abs(getHash(JSON.stringify(Array.from(warpList)))).toString(16).toUpperCase();
}

/**
 *  Warp Script model 
 */
 function PKWarp(trigger, romCode, bank, map, warpNo, source) {
    this.trigger = trigger;
    this.toRomCode = romCode;
    this.toBank = bank;
    this.toMap = map;
    this.toWarpNo = warpNo;
    this.source = source;
}

/**
 *  SEEDED RNG MANAGEMENT
 */

function getHash(input){
    var hash = 0, len = input.length;
    for (var i = 0; i < len; i++) {
      hash  = ((hash << 5) - hash) + input.charCodeAt(i);
      hash |= 0; // to 32bit integer
    }
    return hash;
}

function RNG(seed) {
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;
  
    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}
RNG.prototype.nextInt = function() {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
}
RNG.prototype.nextFloat = function() {
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1);
}
RNG.prototype.nextRange = function(start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start;
  var randomUnder1 = this.nextInt() / this.m;
  return Math.abs(start + Math.floor(randomUnder1 * rangeSize));
}
RNG.prototype.choice = function(array) {
  return array[this.nextRange(0, array.length)];
}

/**
 *  GRAPHING / CONNECTION MANAGEMENT
 */

 function ReigonNode(id) {
    this.data = {};
    this.data.id = id;
    this.classes = 'reigon';
}

function AreaNode(node) {
    this.data = {};
    this.data.id = toMapBank(node[0]);
    this.data.isMap = true;
    this.data.parent = toReigon(node[0]);
    this.data.label = node[0] + " (" + node[1].name.split("-")[0] + "- " + node[1].name.split("-")[1].trim() + ")";
}

function WarpNode(data) {
    this.data = {};
    this.data.id = data[0];
    this.data.parent = toMapBank(data[0]);
    this.data.label = data[1].name ? data[0] + data[1].name.split("-")[2] : data[0] + " (Unnamed)";
    this.classes = 'outline';
    this.data.isWarp = true;
    this.data.isMapped = false;
    this.data.needsReturn = data[1].tags && data[1].tags.includes("needs_return");
    this.data.noReturn = data[1].tags && data[1].tags.includes("no_return");
    this.data.hasMultipleConnections = data[1].connections ? Object.values(data[1].connections).filter(n => n == true).length > 0 : false;
}

function FixedEdge(source, target) {
    this.data = {};
    this.data.id = source + "->" + target;
    this.data.source = source;
    this.data.target = target;
    this.classes = 'fixed';
}

function CondidtionalEdge(source, target, condition) {
  this.data = {};
  this.data.id = source + "->" + target;
  this.data.source = source;
  this.data.target = target;
  this.classes = 'conditional';
  this.condition = condition;
}

function WarpEdge(source, target, count) {
  this.data = {};
  this.data.id = source + "->" + target + "#" + window.cy.getElementById(source + "->" + target).length;
  this.data.source = source;
  this.data.target = target;
  this.data.isWarp = true;
  this.classes = 'warp';
}

function getAugmetedRemappingData(remappingData) {

  remappingData = addGroupedMappings(remappingData);
  remappingData = addTriggerData(remappingData);

  return remappingData;
}

function addGroupedMappings(remappingData) {
  
  let groupMappings = [];

  remappingData.forEach(m => {
    let groups = getMapData()[m.source].grouped;
    if (groups) {
      groups.forEach(g => {
        groupMappings.push({source: g, target: m.target});
      });
    }
  })

  return [...remappingData, ...groupMappings];
}

function addTriggerData(remappingData) {

  return remappingData.map(m => {
    m.trigger = getMapData()[m.source].to;
    return m;
  });

}

function getBaseRemappingData() {
  return cy.edges().filter(e => e.data().isWarp).map(e => { return {source: e.data().source, target: e.data().target} });
}

function getFilteredData() {
    let warpIdData = new Map(Object.entries(getMapData()));
    warpIdData = filterIgnored(warpIdData);
    warpIdData = filteGroupedNotMain(warpIdData);
    warpIdData = filterByConfig(warpIdData, getRandomisationConfig());
    return warpIdData;
}

function toReigon(id) {
  return 'HOENN'
}

function findAccessibleUnmappedNodes(cy, root) {
  let nodeSet = new Set();
  cy.elements().bfs({roots: cy.getElementById(root), directed: true, visit: (v, e, u, i, depth) => {
    
    if(!v.data().isMapped) {
      nodeSet.add(v)
    }

  }});
  return nodeSet;
}

function doNextMapping(rng, root, progressionState) {
    let accessibleNodes = progressionState.cachedNodes ? progressionState.cachedNodes : findAccessibleUnmappedNodes(window.cy, root);
    let inacessibleNodes = cy.nodes().not(accessibleNodes).filter(e => e.data().isWarp && !e.data().isMapped);
    let inaccesibleFlagLocations = inacessibleNodes.filter(n => progressionState.unmarkedLocations.has(n.data().id));
    let inaccesibleKeyLocations = inacessibleNodes.filter(n => progressionState.unmarkedLocations.has(n.data().id));

    if(accessibleNodes.size == 0 && inacessibleNodes.length == 0) { 
      return false; 
    }

    let warp1 = [...accessibleNodes][rng.nextRange(0, accessibleNodes.size - 1)];
    accessibleNodes.delete(warp1);
    
    let warp2 = null;
    let shouldCacheNodes = false;
    let inacessibleHubs = inacessibleNodes.filter(e => e.degree(true) > 0);

    if (progressionState.unconnectedComponents.length > 0) {

      // Add a node from every component of the graph (with the assumption no warps are present but all flags are met)
      let randomComponent = progressionState.unconnectedComponents[rng.nextRange(0, progressionState.unconnectedComponents.length - 1)];
      let randomNodeIdFromComponent = selectRandomWarp(rng, randomComponent, warp1);

      warp2 = cy.getElementById(randomNodeIdFromComponent);
      progressionState.unconnectedComponents = progressionState.unconnectedComponents.filter(c => c != randomComponent);

    } else if (inaccesibleFlagLocations.length > 0) { 

      // Add inacessible dead-ends that might allow flags givinb access to new locations
      warp2 = selectRandomWarp(rng, inaccesibleFlagLocations, warp1);
      warp2.addClass("significant");

    } else if (inacessibleHubs.length > 0) {

      // Add any hubs that there is still no access to... I'm not sure there would even be any left...
      inacessibleNodes = inacessibleNodes.filter(e => e.degree(true) > 0);
      warp2 = selectRandomWarp(rng, inacessibleNodes, warp1);

    } else if (inaccesibleKeyLocations.length > 0) {

      // Add key inacessible locations 
      warp2 = selectRandomWarp(rng, inaccesibleKeyLocations, warp1); 
      shouldCacheNodes = true;
      accessibleNodes.delete(warp2);
      warp2.addClass("significant");

    } else if (inacessibleNodes.length > 0) {

      // Add other inacessible dead-ends 
      warp2 = selectRandomWarp(rng, inacessibleNodes, warp1); 
      shouldCacheNodes = true;
      accessibleNodes.delete(warp2);

    } else if (accessibleNodes.size > 0) {

      // map together nodes that are already accessible
      warp2 = selectRandomWarp(rng, [...accessibleNodes], warp1);
      shouldCacheNodes = true;
      accessibleNodes.delete(warp2);

    } else {
      //console.warn("Unevenly matched warps. " + warp1.data().id + " had to map to itself");
      // warp2 = warp1

      // if one warp is left hanging we connect it to altering cave from fire red
      warp2 = cy.add(new WarpNode(['E,24,106,0', getMapData()["E,24,106,0"]]));
      shouldCacheNodes = true;
      accessibleNodes.delete(warp2);

    }

    // Once it's only dead ends left we can cache which nodes are accessible from the root 
    if (shouldCacheNodes && !progressionState.cachedNodes) {
        progressionState.cachedNodes = accessibleNodes;
    }

    if (!warp1) {
      
      if (accessibleNodes.size != 0) {
        console.log("Some accessible nodes were left:")
        accessibleNodes.forEach(n => {
          console.log(n.data().id)
        })
      } else {
        console.log("All accesible nodes mapped")
      }

      if (inacessibleNodes.size != 0) {
        console.log("Some inaccessible nodes were left:")
        inacessibleNodes.forEach(n => {
          console.log(n.data().id)
        })

        warp2.data().isMapped = true;
        return false;

      } else {
        console.log("All inaccesible nodes mapped")
      }

    }

    window.cy.add(new WarpEdge(warp1.data().id, warp2.data().id))

    if (warp1 != warp2) {
          window.cy.add(new WarpEdge(warp2.data().id, warp1.data().id))
    }
    
    warp1.data().isMapped = true;
    warp2.data().isMapped = true;

    return true;
}

function selectRandomWarp(rng, listOfWarps, connectingWarp) {

    // Some warps do not allow bi-directional travel 
    // Some warps need to be accessible in reverse not to block map access. i.e a warp tile you have to walk over to get somewhere
    // We need to make sure those don't get matched together
    let warpNeedsReturn = connectingWarp.data().needsReturn;
    let warpNoReturn = connectingWarp.data().noReturn;

    if (warpNeedsReturn) {
      listOfWarps = listOfWarps.filter(w => !w.data().noReturn);
    } else if (warpNoReturn) {
      listOfWarps = listOfWarps.filter(w => !w.data().needsReturn);
    }

    return listOfWarps[rng.nextRange(0, listOfWarps.length - 1)];
}


function updateProgressionState(updateProgressionState, root) {

  let currentNodes = new Set();
  cy.elements().bfs({roots: cy.getElementById(root), directed: true, visit: (v, e, u, i, depth) => { 
    currentNodes.add(v.data().id) 
  }});

  updateProgressionState.unmarkedLocations.forEach((name, location) => {
    if (currentNodes.has(location)) {
      updateProgressionState.unmarkedLocations.delete(location);
      updateProgressionState.flags.add(name);
    }
  });

  updateProgressionState.unmarkedFlags.forEach(n => {
    if (n.condition.every(flag => updateProgressionState.flags.has(flag))) {
      updateProgressionState.flags.add(n.flag);
      updateProgressionState.unmarkedFlags.delete(n.flag)
    }
  });

  let conditionalEdges = updateProgressionState.remainingConditionalEdges;
  conditionalEdges.forEach(e => {
    if (updateProgressionState.flags.has(e.condition)) {
      if (cy.getElementById(e.data.target).length > 0 && cy.getElementById(e.data.source).length > 0) {
        cy.add(e);
      }
      conditionalEdges.delete(e);
    }
  });

  return updateProgressionState;
}

function initMappingGraph(mapData, isHeadless, progressionState) {

  var cy = window.cy = cytoscape({
      container: isHeadless ? null : document.getElementById('cy'),
      headless: isHeadless,
      styleEnabled: !isHeadless,
      boxSelectionEnabled: false,
      textureOnViewport: true,
    
      style: [
        {
          selector: 'node',
          css: {
            'content': 'data(id)',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        },
        {
          selector: ':parent',
          css: {
            'text-valign': 'top',
            'text-halign': 'center'      
          },
          style: {
            'shape' : 'roundrectangle',
          }
        },
        {
          selector: 'edge',
          css: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
          }
        },
        {
          'selector': 'node[label]',
          'style': {
            'label': 'data(label)',
            'text-valign': 'bottom',
            'text-halign': 'center'
          }
        },
        {
          selector: '.reigon',
          css: {
              'background-color': '#2f3138',
              'color' : '#C0C0C0',
              'font-size' : '5em',
              "text-valign": "top"
          },
        },
        {
          selector: '.map-E',
          css: {
              'background-color': '#262729',
              'color' : '#C0C0C0',
              'font-size' : '2em'
          }
        },
        {
          selector: '.warp',
          css: {
            'line-color': '#f92411',
            "curve-style": "straight-triangle",
          }
        },
        {
          selector: '.conditional',
          css: {
            'line-color': '#1911f9'
          }
        },
        {
          selector: '.fixed',
          css: {
            'opacity': '0.5'
          }
        },
        {
          selector: '.significant',
          css: {
            'background-color': '#FFD700',
            'shape' : 'hexagon'
          }
        },
        {
          selector: '.indoors',
          css: {
              'background-color': '#543d48',
          }
        },
        {
          selector: '.faded',
          css: {
            opacity: 0.2,
            'line-color': '#24080c'
          }
        },
      ],
    
      elements: {
        nodes: [],
        edges: []
      }
    });


    cy.add(new ReigonNode("HOENN"));

    let data = [...mapData];

    // Add the nodes
    data.forEach(d => {

      if (!cy.getElementById(toMapBank(d[0])).length) {
          cy.add(new AreaNode(d)).addClass("map-" + d[0][0]);
      }

      cy.add(new WarpNode(d));
    })

    // Add fixed edges
    data.forEach(d => {

      let connections = d[1].connections ? d[1].connections : {};

      Object.entries(connections).forEach(entry => {

        if (typeof entry[1] == 'string') {

          // Conditional Connection
          progressionState.remainingConditionalEdges.add(new CondidtionalEdge(d[0], entry[0], entry[1]));

          // Temporarily add conditional edges in the graph so we can work out what areas will be connected in future
          if (cy.getElementById(entry[0]).length > 0) {
            cy.add(new CondidtionalEdge(d[0], entry[0], entry[1]))
          }

        } else {

          // Fixed Connection       

          // Only draw path if connection node is present in total list of warps
          // i.e if I'm only doing warps to first gym, don't draw a connection to a gym 2 level warp 
          if (cy.getElementById(entry[0]).length > 0) {
            cy.add(new FixedEdge(d[0], entry[0]))
          }
        }
      });
    });

    // calculate future connected areas then remove all conditional edges from the network
    progressionState.unconnectedComponents = cy.elements().components()
                                                          .filter(e => e.size() > 1)
                                                          .map(e => e.toArray().filter(n => n.group() == "nodes" && n.data().isWarp && n.data().hasMultipleConnections).map(p => p.data().id))
                                                          .filter(arr => arr.length > 0);
    progressionState.remainingConditionalEdges.forEach(node => cy.getElementById(node.data.id).remove());

    cy.nodes().forEach(function(node){
      node.css("width", 80);
      node.css("height", 80);
    });

    if (!isHeadless) {
        cy.layout({name: 'preset', nodeDimensionsIncludeLabels: true, positions:nodeToPosition}).run();
    }

    progressionState.makeFinalLocationsKey();
    return progressionState;
}

/* HINTS */
function getHint(location) {
  let mapData = new Map(Object.entries(getMapData()));
  let warp = warpList.get(mapData.get(location).to);
  if (!warp) {
    return "NOT PRESENT";
  }
  let info = mapData.get(warp.toRomCode + "," + warp.toBank + "," + warp.toMap + "," + warp.toWarpNo).name;
  let hint = warp.toRomCode == "E" ? "HOENN - " : (warp.toRomCode == "C" ? "JOHTO - " : "KANTO - ");
  return hint + info.split("-")[0].trim() + " - " + info.split("-")[1].trim();
}

var HINTABLE_LOCATIONS = {
  "ROXANNE"          : "E,11,3,0"  ,
  "BRAWLY"           : "E,3,3,0"   ,
  "WATTSON"          : "E,10,0,0"  ,
  "FLANNERY"         : "E,4,1,0"   ,
  "NORMAN"           : "E,8,1,0"   ,
  "WINONA"           : "E,12,1,0"  ,
  "TATE AND LIZA"    : "E,14,0,0"  ,
  "JUAN"             : "E,15,0,0"  , 
  "E4 SIDNEY"        : "E,16,0,0"  ,
  "E4 PHOEBE"        : "E,16,1,0"  ,
  "E4 GLACIA"        : "E,16,2,0"  ,
  "E4 DRAKE"         : "E,16,3,0"  ,
  "CHAMPION WALLACE" : "E,16,4,0"  ,
  "STEVEN"           : "E,24,107,0",
}

var MAP_SCALE = 100;
var OUTSIDE_MAP_SCALE = 30;
var INSIDE_MAP_SCALE = 10;

var MAP_BANK_POSITION = {

  // TOWNS
  "0,0" : {x: MAP_SCALE * 16,  y: MAP_SCALE * 88 } , // Petalburg
  "0,1" : {x: MAP_SCALE * 72,  y: MAP_SCALE * 96 } , // Slateport
  "0,2" : {x: MAP_SCALE * 72,  y: MAP_SCALE * 64 } , // Mauville
  "0,3" : {x: MAP_SCALE * 8,   y: MAP_SCALE * 56 } , // Rustboro
  "0,4" : {x: MAP_SCALE * 104, y: MAP_SCALE * 16 } , // Fortree
  "0,5" : {x: MAP_SCALE * 152, y: MAP_SCALE * 40 } , // Lilycove
  "0,6" : {x: MAP_SCALE * 200, y: MAP_SCALE * 56 } , // Mossdeep
  "0,7" : {x: MAP_SCALE * 176, y: MAP_SCALE * 72 } , // Sootopolis
  "0,8" : {x: MAP_SCALE * 224, y: MAP_SCALE * 80 } , // Evergrande
  "0,9" : {x: MAP_SCALE * 40,  y: MAP_SCALE * 68 } , // little root
  "0,10": {x: MAP_SCALE * 40,  y: MAP_SCALE * 88 } , // oldale
  "0,11": {x: MAP_SCALE * 24,  y: MAP_SCALE * 128} , // dewford
  "0,12": {x: MAP_SCALE * 48,  y: MAP_SCALE * 40 } , // lavaridge
  "0,13": {x: MAP_SCALE * 32,  y: MAP_SCALE * 16 } , // fallarbour
  "0,14": {x: MAP_SCALE * 40,  y: MAP_SCALE * 64 } , // verdanturf
  "0,15": {x: MAP_SCALE * 144, y: MAP_SCALE * 96 } , // pacifidlog

  // ROUTES

  "0,19"  : {x: MAP_SCALE * 5  , y: MAP_SCALE * 82 }, // r104
  "0,20"  : {x: MAP_SCALE * 8  , y: MAP_SCALE * 100}, // r105
  "0,21"  : {x: MAP_SCALE * 8  , y: MAP_SCALE * 120}, // r106
  "0,23"  : {x: MAP_SCALE * 30 , y: MAP_SCALE * 128}, // r108
  "0,24"  : {x: MAP_SCALE * 72 , y: MAP_SCALE * 115}, // r109
  "0,25"  : {x: MAP_SCALE * 72 , y: MAP_SCALE * 70} , // r110
  "0,26"  : {x: MAP_SCALE * 72 , y: MAP_SCALE * 27} , // r111
  "0,27"  : {x: MAP_SCALE * 62 , y: MAP_SCALE * 30} , // r112
  "0,28"  : {x: MAP_SCALE * 40 , y: MAP_SCALE * 16} , // r113
  "0,29"  : {x: MAP_SCALE * 15 , y: MAP_SCALE * 16} , // r114
  "0,30"  : {x: MAP_SCALE * 8  , y: MAP_SCALE * 45} , // r115
  "0,31"  : {x: MAP_SCALE * 8  , y: MAP_SCALE * 54} , // r116
  "0,32"  : {x: MAP_SCALE * 50 , y: MAP_SCALE * 64} , // r117
  "0,34"  : {x: MAP_SCALE * 90 , y: MAP_SCALE * 16} , // r119
  "0,35"  : {x: MAP_SCALE * 124, y: MAP_SCALE * 16} , // r120
  "0,36"  : {x: MAP_SCALE * 132, y: MAP_SCALE * 40} , // r121
  "0,37"  : {x: MAP_SCALE * 132, y: MAP_SCALE * 45} , // r122
  "0,38"  : {x: MAP_SCALE * 122, y: MAP_SCALE * 64} , // r123
  "0,39"  : {x: MAP_SCALE * 172, y: MAP_SCALE * 40} , // r124
  "0,40"  : {x: MAP_SCALE * 200, y: MAP_SCALE * 46} , // r125
  "0,46"  : {x: MAP_SCALE * 155, y: MAP_SCALE * 96 }, // r131

  // // UNDERWATER

  "0,51"   : {x: MAP_SCALE * 1, y: MAP_SCALE * 150},
  "0,53"   : {x: MAP_SCALE * 2, y: MAP_SCALE * 150},
  "24,5"   : {x: MAP_SCALE * 3, y: MAP_SCALE * 150},
  "24,26"  : {x: MAP_SCALE * 4, y: MAP_SCALE * 150},

  // LOCATIONS

    // Meteor Falls
  "24,0"  : {x: MAP_SCALE * 10, y: MAP_SCALE * 150},
  "24,1"  : {x: MAP_SCALE * 15, y: MAP_SCALE * 150}, 
  "24,2"  : {x: MAP_SCALE * 20, y: MAP_SCALE * 150}, 
  "24,3"  : {x: MAP_SCALE * 25, y: MAP_SCALE * 150}, 

    // Rusturf Tunnel
  "24,4"  : {x: MAP_SCALE * 150, y: MAP_SCALE * 56}, 

    // Underwater
  "24,5"  : {x: MAP_SCALE * 30, y: MAP_SCALE * 150}, 

    // Desert Ruins
  "24,6"  : {x: MAP_SCALE * 35, y: MAP_SCALE * 150}, 

    // Granite Cave
  "24,7"  : {x: MAP_SCALE * 45, y: MAP_SCALE * 150}, 
  "24,8"  : {x: MAP_SCALE * 50, y: MAP_SCALE * 150}, 
  "24,9"  : {x: MAP_SCALE * 55, y: MAP_SCALE * 150}, 
  "24,10" : {x: MAP_SCALE * 60, y: MAP_SCALE * 150}, 

    // Petalburg Woods
  "24,11" : {x: MAP_SCALE * 4 , y: MAP_SCALE * 82}, 

    // Mt chimney
  "24,12"  : {x: MAP_SCALE * 65, y: MAP_SCALE * 150},
    // Jagged pass
  "24,13"  : {x: MAP_SCALE * 70, y: MAP_SCALE * 150},
    // Firey Path
  "24,14"  : {x: MAP_SCALE * 75, y: MAP_SCALE * 150},
    // Mt Pyer 
  "24,15"  : {x: MAP_SCALE * 80 , y: MAP_SCALE * 150},
  "24,16"  : {x: MAP_SCALE * 85 , y: MAP_SCALE * 150},
  "24,17"  : {x: MAP_SCALE * 95 , y: MAP_SCALE * 150},
  "24,18"  : {x: MAP_SCALE * 100, y: MAP_SCALE * 150},
  "24,19"  : {x: MAP_SCALE * 105, y: MAP_SCALE * 150},
  "24,20"  : {x: MAP_SCALE * 110, y: MAP_SCALE * 150},
  "24,21"  : {x: MAP_SCALE * 115, y: MAP_SCALE * 150},
  "24,22"  : {x: MAP_SCALE * 120, y: MAP_SCALE * 150},
    // Aqua Hideout
  "24,23"  : {x: MAP_SCALE * 125, y: MAP_SCALE * 150},
  "24,24"  : {x: MAP_SCALE * 130, y: MAP_SCALE * 150},
  "24,25"  : {x: MAP_SCALE * 135, y: MAP_SCALE * 150},
    // Seafloor cavern
  "24,28"  : {x: MAP_SCALE * 0 , y: MAP_SCALE * 160},
  "24,29"  : {x: MAP_SCALE * 5 , y: MAP_SCALE * 160},
  "24,30"  : {x: MAP_SCALE * 10, y: MAP_SCALE * 160},
  "24,31"  : {x: MAP_SCALE * 15, y: MAP_SCALE * 160},
  "24,34"  : {x: MAP_SCALE * 20, y: MAP_SCALE * 160},
  "24,35"  : {x: MAP_SCALE * 25, y: MAP_SCALE * 160},
  "24,36"  : {x: MAP_SCALE * 30, y: MAP_SCALE * 160},
    // Cave of origin
  "24,37"  : {x: MAP_SCALE * 35, y: MAP_SCALE * 160},
  "24,42"  : {x: MAP_SCALE * 40, y: MAP_SCALE * 160},
    // Victory road
  "24,43"  : {x: MAP_SCALE * 45, y: MAP_SCALE * 160},
  "24,44"  : {x: MAP_SCALE * 50, y: MAP_SCALE * 160},
  "24,45"  : {x: MAP_SCALE * 55, y: MAP_SCALE * 160},
    // New Mauville
  "24,52"  : {x: MAP_SCALE * 60, y: MAP_SCALE * 160},
  "24,53"  : {x: MAP_SCALE * 65, y: MAP_SCALE * 160},
    // Abandoned ship
  "24,54"  : {x: MAP_SCALE * 65 , y: MAP_SCALE * 160},
  "24,55"  : {x: MAP_SCALE * 70 , y: MAP_SCALE * 160},
  "24,56"  : {x: MAP_SCALE * 75 , y: MAP_SCALE * 160},
  "24,57"  : {x: MAP_SCALE * 80 , y: MAP_SCALE * 160},
  "24,58"  : {x: MAP_SCALE * 85 , y: MAP_SCALE * 160},
  "24,59"  : {x: MAP_SCALE * 90 , y: MAP_SCALE * 160},
  "24,60"  : {x: MAP_SCALE * 95 , y: MAP_SCALE * 160},
  "24,61"  : {x: MAP_SCALE * 100, y: MAP_SCALE * 160},
  "24,62"  : {x: MAP_SCALE * 105, y: MAP_SCALE * 160},
  "24,63"  : {x: MAP_SCALE * 110, y: MAP_SCALE * 160},
  "24,64"  : {x: MAP_SCALE * 115, y: MAP_SCALE * 160},
  "24,65"  : {x: MAP_SCALE * 120, y: MAP_SCALE * 160},
    // Island cave
  "24,67"  : {x: MAP_SCALE * 125, y: MAP_SCALE * 160},
  "24,68"  : {x: MAP_SCALE * 130, y: MAP_SCALE * 160},
  "24,73"  : {x: MAP_SCALE * 135, y: MAP_SCALE * 160},
  "24,77"  : {x: MAP_SCALE * 140, y: MAP_SCALE * 160},
  "24,78"  : {x: MAP_SCALE * 145, y: MAP_SCALE * 160},
  "24,79"  : {x: MAP_SCALE * 150, y: MAP_SCALE * 160},
  "24,80"  : {x: MAP_SCALE * 0, y: MAP_SCALE * 170},
  "24,81"  : {x: MAP_SCALE * 5, y: MAP_SCALE * 170},
  "24,82"  : {x: MAP_SCALE * 10, y: MAP_SCALE * 170},
  "24,84"  : {x: MAP_SCALE * 15, y: MAP_SCALE * 170},
  "24,85"  : {x: MAP_SCALE * 20, y: MAP_SCALE * 170},
  "24,86"  : {x: MAP_SCALE * 25, y: MAP_SCALE * 170},
  "24,87"  : {x: MAP_SCALE * 30, y: MAP_SCALE * 170},
  "24,88"  : {x: MAP_SCALE * 35, y: MAP_SCALE * 170},
  "24,89"  : {x: MAP_SCALE * 40, y: MAP_SCALE * 170},
  "24,90"  : {x: MAP_SCALE * 45, y: MAP_SCALE * 170},
  "24,91"  : {x: MAP_SCALE * 50, y: MAP_SCALE * 170},
  "24,92"  : {x: MAP_SCALE * 55, y: MAP_SCALE * 170},
  "24,93"  : {x: MAP_SCALE * 60, y: MAP_SCALE * 170},
  "24,94"  : {x: MAP_SCALE * 65, y: MAP_SCALE * 170},
  "24,95"  : {x: MAP_SCALE * 70, y: MAP_SCALE * 170},
  "24,96"  : {x: MAP_SCALE * 75, y: MAP_SCALE * 170},
  "24,97"  : {x: MAP_SCALE * 80, y: MAP_SCALE * 170},
  "24,103" : {x: MAP_SCALE * 85, y: MAP_SCALE * 170},
  "24,105" : {x: MAP_SCALE * 90, y: MAP_SCALE * 170},
  "24,107" : {x: MAP_SCALE * 90, y: MAP_SCALE * 170},
  "26,10"  : {x: MAP_SCALE * 100, y: MAP_SCALE * 170},
  "26,56"  : {x: MAP_SCALE * 105, y: MAP_SCALE * 170},
  "26,57"  : {x: MAP_SCALE * 110, y: MAP_SCALE * 170},
  "26,58"  : {x: MAP_SCALE * 115, y: MAP_SCALE * 170},
  "26,60"  : {x: MAP_SCALE * 120, y: MAP_SCALE * 170},
  "26,66"  : {x: MAP_SCALE * 125, y: MAP_SCALE * 170},
  "26,68"  : {x: MAP_SCALE * 130, y: MAP_SCALE * 170},
  "26,69"  : {x: MAP_SCALE * 135, y: MAP_SCALE * 170},
  "26,70"  : {x: MAP_SCALE * 140, y: MAP_SCALE * 170},
  "26,74"  : {x: MAP_SCALE * 145, y: MAP_SCALE * 170},
  "26,75"  : {x: MAP_SCALE * 150, y: MAP_SCALE * 170},
  "26,87"  : {x: MAP_SCALE * 155, y: MAP_SCALE * 170},
  "26,9"   : {x: MAP_SCALE * 160, y: MAP_SCALE * 170},

}

var BANK_TO_EXTERNAL_HUB = {
  "1"  : "0,9"  , // Little Root
  "2"  : "0,10" , // Oldale
  "3"  : "0,11" , // Dewford
  "4"  : "0,12" , // lavaridge
  "5"  : "0,13" , // fallarbour
  "6"  : "0,14" , // verdanturf
  "7"  : "0,15" , // pacifidlog
  "8"  : "0,0"  , // Petalburg
  "9"  : "0,1"  , // Slateport
  "10" : "0,2"  , // Mauville
  "11" : "0,3"  , // Rustboro
  "12" : "0,4"  , // Fortree
  "13" : "0,5"  , // Lilycove
  "14" : "0,6"  , // Mossdeep
  "15" : "0,7"  , // Sootopolis
  "16" : "0,8"  , // Evergrande
  "17" : "0,19" , // r104
  "18" : "0,26" , // r111
  "19" : "0,27" , // r112
  "20" : "0,29" , // r114
  "21" : "0,31" , // r116
  "22" : "0,32" , // r117
  "23" : "0,36" , // r121
  "27" : "0,19" , // r104
  "28" : "0,24" , // r109
  "29" : "0,25" , // r110
  "30" : "0,28" , // r113
  "31" : "0,38" , // r123
  "32" : "0,34" , // r119
  "33" : "0,39" , // r124
}

function nodeToPosition(node) {
  
  if (node.data().isWarp) {

    let id = node.data().id;
    let data = getMapData()[id];
    let parent = mapBankToPosition(toMapBank(node.data().id), id.split(",")[3]);

    if (!parent) {
      return {'x':0, 'y':0};
    }


    let jointCoords = data.name.split("-")[3].trim();

    let isOutside = id.split(",")[1] == '0';
    let scale = isOutside ? OUTSIDE_MAP_SCALE : INSIDE_MAP_SCALE;
    if (!isOutside) {
      node.addClass('indoors');
    }

    let x = parent.x + (scale * parseInt(jointCoords.split(",")[0], 16));
    let y = parent.y + (scale * parseInt(jointCoords.split(",")[1], 16));

    return {'x':x, 'y':y};

  } 

  return {'x':0, 'y':0};
}

var missingParentList = new Set();

var addedGroups = new Set();
function mapBankToPosition(bank, nodeCount) {
  
  // Node is within a hub
  let parentPosition = MAP_BANK_POSITION[bank.substring(2)]

  if (parentPosition) {
    return parentPosition;
  } 


  // Node is a building withing a hub
  let externalHub = BANK_TO_EXTERNAL_HUB[bank.split(",")[1]];

  if (externalHub) {
    parentPosition = MAP_BANK_POSITION[externalHub];
    if (parentPosition) {
      parentPosition.y = parentPosition.y - (20 * INSIDE_MAP_SCALE);
      //parentPosition.x = parentPosition.x - (10 * nodeCount * INSIDE_MAP_SCALE)
      return parentPosition;
    } 
  }

  missingParentList.add(bank);
  return false;
}
