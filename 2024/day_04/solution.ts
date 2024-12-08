import { readFileSync } from "fs";

// const filePath = "../inputs/04_12_2024.txt";
const filePath = "../inputs/test.txt";

const rowData = readFileSync(filePath, "utf-8");

const regexStraight = /XMAS/g;
const regexRevert = /SAMX/g;
const masRegex = /MAS/g;
const masRegexRevert = /SAM/g;
let xVector = new Map<number, number[]>();
let totalXmas = 0;

let aVector = new Map<number, number[]>();
let totalCruzedMas = 0;

const xmasVector = rowData
  .trim()
  .split("\n")
  .map((line, index) => {
    const items = line.split("");
    const xIndexes: number[] = [];
    const aIndexes: number[] = [];

    items.forEach((value, index) => {
      if (value === "X") {
        xIndexes.push(index);
      }

      if (value === "A") {
        aIndexes.push(index);
      }
    });

    xVector.set(index, xIndexes);
    aVector.set(index, aIndexes);

    return items;
  });

function calculateTotalXmas() {
  xVector.forEach((value, key) => {
    calculateHorizontal(key);

    value.forEach((index) => {
      calculateVerticalXmas(key, index);
      calculateDiagonalXmas(key, index);
    });
  });

  console.log(totalXmas);
  return totalXmas;
}

function calculateHorizontal(key: number) {
  const xmasVectorLine = xmasVector[key] ?? [];
  incrementXmasCounter(xmasVectorLine.join(""));
}

function calculateVerticalXmas(key: number, index: number) {
  if (key < xmasVector.length - 3) {
    const xmasVectorLineVerticalDown = [
      xmasVector[key][index],
      xmasVector[key + 1][index],
      xmasVector[key + 2][index],
      xmasVector[key + 3][index],
    ];

    incrementXmasCounter(xmasVectorLineVerticalDown.join(""));
  }

  if (key > 3) {
    const xmasVectorLineVerticalUp = [
      xmasVector[key][index],
      xmasVector[key - 1][index],
      xmasVector[key - 2][index],
      xmasVector[key - 3][index],
    ];

    incrementXmasCounter(xmasVectorLineVerticalUp.join(""));
  }
}

function calculateDiagonalXmas(key: number, index: number) {
  // index oriented
  const isLeftAllowed = index > 2;
  const isRigthAllowed = index < xmasVector[key].length - 3;

  // key oriented
  const isUpAllowed = key > 2;
  const isDownAllowed = key < xmasVector.length - 3;

  if (isDownAllowed) {
    if (isLeftAllowed) {
      const xmasVectorLineDiagonalLeftDown = [
        xmasVector[key][index],
        xmasVector[key + 1][index - 1],
        xmasVector[key + 2][index - 2],
        xmasVector[key + 3][index - 3],
      ];

      incrementXmasCounter(xmasVectorLineDiagonalLeftDown.join(""));
    }

    if (isRigthAllowed) {
      const xmasVectorLineDiagonalRightDown = [
        xmasVector[key][index],
        xmasVector[key + 1][index + 1],
        xmasVector[key + 2][index + 2],
        xmasVector[key + 3][index + 3],
      ];

      incrementXmasCounter(xmasVectorLineDiagonalRightDown.join(""));
    }
  }

  if (isUpAllowed) {
    if (isLeftAllowed) {
      const xmasVectorLineDiagonalLeftUp = [
        xmasVector[key][index],
        xmasVector[key - 1][index - 1],
        xmasVector[key - 2][index - 2],
        xmasVector[key - 3][index - 3],
      ];

      incrementXmasCounter(xmasVectorLineDiagonalLeftUp.join(""));
    }

    if (isRigthAllowed) {
      const xmasVectorLineDiagonalRightUp = [
        xmasVector[key][index],
        xmasVector[key - 1][index + 1],
        xmasVector[key - 2][index + 2],
        xmasVector[key - 3][index + 3],
      ];

      incrementXmasCounter(xmasVectorLineDiagonalRightUp.join(""));
    }
  }
}

function incrementXmasCounter(text: string) {
  const xmasMatches = text.matchAll(regexStraight) ?? [];

  for (const {} of xmasMatches) {
    totalXmas++;
  }

  const xmasRevertMatches = text.matchAll(regexRevert) ?? [];

  for (const {} of xmasRevertMatches) {
    totalXmas++;
  }
}

function claculateCruzedMas() {
  aVector.forEach((value, key) => {
    value.forEach((index) => {
      if (
        key > 0 &&
        key < xmasVector.length - 1 &&
        index > 0 &&
        index < xmasVector[key].length - 1
      ) {
        const stringOne = [
          xmasVector[key - 1][index - 1],
          xmasVector[key][index],
          xmasVector[key + 1][index + 1],
        ].join("");
        const stringTwo = [
          xmasVector[key - 1][index + 1],
          xmasVector[key][index],
          xmasVector[key + 1][index - 1],
        ].join("");

        if (
          (stringOne === "MAS" || stringOne === "SAM") &&
          (stringTwo === "MAS" || stringTwo === "SAM")
        ) {
          totalCruzedMas++;
        }
      }
    });
  });

  console.log(totalCruzedMas);
  return totalCruzedMas;
}

calculateTotalXmas(); // 2547 but for me 2545
claculateCruzedMas(); // 1939
