//Methods that aren't useful anymore, but were useful at some intermediary step
//and may be again in the future.

//Given a node, returns an array of labels corresponding to directly adjacent nodes.
function getNeighbors(clickedNode) {
  return edges.reduce((neighbors, edge) => {
    if (edge.target.label === clickedNode.label) {
      neighbors.push(edge.source.label);
    } else if (edge.source.label === clickedNode.label) {
      neighbors.push(edge.target.label);
    }
    return neighbors;
  }, [clickedNode.label]);
}

//Given a node and an edge, determines if the edge is incident to the node.
function isIncidentEdge(clickedNode, edge) {
  return edge.target.label === clickedNode.label ||  edge.source.label === clickedNode.label;
}

//Colors the node according to adjacency to a clicked node.
function colorNode(node, neighbors) {
  return neighbors.includes(node.label) ? "DarkSeaGreen" : "LightGray";
}

//Colors the text according to association with a node -- adjacent to clicked node or not?
function colorText(node, neighbors) {
  return neighbors.includes(node.label) ? "DarkSeaGreen" : "DarkGray";
}

//Colors edges according to incidency to a clicked node.
function colorEdge(edge, clickedNode) {
  return isIncidentEdge(edge, clickedNode) ? "LightGray" : "DarkSeaGreen";
}

//Called by nodeElements on click. Takes a clicked node, calculates neighbors, adjacent
//edges, and colors all elements in the graph accordingly.
function selectNode(clickedNode) {
  var neighbors = getNeighbors(clickedNode);

  nodeElements.attr("fill", node => colorNode(node, neighbors));
  textElements.attr("fill", text => colorText(text, neighbors));
  edgeElements.attr("stroke", edge => colorEdge(clickedNode, edge));
}

//Remembers nodes clicked in the past -- highlighting persists.
function persistentSelectNode(clickedNode) {
  var neighbors = getNeighbors(clickedNode);
  neighbors.forEach((neighbor) => { marked.push(neighbor); });

  nodeElements.attr("fill", node => colorNode(node, marked));
  textElements.attr("fill", text => colorText(text, marked));
}
