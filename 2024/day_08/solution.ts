import { readFileSync } from "fs";

const filePath = "../inputs/08_12_2024.txt";
// const filePath = "../inputs/test.txt";

let frequencies: Record<string, number[][]> = {};
let limit = 0;

function processData() {
  try {
    const rowData = readFileSync(filePath, "utf-8");
    const allLines = rowData.trim().split("\n");
    limit = allLines.length;

    allLines.forEach((line, index) => {
      const elems = line.split("");

      elems.forEach((elem, elemIndex) => {
        if (elem != ".") {
          const pos = [index, elemIndex];

          if (elem in frequencies) {
            frequencies[elem].push(pos);
          } else {
            frequencies[elem] = [pos];
          }
        }
      });
    });
  } catch (err) {
    console.log(`Error reading filePath: ${filePath}`);
  }
}

processData();

function isAntinodeWithinBoundaries(antinodePos: number[]): boolean {
  return (
    antinodePos[0] >= 0 &&
    antinodePos[0] < limit &&
    antinodePos[1] >= 0 &&
    antinodePos[1] < limit
  );
}

function findAntinodes(antennasPositions: number[][]) {
  let antinodesPositions: number[][] = [];

  for (let i = 0; i < antennasPositions.length; i++) {
    const firstAntenna = antennasPositions[i];
    for (let j = i + 1; j < antennasPositions.length; j++) {
      const secondAntenna = antennasPositions[j];
      const diff = vectorDiff(firstAntenna, secondAntenna);

      const firstAntinode = vectorDiff(diff, firstAntenna);
      const secondAntinode = vectorSum(diff, secondAntenna);

      if (isAntinodeWithinBoundaries(firstAntinode)) {
        antinodesPositions.push(firstAntinode);
      }

      if (isAntinodeWithinBoundaries(secondAntinode)) {
        antinodesPositions.push(secondAntinode);
      }
    }
  }

  return antinodesPositions;
}

function findAntinodesWithHarmonics(antennasPositions: number[][]) {
  let antinodesPositions: number[][] = [];

  for (let i = 0; i < antennasPositions.length; i++) {
    const firstAntenna = antennasPositions[i];
    for (let j = i + 1; j < antennasPositions.length; j++) {
      const secondAntenna = antennasPositions[j];
      const diff = vectorDiff(firstAntenna, secondAntenna);

      let tempFirst = firstAntenna;
      let tempSecond = secondAntenna;

      while (isAntinodeWithinBoundaries(vectorDiff(diff, tempFirst))) {
        tempFirst = vectorDiff(diff, tempFirst);
        antinodesPositions.push(tempFirst);
      }

      while (isAntinodeWithinBoundaries(vectorSum(diff, tempSecond))) {
        tempSecond = vectorSum(diff, tempSecond);
        antinodesPositions.push(tempSecond);
      }
    }
  }

  return antinodesPositions;
}

function vectorDiff(posOne: number[], posTwo: number[]): number[] {
  return posOne.map((elem, index) => posTwo[index] - elem);
}

function vectorSum(posOne: number[], posTwo: number[]): number[] {
  return posOne.map((elem, index) => posTwo[index] + elem);
}

function calculateUniqueLocations(): number {
  let uniquePositions = new Set<string>();

  for (const key in frequencies) {
    const antinodesPositions = findAntinodes(frequencies[key]);

    antinodesPositions.forEach((pos) => {
      uniquePositions.add(pos.toString());
    });
  }

  return uniquePositions.size;
}

function calculateUniqueLocationsWithHarmonics(): number {
  let uniquePositions = new Set<string>();

  for (const key in frequencies) {
    const antinodesPositions = findAntinodesWithHarmonics(frequencies[key]);

    antinodesPositions.forEach((pos) => {
      uniquePositions.add(pos.toString());
    });

    frequencies[key].forEach((pos) => {
      uniquePositions.add(pos.toString());
    });
  }

  return uniquePositions.size;
}

// console.log(calculateUniqueLocations());
console.log(calculateUniqueLocationsWithHarmonics());
