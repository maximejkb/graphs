var N = 200;
var p = Math.log(N) / N - 0.015;
var maxLength = 60;
var minLength = 10;

var data = [];
var edges = [];
for (var i = 0; i < N; i++) {
  data.push({label: i.toString()})

  for (var j = i; j < N; j++) {
    if (Math.random() < p) {
      edges.push({
        source: i.toString(),
        target: j.toString(),
        distance: Math.floor((Math.random() * (maxLength - minLength + 1))) + minLength
      })
    }
  }
}

function addNode() {
  //What's the largest label we have? Our new node should have this value + 1 as its label.
  var maxLabel = Math.max.apply(Math, data.map(node => parseInt(node.label)));
  //@source: How to get the mouse x and mouse y position within the SVG canvas, so it's not
  //weirdly translated: https://stackoverflow.com/questions/16770763/mouse-position-in-d3
  var mouseX = d3.mouse(this)[0];
  var mouseY = d3.mouse(this)[1];
  //Initialize the new node to spawn under the mouse.
  var newNode = {
     label : (maxLabel + 1).toString(),
     x : mouseX,
     y : mouseY
    };
  //Add the new node to our data.
  data.push(newNode);

  //We select all the nodes. The second argument of data is a key function: how do we
  //bind the new data to elements -- we bind data points to circles with matching IDs.
  //This is using D3's "general update pattern". We "join" new data with existing elements.
  nodeElements = nodeGroup.selectAll('circle')
    .data(data, node => node.id);
  //We remove all of the old (unchanged) data from the graph, so that we don't get duplicates
  //of every existing node. D3 handles removing old data and not removing new data.
  nodeElements.exit().remove();

  //We enter the nodeElements object, add a circle for every piece of data, just as before.
  var nodeEnter = nodeElements.enter()
    .append('circle')
    .attr('r', 10)
    .attr('fill', 'LightGray')
    .call(dragDrop);

  //We merge the new nodeElements (data object) and the circles we've created.
  nodeElements = nodeEnter.merge(nodeElements);

  //We assign nodeElements to call startAlgorithm when they're clicked.
  nodeElements.on("click", startAlgorithm);
  /**
  edgeElements = edgeGroup.selectAll("line")
    //To make sure that we're uniquely binding the lines to the edge data, we use a
    //unique identifier to match existing lines to old data -- the source label plus
    //the target label. There is at most one edge connecting two nodes. But a node may
    //have degree greater than one, so to distinguish between incident edges to the same
    //source or target we identify an edge by the sum of the labels.
    .data(edges, edge => edge.source.label + edge.target.label);

  edgeElements.exit().remove();

  var edgeEnter = edgeElements.enter()
    .append("line")
    .attr("stroke-width", 1)
    .attr("stroke", "LightGray");

  edgeElements = edgeEnter.merge(edgeElements);
  **/
  //We run the same exact procedure on the node labels.
  textElements = labelGroup.selectAll('text')
    .data(data, node => node.label);

  textElements.exit().remove();

  var textEnter = textElements.enter()
    .append('text')
    .text(node => node.label)
    .attr("font-size", 15)
    .attr("fill", "DarkGray")
    .attr("fill-opacity", 1)
    .attr("dx", 15)
    .attr("dy", 5);

  textElements = textEnter.merge(textElements);

  //This is the exact same "tick" function as from app.js. We just have to describe again
  //what we want to simulation to do since we're updating the simulation.
  simulation.nodes(data).on('tick', () => {
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

}
