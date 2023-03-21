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
      let randomNodeIdFromComponent = randomComponent[rng.nextRange(0, randomComponent.length - 1)];

      warp2 = cy.getElementById(randomNodeIdFromComponent);
      progressionState.unconnectedComponents = progressionState.unconnectedComponents.filter(c => c != randomComponent);

    } else if (inaccesibleFlagLocations.length > 0) { 

      // Add inacessible dead-ends that might allow flags givinb access to new locations
      warp2 = inaccesibleFlagLocations[rng.nextRange(0, inaccesibleFlagLocations.length - 1)];

    } else if (inacessibleHubs.length > 0) {

      // Add any hubs that there is still no access to... I'm not sure there would even be any left...
      inacessibleNodes = inacessibleNodes.filter(e => e.degree(true) > 0);
      warp2 = inacessibleNodes[rng.nextRange(0, inacessibleNodes.length - 1)];

    } else if (inaccesibleKeyLocations.length > 0) {

      // Add key inacessible locations 
      warp2 = inaccesibleKeyLocations[rng.nextRange(0, inaccesibleKeyLocations.length - 1)];
      shouldCacheNodes = true;
      accessibleNodes.delete(warp2);
    } else if (inacessibleNodes.length > 0) {

      // Add other inacessible dead-ends 
      warp2 = inacessibleNodes[rng.nextRange(0, inacessibleNodes.length - 1)];
      shouldCacheNodes = true;
      accessibleNodes.delete(warp2);

    } else if (accessibleNodes.size > 0) {

      // map together nodes that are already accessible
      warp2 = [...accessibleNodes][rng.nextRange(0, accessibleNodes.size - 1)];
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
          selector: '.map-F',
          css: {
              'background-color': '#ffc0c3',
              'color' : '#C0C0C0',
              'font-size' : '2em'
          }
        },
        {
          selector: '.map-C',
          css: {
              'background-color': '#c0c3ff',
              'color' : '#C0C0C0',
              'font-size' : '2em'
          }
        },
        {
          selector: '.map-E',
          css: {
              'background-color': '#c3ffc0',
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
        }
      ],
    
      elements: {
        nodes: [],
        edges: []
      }
    });


    cy.add(new ReigonNode("KANTO"));
    cy.add(new ReigonNode("JOHTO"));
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
        cy.layout({name: 'cose-bilkent', animationDuration: 1000, nodeDimensionsIncludeLabels: true}).run();
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