import { readFileSync } from "fs";

const filePath = "../inputs/02_12_2024.txt";
// const filePath = "../inputs/test.txt";

const lines = processRowData();

function processRowData() {
  try {
    const rowData = readFileSync(filePath, "utf-8");
    return rowData.trim().split("\n");
  } catch (err) {
    console.log(`Error reading filePath: ${filePath}`);
  }
}

function calculateTotalOfSafeReports(
  isSingleBadLevelTolerated: boolean = false
) {
  const startTime = performance.now();
  const beforeMemory = process.memoryUsage().heapUsed;

  if (lines) {
    let totalSafeReports = 0;
    let totalSafeReportWithTolerance = 0;

    lines.map((line) => {
      const report = line.trim().split(/\s+/).map(Number);

      if (isSingleBadLevelTolerated) {
        if (isReportSafeWithTolerance(report)) {
          totalSafeReportWithTolerance++;
        }
      } else {
        if (isReportSafe(report)) {
          totalSafeReports++;
        }
      }
    });

    const afterMemory = process.memoryUsage().heapUsed;
    console.log(`Memory used: ${(afterMemory - beforeMemory) / 1024} KB`);

    // The total distance should be equal to 2430334
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log(
      `Time taken by calculateTotalOfSafeReports with isSingleBadLevelTolerated set to ${isSingleBadLevelTolerated}: ${timeTaken.toFixed(
        4
      )} miliseconds`
    );

    if (isSingleBadLevelTolerated) {
      console.log(totalSafeReportWithTolerance);
      return totalSafeReportWithTolerance;
    }

    console.log(totalSafeReports);
    return totalSafeReports;
  }
}

function isReportSafe(report: number[]) {
  let isAsc = report[0] < report[1];
  let i = 0;

  while (i < report.length) {
    if (isLevelUnsafe(isAsc, report[i - 1], report[i])) {
      return false;
    }

    i++;
  }

  return true;
}

function isReportSafeWithTolerance(report: number[]) {
  if (isReportSafe(report)) {
    return true;
  }

  let countUnsafe = 0;
  let i = 0;

  while (i < report.length) {
    const tempReport = report.filter((_, index) => index !== i);

    if (isReportSafe(tempReport)) {
      return true;
    } else {
      countUnsafe++;
    }

    i++;
  }

  return countUnsafe < 2;
}

function isLevelUnsafe(isAsc: boolean, numOne: number, numTwo: number) {
  const absSub = Math.abs(numTwo - numOne);

  return (
    (isAsc && numOne > numTwo) ||
    (!isAsc && numOne < numTwo) ||
    absSub === 0 ||
    absSub > 3
  );
}

calculateTotalOfSafeReports();
calculateTotalOfSafeReports(true);
