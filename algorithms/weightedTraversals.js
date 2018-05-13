//As per the PriorityQueue comparator interface, returns a negative integer if
//node1 is smaller than node2 by the relevant measure, a positive integer if it
//is greater, and zero if they are equal.
function compareNodes(node1, node2) {
  return distTo.get(node1) - distTo.get(node2);
}

//Already instantiated in app.js: marked, edgeTo, fringe (but not a
//PriorityQueue fringe).
var distTo = new Map();
var pqFringe = new PriorityQueue(compareNodes);

//Initiates Djikstra's algorithm for finding the shortest weighted path.
function startWeightedPaths(clickedNode) {
  //Initialize all nodes as having infinite distance from the source.
  data.forEach((node) => {
    distTo.set(node, Number.MAX_SAFE_INTEGER);
  });

  searchComplete = false;

  marked.push(clickedNode);
  distTo.set(clickedNode, 0);
  edgeTo.set(clickedNode, clickedNode);

  nodeElements.attr("fill", node => colorMarkedNodes);

}

//Runs Djikstra's algorithm.
function runWeightedPaths() {

}
