import { readFileSync } from "fs";
import * as path from "path";

const filePath = path.join(__dirname, "..", "inputs", "2025", "day_01.txt");

const initialPosition = 50;
const rotationLimit = 100;
let totalRotationToZero = 0;

function processRowData() {
  try {
    const rowData = readFileSync(filePath, "utf-8");
    return rowData.trim().split("\n");
  } catch (err) {
    console.log(`Error reading filePath: ${filePath}`);
  }
}

function rotate() {
  const rotationInstractions = processRowData();

  if (!rotationInstractions) return;

  let currentPosition = initialPosition;

  rotationInstractions.forEach((instruction) => {
    const direction = instruction.charAt(0);
    const amount = parseInt(instruction.substring(1)) % rotationLimit;

    const arrayPosition =
      direction === "L"
        ? rotateLeft(currentPosition, amount)
        : rotateRight(currentPosition, amount);
    currentPosition = arrayPosition;

    if (currentPosition === 0) {
      totalRotationToZero += 1;
    }
  });
}

function rotateRight(currentPosition: number, amount: number): number {
  const newPosition = currentPosition + amount;

  if (newPosition < rotationLimit) {
    return newPosition;
  }

  const difference = rotationLimit - newPosition;

  if (difference < 0) {
    return Math.abs(difference);
  }

  return difference;
}

function rotateLeft(currentPosition: number, amount: number): number {
  const difference = currentPosition - amount;
 
  if (difference < 0) {
    return rotationLimit - Math.abs(difference);
  }

  return currentPosition - amount;
}

console.log("Starting rotation process...");
rotate();
console.log("Total rotation to zero:", totalRotationToZero); // 1145
