//@author: Maxime Kawawa-Beaudan

//Bare-bones binary min-heap based PriorityQueue. Constructor requires a comparison
//that will be used as the PQ's natural order. Poll returns the minimum item in the
//queue, and push adds an item to the queue. For use in Djikstra's algorithm and A*.
class PriorityQueue {
  //Takes in a two-argument function comparator. Valid comparators take parameters
  //(this, other) and return a negative number if this is smaller than other, a
  //positive number if this is greater than other, and zero if they are equal.
  constructor(comparator) {
    this.heap = new Array();
    this.compare = comparator;
    this.size = 0;
  }

  swap(index1, index2) {
    var val1 = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = val1;
  }

  //Adds the item to the PriorityQueue in the appropriate place by adding to
  //the end and bubbling.
  push(item) {
    this.heap[this.size] = item;
    this.bubble(this.size);
    this.size = this.size + 1;
  }

  //Removes the minimum item from the PriorityQueue by promoting least item and
  //sinking.
  poll(item) {
    if (this.size <= 0) {
      return;
    }
    var minVal = this.heap[0];
    this.swap(0, this.size - 1);
    this.heap.pop();
    this.sink(0);
    this.size = this.size - 1;
    return minVal;
  }

  //Recursively bubbles the item at index using the provided comparator.
  bubble(index) {
    //Base case.
    if (index == 0) {
      return;
    }
    var p = this.parent(index);
    //Comparison will be < 0 if index < parent, > 0 if index > parent, 0 if
    //index == parent.
    var comparison = this.compare(this.heap[index], this.heap[p]);
    //To preserve min-heap property, want to swap if comparison is negative.
    if (comparison < 0) {
      this.swap(index, p);
      this.bubble(p);
    } else {
      return;
    }
  }

  //Recursively sinks the item at index using the provided comparator.
  sink(index) {
    var leftIndex = this.left(index);
    var leftVal = this.heap[leftIndex];

    //Because a min-heap is complete, if left does not exist, we are done. Base case.
    if (typeof leftVal === "undefined") {
      return;
    }

    var rightIndex = this.right(index);
    var rightVal = this.heap[rightIndex];
    var minIndex;

    //If the left exists but the right does not, then the left is the minimum child.
    if (typeof rightVal === "undefined") {
      minIndex = leftIndex;
    } else {
      //Can't use Math.min because we want to respect the generic typing -- must
      //use the given comparator.
      var minIndex = this.compare(leftVal, rightVal) < 0 ? leftIndex : rightIndex;
    }
    var minVal = this.heap[minIndex];

    if (this.compare(minVal, this.heap[index]) < 0) {
      this.swap(index, minIndex);
      this.sink(minIndex);
    } else {
      return;
    }
  }

  contains(item) {
    return this.heap.includes(item);
  }

  updatePriority(item) {
    var index = this.heap.indexOf(item);
    this.bubble(index);
    index = this.heap.indexOf(item);
    this.sink(index);
  }

  //Returns the integer index of the parent of the item at index.
  parent(index) {
    return Math.floor((index - 1) / 2);
  }

  //Returns the integer index of the right child of the item at index.
  left(index) {
    return 2 * index + 1;
  }

  //Returns the integer index of the right child of the item at index.
  right(index) {
    return 2 * index + 2;
  }
}
