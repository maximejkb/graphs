# graphs
A NodeJS-powered network graph visualizer using D3. Allows visualization of various graph traversal algorithms.
The goal is to have interactive user data input and have the D3 visualization automatically resize
appropriately. From there, users can perform and visualize graph traversals using DFS, BFS, Djikstra's, and A*.
Hope to implement minimum-spanning-tree algorithms like Prim's and Kruskal's.

NOTE: The heuristic for A* doesn't rely on some inherent characteristic of the graph. In fact, it estimates distance
to the target using the x, y position of the node object on the SVG canvas. It calculates these distances as it pushes
to the P.Q. Since this is not a static graph, but a dynamic, moving visualization, these distances change as the graph
moves! So the shortest path can be different for the same two nodes on different runs. Something to fix.

Master branch is for development and uses NodeJS. From this branch, one can edit a local version of the application.
Navigate to the directory and run "node app.js" from the command line. A local version of the
program will run at 127.0.0.1 on port 3000 (http://127.0.0.1:3000/).

gh-pages branch serves up the program for use on https://maximejkb.github.io/graphs/.
