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

function calculateTotalOfSafeReports() {
  const startTime = performance.now();
  const beforeMemory = process.memoryUsage().heapUsed;

  if (lines) {
    let totalSafeReports = 0;

    lines.map((line) => {
      const report = line.trim().split(/\s+/).map(Number);

      if (isReportSafe(report)) {
        totalSafeReports++;
      }
    });

    // The total distance should be equal to 2430334
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log(
      `Time taken by calculateTotalDistance: ${timeTaken.toFixed(
        4
      )} miliseconds`
    );

    console.log(totalSafeReports);
    return totalSafeReports;
  }
}

function isReportSafe(report: number[]) {
  let isAsc = report[0] < report[1];
  let i = 0;

  while (i < report.length) {
    if (
      (isAsc && report[i - 1] > report[i]) ||
      (!isAsc && report[i - 1] < report[i])
    ) {
      return false;
    }

    const absSub = Math.abs(report[i] - report[i - 1]);
    if (absSub === 0 || absSub > 3) {
      return false;
    }

    i++;
  }

  return true;
}

calculateTotalOfSafeReports();
