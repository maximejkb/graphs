//Initiates DFS/BFS starting at the vertex clicked.
function startNodeSearch(current) {
  //Start off the marked array.
  marked.push(current);

  //Give initial values to fringe.
  var unmarkedNeighbors = getUnmarkedNeighbors(current);
  unmarkedNeighbors.sort(neighborSort);
  unmarkedNeighbors.forEach((neighbor) => {
    if (neighbor != current) {
      fringe.push(neighbor);
    }
  });

  //Toggle simulation to call runSearch() on each tick.
  searchComplete = false;

  //Color nodes appropriately.
  nodeElements.attr("fill", node => colorMarkedNode(node));
  textElements.attr("fill", text => colorMarkedText(text));
  edgeElements.attr("stroke", edge => colorMarkedEdge(edge));
  weightElements.attr("fill", edge => colorMarkedEdge(edge));
}

//Performs the appropriate action depending on algorithm.
function visitAction(nodes) {
  if (document.getElementById("dfs").checked) {
    //Treats the Javascript array as a L.I.F.O. stack.
    return nodes.pop();
  } else if (document.getElementById("bfs").checked || document.getElementById("bfspaths").checked) {
    //Treats the Javascript array as a F.I.F.O. queue.
    return nodes.shift();
  }
}

//Sorts the array appropriately so that the label values influence order
//of enqueuing to the fringe.
function neighborSort(node1, node2) {
  if (document.getElementById("bfs").checked || document.getElementById("bfspaths").checked) {
    //We want to insert in decreasing order for a F.I.F.O. stack (BFS).
    return parseInt(node1.label) - parseInt(node2.label);
  } else {
    //We want to insert in increasing order for a L.I.F.O. stack (DFS) or
    //default, since this presents a natural order.
    return parseInt(node2.label) - parseInt(node1.label);
  }
}

//Performs a "frame-by-frame" version of search for compatibility with rendering.
function runNodeSearch() {
  //Take the last item inserted from the stack.
  var current = visitAction(fringe);

  //Since we're not progressing recursively, we might consider already-visited
  //vertices (since we add to the fringe before marking, and can't rely on order
  //of calls to create a natural order).
  while (marked.includes(current)) {
    current = visitAction(fringe);
  }

  //If we empty the fringe looking for unmarked vertices, it means there are no
  //unvisited and unmarked vertices. Therefore, we're done. The frame-by-frame
  //analog of a base case.
  if (current == undefined) {
    searchComplete = true;
    //Reset persistent arrays.
    marked = new Array();
    fringe = new Array();
    return;
  }

  //Regular search begins here: Mark current.
  marked.push(current);

  //Fetch neighbors. Sort before inserting so we access in the correct order
  //without losing the priority of the overall list.
  var unmarkedNeighbors = getUnmarkedNeighbors(current);
  unmarkedNeighbors.sort(neighborSort);

  //Color nodes appropriately. Green edges represent edges to/from items that are
  //marked -- the edges to nodes that are in the fringe.
  nodeElements.attr("fill", node => colorMarkedNode(node));
  textElements.attr("fill", text => colorMarkedText(text));
  edgeElements.attr("stroke", edge => colorMarkedEdge(edge));
  weightElements.attr("fill", edge => colorMarkedEdge(edge));

  //"Frame-by-frame" recursion (saving the state at the end of each round with
  //a persistent array of not-yet-considered neighbors).
  unmarkedNeighbors.forEach((neighbor) => {
    if (neighbor != current) {
      fringe.push(neighbor);
    }
  });
}
