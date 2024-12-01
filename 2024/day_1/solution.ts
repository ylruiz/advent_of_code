import { readFileSync } from "fs";

const filePath =
  "/Users/ylruiz/Documents/personal/advent_of_code/inputs/01_12_2024.txt";
const lines = processRowData();
let groupOneLocationIds: number[] = [];
let groupTwoLocationIds: number[] = [];

function processRowData() {
  try {
    const rowData = readFileSync(filePath, "utf-8");
    return rowData.trim().split("\n");
  } catch (err) {
    console.log(`Error reading filePath: ${filePath}`);
  }
}

function fillLocationIds() {
  if (lines) {
    lines.map((line) => {
      const [groupOneLocationId, groupTwoLocationId] = line
        .trim()
        .split(/\s+/)
        .map(Number);
      groupOneLocationIds.push(groupOneLocationId);
      groupTwoLocationIds.push(groupTwoLocationId);
    });
  }
}

// 1. Pair up the smallest number in the left list with the smallest number in the right list,
//    then the second-smallest left number with the second-smallest right number, and so on.
// 2. Figure out how far apart the two numbers are.
// 3. Add up all of those distances.
function calculateTotalDistance() {
  if (lines) {
    let totalDistance = 0;

    groupOneLocationIds.sort((a, b) => a - b);
    groupTwoLocationIds.sort((a, b) => a - b);

    for (let i = 0; i < lines.length; i++) {
      totalDistance += Math.abs(groupOneLocationIds[i] - groupTwoLocationIds[i]);
    }

    console.log(totalDistance); // The total distance should be equal to 2430334
    return totalDistance;
  }
}

// 1. Figure out exactly how often each number from the left list appears in the right list.
// 2. Calculate a total similarity score by adding up each number in the left list after
//    multiplying it by the number of times that number appears in the right list.
function calculateSimilarityScores() {
  const lines = processRowData();

  if (lines) {
    let similarityScores = 0;
    const groupTwoCounts: { [key: number]: number } = {};

    for (let i = 0; i < groupTwoLocationIds.length; i++) {
      groupTwoCounts[groupTwoLocationIds[i]] =
        (groupTwoCounts[groupTwoLocationIds[i]] || 0) + 1;
    }

    for (let i = 0; i < groupOneLocationIds.length; i++) {
      similarityScores +=
        groupOneLocationIds[i] * (groupTwoCounts[groupOneLocationIds[i]] || 0);
    }

    console.log(similarityScores); // The total distance should be equal to 28786472
    return similarityScores;
  }
}

fillLocationIds();

const startCalculateTotalDistanceTime = performance.now();
calculateTotalDistance();
const endTotalDistanceTime = performance.now();
const timeTakenByCalculateTotalDistance =
  endTotalDistanceTime - startCalculateTotalDistanceTime;
console.log(
  `Time taken by calculateTotalDistance: ${timeTakenByCalculateTotalDistance.toFixed(
    4
  )} miliseconds`
);

const startCalculateSimilarityScoresTime = performance.now();
calculateSimilarityScores();
const endCalculateSimilarityScoresTime = performance.now();
const timeCalculateSimilarityScoresDistance =
  endCalculateSimilarityScoresTime - startCalculateSimilarityScoresTime;
console.log(
  `Time taken by calculateTotalDistance: ${timeCalculateSimilarityScoresDistance.toFixed(
    4
  )} miliseconds`
);