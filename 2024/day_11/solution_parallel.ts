import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';


import { readFileSync } from "fs";

// const filePath = "../inputs/11_12_2024.txt";
// // const filePath = "../inputs/test.txt";

// let stones: number[] = [];
// function processData() {
//   try {
//     const rowData = readFileSync(filePath, "utf-8");
//     stones = rowData.trim().split(" ").map(Number);
//   } catch (err) {
//     console.log(`Error reading filePath: ${filePath}`);
//   }
// }

// processData();


function evolveStone(index: number, stoneData: number[]) {
    if (stoneData[index] === 0) {
        stoneData[index] = 1;
        return 0;
    }

    let tempStone = stoneData[index].toString();
    if (tempStone.length % 2 === 0) {
        const leftStone = parseInt(tempStone.substring(0, tempStone.length / 2));
        const rightStone = parseInt(
            tempStone.substring(tempStone.length / 2, tempStone.length)
        );
        stoneData.splice(index, 1, leftStone, rightStone);
        return 1;
    }
    stoneData[index] *= 2024;
    return 0;
}

if (isMainThread) {
    // Read file once in main thread
    const filePath = "../inputs/11_12_2024.txt";
    let stones: number[] = [];
    try {
        const rowData = readFileSync(filePath, "utf-8");
        stones = rowData.trim().split(" ").map(Number);
    } catch (err) {
        console.log(`Error reading filePath: ${filePath}`);
        process.exit(1);
    }

    async function evolveAllStonesParallel(stoneData: number[]): Promise<number[]> {
        const numWorkers = 4;
        const chunkSize = Math.ceil(stoneData.length / numWorkers);
        const workers: Promise<number[]>[] = [];

        for (let i = 0; i < numWorkers; i++) {
            const startIndex = i * chunkSize;
            const endIndex = Math.min((i + 1) * chunkSize, stoneData.length);
            const chunk = stoneData.slice(startIndex, endIndex);

            workers.push(
                new Promise((resolve, reject) => {
                    const worker = new Worker(__filename, {
                        workerData: { 
                            stoneData: chunk, 
                            startIndex: 0, 
                            endIndex: chunk.length 
                        }
                    });

                    worker.on('message', resolve);
                    worker.on('error', reject);
                    worker.on('exit', (code) => {
                        if (code !== 0) {
                            reject(new Error(`Worker stopped with exit code ${code}`));
                        }
                    });
                })
            );
        }

        const results = await Promise.all(workers);
        return results.reduce((acc: number[], curr: number[]) => acc.concat(curr), []);
    }

    async function calculateTotalStones(stoneData: number[], timeSteps: number) {
        const start = performance.now();
        
        for (let t = 0; t < timeSteps; t++) {
            stoneData = await evolveAllStonesParallel(stoneData);
            console.log(`Finish with t = ${t}`);
        }
        
        const end = performance.now();
        console.log(`Execution time: ${end - start} milliseconds`);
        return stoneData.length;
    }

    // Start the calculation with the stones array we read
    calculateTotalStones(stones, 75).then(result => {
        console.log(`Final number of stones: ${result}`);
    });

} else {
    // Worker thread code
    let index = workerData.startIndex;
    const stoneData = workerData.stoneData;
    
    while (index < workerData.endIndex && index < stoneData.length) {
        const shift = evolveStone(index, stoneData);
        index = index + 1 + shift;
    }
    
    parentPort?.postMessage(stoneData);
}