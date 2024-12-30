import { readFileSync } from "fs";
import * as path from "path";

const filePath = path.join(__dirname, "../../inputs/11_12_2024.txt");
// const filePath = path.join(__dirname, "../../inputs/test.txt");

let stones: number[] = [];
let stonesMap = new Map<number, number>();

function processData() {
  try {
    const rowData = readFileSync(filePath, "utf-8");
    stones = rowData.trim().split(" ").map(Number);
    for (const element of stones) {
      if (stonesMap.has(element)) {
        const val = stonesMap.get(element) ?? 0;
        stonesMap.set(element, val + 1);
      } else {
        stonesMap.set(element, 1);
      }
    }
  } catch (err) {
    console.log(`Error reading filePath: ${filePath}`);
  }
}

processData();
console.log(stonesMap);

// Rules of the stone evolution in time
// * 0 -> 1
// * If even number of digits -> first half to the left & second half to the right. We have to take
//   into account that the string must correspond to a valid number
// * If none of the above then multiply corresponding number by 2024
function evolveStone(stone: number, count: number, stoneRep: Map<number, number>) {
    if (stone === 0) {
        stoneRep.set(1, (stoneRep.get(1) ?? 0) + count);
        return;
    }

    let tempStone = stone.toString();
    if (tempStone.length % 2 === 0) {
        const leftStone = parseInt(tempStone.substring(0, tempStone.length / 2));
        const rightStone = parseInt(tempStone.substring(tempStone.length / 2, tempStone.length));
        stoneRep.set(leftStone, (stoneRep.get(leftStone) ?? 0) + count);
        stoneRep.set(rightStone, (stoneRep.get(rightStone) ?? 0) + count);
        return;
    }

    const newStone = 2024 * stone;
    stoneRep.set(newStone, (stoneRep.get(newStone) ?? 0) + count);
    return;
}

function evolveAllStones(stonesData: Map<number, number>) {
  let tempMap = new Map<number, number>();

  for (const stone of stonesData) {
    evolveStone(stone[0], stone[1], tempMap);
  }
  return tempMap;
}

function calculateTotalStones(
  stoneData: Map<number, number>,
  timeSteps: number
) {
  let currentMap = new Map(stoneData);
  for (let t = 0; t < timeSteps; t++) {
    currentMap = evolveAllStones(currentMap);
  }
  let totalStones = 0;
  currentMap.forEach((value) => (totalStones += value));
  return totalStones;
}

console.log(stones);
console.log(calculateTotalStones(stonesMap, 75));

const startTime = performance.now();
const beforeMemory = process.memoryUsage().heapUsed;

const afterMemory = process.memoryUsage().heapUsed;
console.log(`Memory used: ${(afterMemory - beforeMemory) / 1024} KB`);

const endTime = performance.now();
const timeTaken = (endTime - startTime)/1000;
console.log(
  `Time taken by calculate total number of stones: ${timeTaken.toFixed(4)} seconds`
);

console.log(stones.length);
