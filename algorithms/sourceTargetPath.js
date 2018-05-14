//@author: Maxime Kawawa-Beaudan

//Already instantiated in app.js: marked, edgeTo, fringe (but not a
//PriorityQueue fringe). Already instantiated in weightTraversals.js: distTo,
//pqFringePath. Already defined in weightedTraversals.js: getNeighbors,
//relax.
var source;
var target;
var heuristic = new Map();
var pqFringePath = new PriorityQueue(comparePaths);

//Compares nodes based on the distance from the source to the node plus the
//A* heuristic, which is scaled distance. Estimates priority for the PriorityQueue.
function comparePaths(node1, node2) {
  return (heuristic.get(node1) + distTo.get(node1)) - (heuristic.get(node2) + distTo.get(node2));
}

//Returns the raw distance between the two nodes, according to the SVG canvas's x, y
//positions -- this distance is not to scale with the link distance of the D3 simulation.
function distance(node1, node2) {
  return Math.sqrt(((node2.x - node1.x) ** 2) + ((node2.y - node1.y) ** 2));
}

//Colors graph appropriately and stops search if the target is encountered.
function stopSearch() {
  searchComplete = true;

  //Clear markings from search (reset graph coloring).
  marked = new Array();
  visited = new Array();
  pqFringePath = new PriorityQueue(comparePaths);
  colorGraph();

  //Now highlight the shortest path, using edgeTo information.
  highlightSourceTargetPath();

  //Now reset edgeTo.
  edgeTo = new Map();
}

//Colors the final shortest path.
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

//Relaxes the edge to neighborNode, which is adjacent to sourceNode, using the map of
//distances from source to all of its neighbors directDist.
function relaxHeuristic(sourceNode, neighborNode, directDist) {
  //Calculate a scale factor. Distance returns the Pythogorean distance between
  //nodes using the SVG canvas's x, y position attributes. These measurements are in pixels.
  //They are not to scale with the simulation's link distances (edge weights). To scale, find
  //the pixel distance and divide by the link distance, to get a measure of pixels/link distance unit.
  var scaleFactor = distance(sourceNode, neighborNode) / directDist.get(neighborNode);

  //Scale the distance by dividing by the scale factor. Now our estimation is close to
  //scale with the link distances. It is admissible.
  var estimatedDist = distance(neighborNode, target) / scaleFactor;

  //Cache the heuristic so the comparePaths function can access them. Otherwise we would have
  //to scale using a random representative edge, which, depending on position in the simulation,
  //may not provide a relevant scale factor. Note that, without scaling, the heuristic is
  //inadmissable (pixel distances are often in the hundreds when edge weights are ~10-20).
  heuristic.set(neighborNode, estimatedDist);

  //Calculate the best known distance to the current point and add the distance
  //on the edge between sourceNode and neighborNode.
  var currentDist = distTo.get(sourceNode) + directDist.get(neighborNode);

  //If we have found a quicker route to a neighbor, update its information.
  if (distTo.get(neighborNode) > currentDist) {
    distTo.set(neighborNode, currentDist);
    edgeTo.set(neighborNode, sourceNode);
  }

  //We may encounter the target halfway through a search. In this case, halt the search
  //early.
  if (neighborNode === target) {
    stopSearch();
    return;
  }

  //We only want to add things to the fringe that have not been visited, though we want
  //to relax all edges.
  if (!(marked.includes(neighborNode))) {
    if (pqFringePath.contains(neighborNode)) {
      pqFringePath.updatePriority(neighborNode);
    } else {
      pqFringePath.push(neighborNode);
    }
  }
}

function startSourceTargetPaths(current) {
  //If this is the first node we've clicked, make it the source.
  if (marked.length == 0) {
    pqFringePath = new PriorityQueue(comparePaths);
    source = current;
    marked.push(current);
    pqFringePath.push(current);
    //Initialize all nodes as having infinite distance from the source.
    data.forEach((node) => {
      distTo.set(node, Number.MAX_SAFE_INTEGER);
    });
    distTo.set(source, 0);
    edgeTo.set(source, source);
  //If it's not, it must be the target.
  } else if (marked.length == 1){
    target = current;
    marked.push(current);
    searchComplete = false;
    heuristic.set(target, 0);
  }

  colorGraph();
}

function runSourceTargetPaths() {
  var current = pqFringePath.poll();

  //If the fringe is empty, we are done.
  if (current === target || typeof current === "undefined") {
    stopSearch();
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
    //We may stop the search halfway through if a neighbor is the target.
    if (!searchComplete) {
      relaxHeuristic(current, neighbor, distances);
    }
  });

  //Don't want to remove coloration of shortest path if we stopped search on neighbor.
  if (!searchComplete) {
    colorGraph();
  }
}
