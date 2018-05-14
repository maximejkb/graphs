//@author: Maxime Kawawa-Beaudan

//As per the PriorityQueue comparator interface, returns a negative integer if
//node1 is smaller than node2 by the relevant measure, a positive integer if it
//is greater, and zero if they are equal.
function compareNodes(node1, node2) {
  return distTo.get(node1) - distTo.get(node2);
}

//Returns all of the adjacent nodes to the current node, regardless of marking.
function getNeighbors(current) {
  return edges.reduce((neighbors, edge) => {
    if (edge.target.label === current.label) {
      neighbors.push(edge.source);
    } else if (edge.source.label === current.label) {
      neighbors.push(edge.target);
    }
    return neighbors;
  }, []);
}

function relax(sourceNode, neighborNode, directDist) {
  var currentDist = distTo.get(sourceNode) + directDist.get(neighborNode);
  if (distTo.get(neighborNode) > currentDist) {
    distTo.set(neighborNode, currentDist);
    edgeTo.set(neighborNode, sourceNode);
  }

  //But only want to add things to the fringe that are not visited.
  if (!(marked.includes(neighborNode))) {
    if (pqFringe.contains(neighborNode)) {
      pqFringe.updatePriority(neighborNode);
    } else {
      pqFringe.push(neighborNode);
    }
  }
}

//Already instantiated in app.js: marked, edgeTo, fringe (but not a
//PriorityQueue fringe).
var distTo = new Map();
var pqFringe = new PriorityQueue(compareNodes);

//Initiates Djikstra's algorithm for finding the shortest weighted path.
function startWeightedPaths(clickedNode) {
  //In case A* was just run and pqFringe is using comparePaths.
  var pqFringe = new PriorityQueue(compareNodes);
  //Initialize all nodes as having infinite distance from the source.
  data.forEach((node) => {
    distTo.set(node, Number.MAX_SAFE_INTEGER);
  });

  searchComplete = false;

  marked.push(clickedNode);
  visited.push(clickedNode);
  pqFringe.push(clickedNode);
  distTo.set(clickedNode, 0);
  edgeTo.set(clickedNode, clickedNode);

  colorGraph();
}

//Runs Djikstra's algorithm.
function runWeightedPaths() {
  var current = pqFringe.poll();
  //If the fringe is empty, we are done.
  if (typeof current === "undefined") {
    searchComplete = true;

    //Clear markings from search (reset graph coloring).
    marked = new Array();
    visited = new Array();
    pqFringe = new PriorityQueue(compareNodes);
    colorGraph();

    //Now highlight the shortest path, using edgeTo information.
    highlightShortestPaths();

    //Now reset edgeTo.
    edgeTo = new Map();
    return;
  }

  marked.push(current);
  var neighbors = getNeighbors(current);

  //A Map initialized with an array of key-value pairs (arrays of length two). These
  //arrays created by reducing edges dataset, adding a tuple of (target node, distTo
  //target node) for every edge incident to current and a target node.
  var distances = new Map(edges.reduce((dist, edge) => {
    if (neighbors.includes(edge.source) && edge.target == current) {
      dist.push([edge.source, edge.distance]);
    } else if (neighbors.includes(edge.target) && edge.source == current) {
      dist.push([edge.target, edge.distance]);
    }
    return dist;
  }, []));

  neighbors.forEach((neighbor) => {
    //Want to relax all neighbors, even if visited or marked or what have you.
    //Still want to update edgeTo and distTo in the search of a shortest path.
    relax(current, neighbor, distances);
  });

  colorGraph();
}
