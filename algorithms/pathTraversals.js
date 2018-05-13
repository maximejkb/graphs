//When we run shortest paths, we mark all neighboring vertices before visiting them,
//in order to "claim" them in a way. When we consider only unmarked neighbors of future
//vertices, we don't want neighbors of the current included because clearly, we're seeing
//it at current sooner, so the path through current is shorter. But because we can't rely
//on recursion to enforce a natural order, we have to also keep track of nodes we've actually
//visited, so that we don't visit in circles.
var visited = new Array();

function startPaths(clickedNode) {
  //Start off the marked array.
  marked.push(clickedNode);
  visited.push(clickedNode);
  edgeTo.set(clickedNode, clickedNode);

  //Give initial values to fringe.
  var unmarkedNeighbors = getUnmarkedNeighbors(clickedNode);
  unmarkedNeighbors.sort(neighborSort);
  unmarkedNeighbors.forEach((neighbor) => {
    if (neighbor != clickedNode) {
      marked.push(neighbor);
      fringe.push(neighbor);
      edgeTo.set(neighbor, clickedNode);
    }
  });

  //Toggle simulation to call runSearch() on each tick.
  searchComplete = false;

  colorGraph();
}

//Performs a "frame-by-frame" version of shortest paths for compatibility with rendering.
//Marks all neighboring vertices, as per shortest paths algorithm -- does not mark upon
//visitation, like in BFS/DFS normal. Therefore, visualization seems to slow (because
//each individual marking is not visualized).
function runPaths() {
  //Take the first item inserted from the fringe.
  var current = visitAction(fringe);

  //Since we're not progressing recursively, we might consider already-visited
  //vertices (since we add to the fringe before marking, and can't rely on order
  //of calls to create a natural order).
  while (visited.includes(current)) {
    current = visitAction(fringe);
  }

  //If we empty the fringe looking for unvisited vertices, it means there are no
  //unvisited and unmarked vertices. Therefore, we're done. The frame-by-frame
  //analog of a base case.
  if (current == undefined) {
    searchComplete = true;
    //Reset persistent arrays. Clear colorings.
    marked = new Array();
    visited = new Array();
    fringe = new Array();
    colorGraph();
    highlightShortestPaths();
    edgeTo = new Map();
    return;
  }

  //This node has already been marked since it is a neighbor of some other previously
  //visited node. But now we have to register that it has been visited.
  visited.push(current);

  //Fetch neighbors. Sort before inserting so we access in the correct order
  //without losing the priority of the overall list.
  var unmarkedNeighbors = getUnmarkedNeighbors(current);
  unmarkedNeighbors.sort(neighborSort);

  //Color nodes appropriately. Green edges represent edges to/from items that are
  //marked -- the edges to nodes that are in the fringe.
  colorGraph();
  //"Frame-by-frame" recursion (saving the state at the end of each round with
  //a persistent array of not-yet-considered neighbors).
  unmarkedNeighbors.forEach((neighbor) => {
    if (neighbor != current && !(fringe.includes(neighbor))) {
      marked.push(neighbor);
      fringe.push(neighbor);
      edgeTo.set(neighbor, current);
    }
  });
}

function highlightShortestPaths() {
  //Color nodes appropriately.
  nodeElements.attr("fill", node => {
    return edgeTo.has(node) ? "DarkSeaGreen" : "LightGray";
  });
  textElements.attr("fill", node => {
    return edgeTo.has(node) ? "DarkSeaGreen" : "LightGray";
  });
  edgeElements.attr("stroke", edge => {
    return (edgeTo.get(edge.source) === edge.target
    || edgeTo.get(edge.target) === edge.source) ? "DarkSeaGreen" : "LightGray";
  }).attr("stroke-width", edge => {
    return (edgeTo.get(edge.source) === edge.target
    || edgeTo.get(edge.target) === edge.source) ? 2 : 1;
  });
  weightElements.attr("fill", edge => {
    return (edgeTo.get(edge.source) === edge.target
    || edgeTo.get(edge.target) === edge.source) ? "DarkSeaGreen" : "LightGray";
  }).attr("stroke-width", edge => {
    return (edgeTo.get(edge.source) === edge.target
    || edgeTo.get(edge.target) === edge.source) ? 2 : 1;
  });
}
