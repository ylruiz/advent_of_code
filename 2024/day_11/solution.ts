// Rules of the stone evolution in time
// * 0 -> 1
// * If even number of digits -> first half to the left & second half to the right. We have to take
//   into account that the string must correspond to a valid number
// * If none of the above then multiply corresponding number by 2024

import { readFileSync } from "fs";

const filePath = "../inputs/11_12_2024.txt";
// const filePath = "../inputs/test.txt";

let stones: number[] = [];

function processData() {
  try {
    const rowData = readFileSync(filePath, "utf-8");
    stones = rowData.trim().split(" ").map(Number);
  } catch (err) {
    console.log(`Error reading filePath: ${filePath}`);
  }
}

processData();

function evolveStone(index: number, stoneData: number[]) {
  if (stoneData[index] === 0) {
    stoneData[index] = 1;
    return 0;
  }

  // [23, 2]
  // index = 0 => [2, 3, 2]
  //
  let tempStone = stoneData[index].toString();
  if (tempStone.length % 2 === 0) {
    const leftStone = parseInt(tempStone.substring(0, tempStone.length / 2));
    const rightStone = parseInt(
      tempStone.substring(tempStone.length / 2, tempStone.length)
    );

    stoneData.splice(index, 1, leftStone, rightStone);
    return 1;
  }

  stoneData[index] *= 2024;
  return 0;
}

function evolveAllStones(stoneData: number[]) {
  let index = 0;

  while (index < stoneData.length) {
    const shift = evolveStone(index, stoneData);
    index = index + 1 + shift;
  }
}

function calculateTotalStones(stoneData: number[], timeSteps: number) {
  for (let t = 0; t < timeSteps; t++) {
    evolveAllStones(stoneData);
    // console.log(`Finish with t = ${t}`);
  }
  return stoneData.length;
}

console.log(stones);
const startTime = performance.now();
const beforeMemory = process.memoryUsage().heapUsed;
calculateTotalStones(stones, 30);
const afterMemory = process.memoryUsage().heapUsed;
console.log(`Memory used: ${(afterMemory - beforeMemory) / 1024} KB`);

// The total distance should be equal to 2430334
const endTime = performance.now();
const timeTaken = (endTime - startTime)/1000;
console.log(
  `Time taken by calculateTotalDistance: ${timeTaken.toFixed(4)} seconds`
);

console.log(stones.length);
