import { readFileSync } from "fs";

const filePath = "../inputs/07_12_2024.txt";
// const filePath = "../inputs/test.txt";

const testValues: number[] = [];
const equations: number[][] = [];

function processData() {
  try {
    const rowData = readFileSync(filePath, "utf-8");
    const lines = rowData.trim().split("\n");

    lines.map((l) => {
      const line = l.split(":");
      testValues.push(parseInt(line[0]));
      equations.push(line[1].trim().split(" ").map(Number));
    });
  } catch (err) {
    console.log(`Error reading filePath: ${filePath}`);
  }
}

processData();

function validateEquation(
  testValue: number,
  equation: number[],
  currentValue: number,
  currentIndex: number,
  isConcatenationOperatorEnabled: boolean = false
): boolean {
  if (currentIndex === equation.length - 1) {
    return currentValue === testValue;
  }

  if (
    validateEquation(
      testValue,
      equation,
      currentValue + equation[currentIndex + 1],
      currentIndex + 1,
      isConcatenationOperatorEnabled
    )
  ) {
    return true;
  }

  if (
    validateEquation(
      testValue,
      equation,
      currentValue * equation[currentIndex + 1],
      currentIndex + 1,
      isConcatenationOperatorEnabled
    )
  ) {
    return true;
  }

  if (
    isConcatenationOperatorEnabled &&
    validateEquation(
      testValue,
      equation,
      parseInt(currentValue.toString() + equation[currentIndex + 1]),
      currentIndex + 1,
      isConcatenationOperatorEnabled
    )
  ) {
    return true;
  }

  return false;
}

function calculateTotalCalibration() {
  let totalCalibration = 0;
  let totalCalibrationWithConcatanation = 0;

  testValues.forEach((value, index) => {
    if (validateEquation(value, equations[index], equations[index][0], 0)) {
      totalCalibration += value;
    }

    if (
      validateEquation(value, equations[index], equations[index][0], 0, true)
    ) {
      totalCalibrationWithConcatanation += value;
    }
  });

  console.log([totalCalibration, totalCalibrationWithConcatanation]);

  return [totalCalibration, totalCalibrationWithConcatanation];
}

calculateTotalCalibration();
