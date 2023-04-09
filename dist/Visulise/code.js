var state;

document.addEventListener('DOMContentLoaded', function() {
  isHeadless = false;
  state = initMappingGraph(getFilteredData(), false, new ProgressionState(getFlagData(), getRandomisationConfig()));
});

function doVisuliseNextMapping() {
  let rng = new RNG(getHash(document.getElementById("input_seed_text").value));
  doNextMapping(rng, getInitialWarp(getRandomisationConfig()), state);
  state = updateProgressionState(state, getInitialWarp(getRandomisationConfig()));
  cy.layout({name: 'preset', nodeDimensionsIncludeLabels: true, positions:nodeToPosition}).run();
  cy.edges().forEach(n => n.addClass('faded'));
  enableSelection();
}

function doVisuliseRemap() {
  mapWarps(document.getElementById("input_seed_text").value); 
  cy.layout({name: 'preset', nodeDimensionsIncludeLabels: true, positions:nodeToPosition}).run();
  cy.edges().forEach(n => n.addClass('faded'))
  enableSelection();
}

function enableSelection() {
  console.log("enabling selection");


  window.cy.on('select', 'node', function (event) {

    cy.edges().forEach(n => n.addClass('faded'))

    var connectedEdges = event.target.successors()
    var i = 0;

    var highlightNextEle = function(){
        if( i < connectedEdges.length ){
            connectedEdges[i].addClass('highlighted');
            i++;
            highlightNextEle();
        }

    };

    highlightNextEle();

    cy.$(':selected').neighborhood().forEach(n => n.removeClass('faded'))
  });
}