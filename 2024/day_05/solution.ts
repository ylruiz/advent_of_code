import { readFileSync } from "fs";

const filePath = "../inputs/05_12_2024.txt";
// const filePath = "../inputs/test.txt";

let pageUpdates = new Map<number, number[]>();
let orderedUpdates: number[][] = [];

function processData() {
  const rowData = readFileSync(filePath, "utf-8");

  rowData
    .split("\n")
    .filter((line) => line.includes("|"))
    .map((line) => {
      const pagePair = line.split("|").map(Number);
      addConnection(pagePair[0], pagePair[1]);
    });

  orderedUpdates = rowData
    .split("\n")
    .filter((line) => line.includes(","))
    .map((line) => line.split(",").map(Number));
}

processData();

function addConnection(x: number, y: number) {
  if (pageUpdates.has(x)) {
    pageUpdates.get(x)?.push(y);
  } else {
    pageUpdates.set(x, [y]);
  }
}

function insertElemUpdate(
  currentElement: number,
  seenElements: number[],
  rules: Map<number, number[]>
) {
  let flag = false;
  for (let i = 0; i < seenElements.length; i++) {
    if (flag) {
      break;
    }
    if (rules.has(currentElement)) {
      const connections = rules.get(currentElement);
      if (connections?.includes(seenElements[i])) {
        seenElements.splice(i, 0, currentElement);
        flag = true;
      }
    }
  }
  if (!flag) {
    seenElements.push(currentElement);
  }
}

function isUpdateOrdered(update: number[], rules: Map<number, number[]>) {
  let seenElements: number[] = [];
  seenElements.push(update[0]);
  for (let i = 1; i < update.length; i++) {
    const u = update[i];
    if (rules.has(u)) {
      const connections = rules.get(u);
      for (let l = 0; l < seenElements.length; l++) {
        if (connections!.includes(seenElements[l])) {
          return false;
        }
      }
      seenElements.push(u);
    } else {
      seenElements.push(u);
    }
  }
  return true;
}

function orderUpdate(update: number[], rules: Map<number, number[]>) {
  let seenElements: number[] = [];
  seenElements.push(update[0]);
  for (let i = 1; i < update.length; i++) {
    let u = update[i];
    if (rules.has(u)) {
      insertElemUpdate(u, seenElements, rules);
    } else {
      seenElements.push(u);
    }
  }
  const index = Math.ceil(seenElements.length / 2) - 1;
  return seenElements[index];
}

function getUpdates(
  fullData: number[][],
  rules: Map<number, number[]>,
  ordered: boolean
) {
  function filterFun(data: number[]) {
    return ordered
      ? isUpdateOrdered(data, rules)
      : !isUpdateOrdered(data, rules);
  }
  return fullData.filter(filterFun);
}

const resultsValid: number[] = getUpdates(
  orderedUpdates,
  pageUpdates,
  true
).map((subArray) => subArray[Math.ceil(subArray.length / 2) - 1]);
const totalValid = resultsValid.reduce((sum, current) => sum + current, 0);
console.log(totalValid);

const resultsInvalid: number[] = getUpdates(
  orderedUpdates,
  pageUpdates,
  false
).map((subArray) => orderUpdate(subArray, pageUpdates));
const totalInvalid = resultsInvalid.reduce((sum, current) => sum + current, 0);
console.log(totalInvalid);
