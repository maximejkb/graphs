var pq = new PriorityQueue((me, other) => { return me - other; });
console.log(pq.size);
pq.push(1);
pq.push(2);
console.log(pq.size);
pq.push(3);
pq.push(0);
pq.push(10);
console.log(pq.size);
pq.poll();
pq.poll();
pq.poll();
pq.poll();
console.log(pq.size);
pq.poll();
pq.poll();
pq.poll();
pq.poll();
pq.poll();
pq.poll();
pq.poll();
pq.poll();
console.log(pq.size);
