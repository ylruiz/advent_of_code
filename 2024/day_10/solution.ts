import { readFileSync } from "fs";

const filePath = "../inputs/10_12_2024.txt";
// const filePath = "../inputs/test.txt";

let heightHash: Record<number, number[][]> = {};
let heightMap: number[][] = [];

function processData() {
  try {
    const rowData = readFileSync(filePath, "utf-8");
    const allLines = rowData.trim().split("\n");

    allLines.forEach((line, index) => {
      const elems = line.split("");

      heightMap.push(elems.map(Number));

      elems.forEach((elem, elemIndex) => {
        const pos = [index, elemIndex];
        if (elem in heightHash) {
          heightHash[parseInt(elem)].push(pos);
        } else {
          heightHash[parseInt(elem)] = [pos];
        }
      });
    });
  } catch (err) {
    console.log(`Error reading filePath: ${filePath}`);
  }
}

processData();

function findNeighbors(pos: number[], dim: number) {
  let vectorNeighbors: number[][] = [];
  // pos = {i, j} => {i + 1, j}, {i - 1, j}, {i, j + 1}, {i, j - 1}
  const dir = [-1, 1];

  for (const i of dir) {
    for (let j = 0; j < pos.length; j++) {
      let temp = pos.slice();
      temp[j] += i;
      if (temp[j] >= 0 && temp[j] < dim) {
        vectorNeighbors.push(temp);
      }
    }
  }
  return vectorNeighbors;
}

function findTrailhead(
  currentHeight: number,
  trail: number[][],
  goodTrails: number[][][]
) {
  // if the height is 9 then we have arrived at the destination.
  if (currentHeight === 9) {
    goodTrails.push(trail);
    return true;
  }

  let possibleMoves = findNeighbors(trail[trail.length - 1], heightMap.length);
  let goodMoves = possibleMoves.filter((move) => {
    const [row, col] = move;
    return heightMap[row][col] === currentHeight + 1;
  });

  if (goodMoves.length === 0) {
    return false;
  }

  for (const next of goodMoves) {
    let newTrail = trail.slice();
    newTrail.push(next);
    findTrailhead(currentHeight + 1, newTrail, goodTrails);
  }
}

function getUniqueTrails(data: number[][][]) {
  let uniqueTrails = new Set<string>();
  for (const trail of data) {
    const key = trail[0].toString() + trail[trail.length - 1].toString();
    uniqueTrails.add(key);
  }
  return uniqueTrails.size;
}

function calculateScore(isRatingEnabled : boolean = false) {
  let totalPaths = 0;
  const startPositions = heightHash[0];

  startPositions.forEach((value) => {
    let goodPaths: number[][][] = [];
    let trail: number[][] = [value];
    findTrailhead(0, trail, goodPaths);
    if (isRatingEnabled){
        totalPaths += goodPaths.length;
    }else{
        totalPaths += getUniqueTrails(goodPaths);
    }
  });
  return totalPaths;
}

console.log(calculateScore());
console.log(calculateScore(true));
