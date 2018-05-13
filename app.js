//@author: Maxime Kawawa-Beaudan

//@source: Much of the D3 visualization framework was based off of this article:
//https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811
//which describes how to properly link data to SVG circles and lines, and implement
//user interaction.

//Get the height and width of the browser window.
var w = window.innerWidth;
var h = window.innerHeight;

//Select the svg element of the HTML page and set its height and width to full.
var svg = d3.select("svg");
svg.attr("width", w).attr("height", h);

//Iniitialize the d3 graph visualization library object, forceSimulation.
//The force 'charge' represents a global force that causes nodes to repel
//each other (a positive strength would simulate gravity/attraction). The
//force 'center' puts the nodes in the center of the SVG canvas.
var simulation = d3.forceSimulation()
.force('charge', d3.forceManyBody().strength(-150).distanceMax(400))
.force('center', d3.forceCenter(w / 2, h / 2));

//We also add a link force, proportional to the strength of each link.
simulation.force('link', d3.forceLink()
  .id(edge => edge.label)
  .distance(edge => edge.distance));

//Finally, we set the alphaTarget (asymptote of exponentially-decaying cooling
//parameter) to 0.2, so it never reaches alphaMin, which is generally 0.001.
simulation.alphaTarget(0.1);

//Now we define a function to be called on drag-drop events.
var dragDrop = d3.drag()
  .on('start', node => {
    node.fx = node.x;
    node.fy = node.y;
  })
  .on('drag', node => {
    simulation.alphaTarget(0.1).restart();
    node.fx = d3.event.x;
    node.fy = d3.event.y;
  })
  .on('end', node => {
    if (!d3.event.active) {
      simulation.alphaTarget(0.1).restart();
    }
    node.fx = null;
    node.fy = null;
});

//The persistent arrays to track progression of graph traversals -- DFS, BFS,
//Djikstra's, A*, etc. while maintaining ability to render between ticks
//(circumventing natural recursion).
var marked = new Array();
//A map to track which edge led to a vertex in a shortest path algorithm.
var edgeTo = new Map();
var fringe = new Array();
//Toggles simulation to call runAlgorithm() on tick.
var searchComplete = true;

//Colors the node depending on whether it is marked or not.
function colorMarkedNode(node) {
  return marked.includes(node) ? "DarkSeaGreen" : "LightGray";
}

//Colors the text depending on whether the node is marked or not.
function colorMarkedText(node) {
  return marked.includes(node) ? "DarkSeaGreen" : "DarkGray";
}

//Colors the edge depending on whether the edge is selected or not.
function colorMarkedEdge(edge) {
  return (marked.includes(edge.source) || marked.includes(edge.target)) ? "DarkSeaGreen" : "LightGray";
}

function colorMarkedEdgeWeight(edge) {
  return (marked.includes(edge.source) || marked.includes(edge.target)) ? "DarkSeaGreen" : "DarkGray";
}

//Directs coloration of the graph.
function colorGraph() {
  //Color nodes appropriately.
  nodeElements.attr("fill", node => colorMarkedNode(node));
  textElements.attr("fill", text => colorMarkedText(text));
  edgeElements.attr("stroke", edge => colorMarkedEdge(edge));
  weightElements.attr("fill", edge => colorMarkedEdgeWeight(edge));
}

//Delegator function. Directs traffic.
function startAlgorithm(current) {
  //Deselect any previous shortest path highlights.
  edgeElements.attr("stroke-width", 1);
  if (document.getElementById("bfspaths").checked) {
    startPaths(current);
  } else if (document.getElementById("djikstras").checked) {
    startWeightedPaths(current);
  } else if (document.getElementById("astar").checked) {
    startSourceTargetPaths(current);
  } else {
    startNodeSearch(current);
  }
}

//Delegator function. Directs traffic from tick() simulation function.
function runAlgorithm() {
  if (document.getElementById("bfspaths").checked) {
    runPaths();
  } else if (document.getElementById("djikstras").checked) {
    runWeightedPaths();
  } else if (document.getElementById("astar").checked) {
    runSourceTargetPaths();
  } else {
    runNodeSearch();
  }
}

//Toggles text visibility: if opacity is 0, sets to 1. If opacity is 1, sets
//to 0.
function toggleLabels() {
  var currentOpacity = textElements.attr("fill-opacity");
  textElements.attr("fill-opacity", 1 - currentOpacity);
}

//Toggles edge weight visibility: if opacity is 0, sets to 1. If opacity is 1,
//sets to 0.
function toggleWeights() {
  var currentOpacity = weightElements.attr("fill-opacity");
  weightElements.attr("fill-opacity", 1 - currentOpacity);
}

//Create SVG line elements for each of our links/edges.
var edgeElements = svg.append('g')
  .selectAll("line")
  .data(edges)
  .enter().append("line")
    .attr("stroke-width", 1)
    .attr("stroke", "LightGray");

//Create SVG circles for each of our data points.
var nodeElements = svg.append('g')
.selectAll("circle")
.data(data)
.enter().append("circle")
  .attr("r", 10)
  .attr("fill", "LightGray")
  .on("click", startAlgorithm);

//Link the dragDrop function to a call from a node.
nodeElements.call(dragDrop);

//Create SVG text labels for each of our data points.
var textElements = svg.append('g')
.selectAll("text")
.data(data)
.enter().append("text")
  .text(node => node.label)
  .attr("font-size", 15)
  .attr("fill", "DarkGray")
  .attr("fill-opacity", 1)
  .attr("dx", 15)
  .attr("dy", 5);

var weightElements = svg.append('g')
  .selectAll("text")
  .data(edges)
  .enter().append("text")
    .text(edge => edge.distance)
    .attr("font-size", 8)
    .attr("fill", "DarkGray")
    .attr("fill-opacity", 1)
    .attr("dx", -2)
    .attr("dy", 0);

//A timer which slows the progression of the graph traversal (only progresses the
//traversal every 5 ticks).
var timer = 0;

//On each time tick of the simulation, this function recalculates position.
simulation.nodes(data).on("tick", () => {
  //Increment timer and runDFS if the search is still ongoing.
  if (!searchComplete) {
    //If the simulation's alpha ("cooling parameter") falls below the threshold
    //simulation.alphaMin (generally 0.001), ticking stops. Can't have this
    //happening mid-search, so keep alpha artificially elevated.
    simulation.alphaTarget(0.1).restart();
    if (timer == 0) {
      runAlgorithm();
    }
  }

  //(11 - x) in order to reverse the value so that left is slow, right is quick,
  //on the range [0, 10].
  var interval = 21 - document.getElementById("animationspeed").value;
  timer = (timer + 1) % interval;

  nodeElements
  .attr("cx", node => node.x)
  .attr("cy", node => node.y);
  textElements
  .attr("x", node => node.x)
  .attr("y", node => node.y);
  edgeElements
  .attr("x1", edge => edge.source.x)
  .attr("x2", edge => edge.target.x)
  .attr("y1", edge => edge.source.y)
  .attr("y2", edge => edge.target.y);
  weightElements
  .attr("x", edge => (edge.source.x + edge.target.x) / 2)
  .attr("y", edge => (edge.source.y + edge.target.y) / 2);
});

//Link the link force in the simulation to the edges dataset.
simulation.force('link').links(edges);
