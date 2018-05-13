//@author: Maxime Kawawa-Beaudan

//Already instantiated in app.js: marked, edgeTo, fringe (but not a
//PriorityQueue fringe). Already instantiated in weightTraversals.js: distTo,
//pqFringe. Already defined in weightedTraversals.js: getNeighbors,
//relax.
var source;
var target;

//Compares nodes based on the distance from the source to the node plus the
//A* heuristic. Estimates priority for the PriorityQueue.
function comparePaths(node1, node2) {
  return (distance(node1, target) + distTo.get(node1)) - (distance(node2, target) + distTo.get(node2));
}

function distance(node1, node2) {
  return Math.sqrt(Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2));
}

function highlightSourceTargetPath() {
  var pathEdgeTo = new Map();
  var current = target;

  while (edgeTo.get(current) != current) {
    pathEdgeTo.set(current, edgeTo.get(current));
    current = edgeTo.get(current);
  }
  pathEdgeTo.set(current, current);

  edgeTo = pathEdgeTo;

  highlightShortestPaths();
}

function relaxHeuristic(sourceNode, neighborNode, directDist) {
  var currentDist = distTo.get(sourceNode) + directDist.get(neighborNode) + distance(neighborNode, target);
  if (distTo.get(neighborNode) + distance(neighborNode, target) > currentDist) {
    distTo.set(neighborNode, currentDist);
    edgeTo.set(neighborNode, sourceNode);
  }

  //But only want to add things to the fringe that are not visited.
  if (neighborNode === target || !(marked.includes(neighborNode))) {
    if (pqFringe.contains(neighborNode)) {
      pqFringe.updatePriority(neighborNode);
    } else {
      pqFringe.push(neighborNode);
    }
  }
}

function startSourceTargetPaths(current) {
  console.log(current);
  //If this is the first node we've clicked, make it the source.
  if (marked.length == 0) {
    pqFringe = new PriorityQueue(comparePaths);
    source = current;
    marked.push(current);
    pqFringe.push(current);
  //If it's not, it must be the target.
  } else if (marked.length == 1){
    target = current;
    marked.push(current);
    searchComplete = false;

    //Initialize all nodes as having infinite distance from the source.
    data.forEach((node) => {
      distTo.set(node, Number.MAX_SAFE_INTEGER);
    });

    distTo.set(source, 0);
    edgeTo.set(source, source);
  }

  colorGraph();
}

function runSourceTargetPaths() {
  var current = pqFringe.poll();

  //If the fringe is empty, we are done.
  if (current === target || typeof current === "undefined") {
    searchComplete = true;

    //Clear markings from search (reset graph coloring).
    marked = new Array();
    visited = new Array();
    pqFringe = new PriorityQueue(compareNodes);
    colorGraph();

    //Now highlight the shortest path, using edgeTo information.
    highlightSourceTargetPath();

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
    relaxHeuristic(current, neighbor, distances);
  });

  colorGraph();
}
