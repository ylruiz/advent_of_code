import { readFileSync } from "fs";

// Constants and Types
type Position = [number, number];
type Direction = 0 | 1 | 2 | 3;

const DIRECTIONS: Record<Direction, Position> = {
  0: [-1, 0], // North
  1: [0, 1], // East
  2: [1, 0], // South
  3: [0, -1], // West
};

const TILE_MAP = {
  "#": 1, // Obstacle
  ".": 0, // Empty
  "^": 2, // Initial Position
} as const;

const DEFAULT_POSITION: Position = [0, 0];

// Helper functions
const positionToString = (pos: Position): string => `${pos[0]},${pos[1]}`;

const addPositions = (pos1: Position, pos2: Position): Position =>
  [pos1[0] + pos2[0], pos1[1] + pos2[1]] as Position;

const mod = (x: number, n: number): number => ((x % n) + n) % n;

// Main Walker class
class Guard {
  private position: Position;
  private direction: Direction;
  private readonly visited: Set<string>;
  private readonly visitedStates: Set<string>;

  constructor(position?: Position) {
    this.position = position ?? DEFAULT_POSITION;
    this.direction = 0;
    this.visited = new Set([positionToString(this.position)]);
    this.visitedStates = new Set([this.getState()]);
  }

  // Getters and setters
  setPosition(position: Position): void {
    this.position = position;
    this.direction = 0; // Reset direction
    this.visited.clear(); // Clear previous visited positions
    this.visitedStates.clear(); // Clear previous states
    this.visited.add(positionToString(this.position));
    this.visitedStates.add(this.getState());
  }

  getPosition(): Position {
    return [...this.position] as Position;
  }

  setDirection(direction: Direction): void {
    this.direction = direction;
  }

  getDirection(): Direction {
    return this.direction;
  }

  private getState(): string {
    return `${positionToString(this.position)},${this.direction}`;
  }

  private getNextPosition(): Position {
    return addPositions(this.position, DIRECTIONS[this.direction]);
  }

  private turn(): void {
    this.direction = mod(this.direction + 1, 4) as Direction;
  }

  private move(): boolean {
    this.position = this.getNextPosition();
    const posKey = positionToString(this.position);
    this.visited.add(posKey);

    const state = this.getState();

    if (this.visitedStates.has(state)) {
      return true; // Loop detected
    }
    this.visitedStates.add(state);
    return false;
  }

  isInBounds(size: number): boolean {
    return this.position.every((val) => val >= 0 && val < size);
  }

  hasObstacleAhead(obstacles: Set<string>): boolean {
    return obstacles.has(positionToString(this.getNextPosition()));
  }

  walk(obstacles: Set<string>, size: number): number {
    while (this.isInBounds(size)) {
      while (this.hasObstacleAhead(obstacles)) {
        this.turn();
      }
      this.move();
    }
    return this.visited.size - 1;
  }

  walkUntilLoop(obstacles: Set<string>, size: number): boolean {
    while (this.isInBounds(size)) {
      while (this.hasObstacleAhead(obstacles)) {
        this.turn();
      }

      if (this.move()) {
        return true;
      }
    }
    return false;
  }
}

function init(input: string): {
  size: number;
  startPos: Position;
  obstacles: Set<string>;
  possibleObstaclePos: Position[];
} {
  const lines = input.split(/\s+/);
  const size = lines.length;
  const obstacles = new Set<string>();
  const possibleObstaclePos: Position[] = [];
  let startPos: Position = [0, 0];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = TILE_MAP[lines[i][j] as keyof typeof TILE_MAP];
      const pos: Position = [i, j];

      if (value === 2) {
        startPos = pos;
      } else if (value === 1) {
        obstacles.add(positionToString(pos));
      } else {
        possibleObstaclePos.push(pos);
      }
    }
  }

  return { size, startPos, obstacles, possibleObstaclePos };
}

function calculateTotalPosVisited(filePath: string): number {
  const input = readFileSync(filePath, "utf-8");
  const { size, startPos, obstacles } = init(input);
  const guard = new Guard(startPos);
  return guard.walk(obstacles, size);
}

function calculateTotalPossibleObstacles(filePath: string): number {
  const input = readFileSync(filePath, "utf-8");
  const { size, startPos, obstacles, possibleObstaclePos } = init(input);

  let loopCount = 0;
  const guard = new Guard(startPos); // Create single guard instance

  for (let i = 0; i < possibleObstaclePos.length; i++) {
    guard.setPosition(startPos); // Reset guard state for each iteration

    const testObstacles = new Set(obstacles);
    testObstacles.add(positionToString(possibleObstaclePos[i]));

    const isObstaclePlaced = guard.walkUntilLoop(testObstacles, size);

    if (isObstaclePlaced) {
      loopCount++;
      console.log(`Loop found: ${loopCount}`); // Better logging
    }
  }

  return loopCount; // Remove the -1, it's not needed
}

// console.log(calculateTotalPosVisited("../inputs/06_12_2024.txt"));
// console.log(calculateTotalPossibleObstacles("../inputs/06_12_2024.txt"));
