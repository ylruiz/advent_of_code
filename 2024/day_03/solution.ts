import { readFileSync } from "fs";

const filePath = "../inputs/03_12_2024.txt";
// const filePath = "../inputs/test.txt";

function calculateMulMatchesSum(isDoInstructionAllowed: boolean = false) {
  try {
    const rowData = readFileSync(filePath, "utf-8");
    let sum = 0;
    const regex = /mul\((\d+),(\d+)\)/g;
    const matches = rowData.matchAll(regex) ?? [];

    let currentIndex = 0;
    let isEnabled = true;

    for (const match of matches) {
      if (isDoInstructionAllowed) {
        const substring = rowData.substring(currentIndex, match.index);
        currentIndex = match.index + match[0].length;

        if (substring.includes("don't")) {
          isEnabled = false;
        } else if (substring.includes("do")) {
          isEnabled = true;
        }

        sum += isEnabled ? Number(match[1]) * Number(match[2]) : 0;
      } else {
        sum += Number(match[1]) * Number(match[2]);
      }
    }

    console.log(sum);
    return sum;
  } catch (err) {
    console.log(`Error reading filePath: ${filePath}`);
  }
}

calculateMulMatchesSum(); // 173419328
calculateMulMatchesSum(true); // 90669332
