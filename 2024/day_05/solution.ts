import { readFileSync } from "fs";

// const filePath = "../inputs/05_12_2024.txt";
const filePath = "../inputs/test.txt";

let pageUpdates: number[][];
let orderedUpdates: number[][];
let totalCurrectMiddlePageNumber = 0;

function processData() {
  const rowData = readFileSync(filePath, "utf-8");

  pageUpdates = rowData
    .split("\n")
    .filter((line) => line.includes("|"))
    .map((line) => line.split("|").map(Number));

  orderedUpdates = rowData
    .split("\n")
    .filter((line) => line.includes(","))
    .map((line) => line.split(",").map(Number));
}

function sumMiddlePageNumber(isSummingInvalids?: boolean) {
  processData();

  for (let i = 0; i < orderedUpdates.length; i++) {
    let isOrdered = true;
    let j = 0;
    let invalidPagesIndexes: number[] = [];

    while (j < pageUpdates.length && isOrdered) {
      const x = pageUpdates[j][0];
      const xIndex = orderedUpdates[i].indexOf(x);
      const isXFound = xIndex >= 0;

      const y = pageUpdates[j][1];
      const yIndex = orderedUpdates[i].indexOf(y);
      const isYFound = yIndex >= 0;

      if (isXFound && isYFound) {
        isOrdered = xIndex < yIndex;
      } else {
        isOrdered = true;
      }

      j++;
    }

    if (isOrdered) {
      const middleIndex =
        parseInt((orderedUpdates[i].length / 2).toFixed(0)) - 1;
      totalCurrectMiddlePageNumber += orderedUpdates[i][middleIndex];
    }
  }

  console.log(totalCurrectMiddlePageNumber);
  return totalCurrectMiddlePageNumber;
}

sumMiddlePageNumber();
