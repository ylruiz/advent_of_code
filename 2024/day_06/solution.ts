import { readFileSync } from "fs";

const filePath = "../inputs/06_12_2024.txt";
// const filePath = "../inputs/test.txt";

enum Direction {
  Up = "^",
  Down = "v",
  Left = "<",
  Right = ">",
}

enum PositionStatus {
  Visitable = "Visitable",
  Obstructed = "Obstructed",
  Visited = "Visited",
}

type Position = {
  x: number;
  y: number;
  status?: PositionStatus;
};

type Range = {
  startPos: Position;
  endPos: Position;
};

class Guard {
  private _currentPos: Position = { x: -1, y: -1 };
  private _currentDir: Direction = Direction.Up;
  private _totalPlacesVisited: number = 0;

  get currentPos(): Position {
    return this._currentPos;
  }

  set currentPos(newPos: Position) {
    this._currentPos = newPos;
  }

  get currentDir(): Direction {
    return this._currentDir;
  }

  set currentDir(newDir: Direction) {
    this._currentDir = newDir;
  }

  get totalPlacesVisited(): number {
    return this._totalPlacesVisited;
  }

  set totalPlacesVisited(newTotal: number) {
    if (newTotal >= 0) {
      this._totalPlacesVisited = newTotal;
    } else {
      console.error("Total visited positions cannot be negative");
    }
  }

  init(initialPos: Position) {
    this._currentPos = initialPos;
    this._currentDir = Direction.Up;
    this._totalPlacesVisited++;
  }

  move(newPos: Position, newDir: Direction, placesVisited: number) {
    const dir = this.currentDir;

    this.currentPos = newPos;
    this.currentDir = newDir;
    this.totalPlacesVisited += placesVisited;
  }
}

class LabMap {
  private _guard: Guard = new Guard();
  private _positions: Record<number, PositionStatus[]> = {};

  get guard(): Guard {
    return this._guard;
  }

  set guard(newGuard: Guard) {
    if (newGuard) {
      this._guard = newGuard;
    } else {
      console.error("Guard cannot be null or undefined.");
    }
  }

  get availableMovePositions(): Position[] {
    const initialRange = this.moveRange(null);
    const startX = initialRange.startPos.x;
    const endX = initialRange.endPos.x;
    const startY = initialRange.startPos.y;
    const endY = initialRange.endPos.y;

    let subarray: Position[] = [];

    for (const key in this._positions) {
      const keyNum = Number(key);

      if (keyNum >= startX && keyNum <= endX) {
        const positionStatuses = this._positions[keyNum];

        for (let i = 0; i < positionStatuses.length; i++) {
          if (i >= startY && i <= endY) {
            subarray.push({ x: keyNum, y: i, status: positionStatuses[i] });
          }
        }
      }
    }

    return subarray;
  }

  moveRange(lastPos?: Position | null): Range {
    const direction = this.guard.currentDir;
    const currentPos = this.guard.currentPos;

    switch (direction) {
      case Direction.Up:
        return {
          startPos: lastPos ?? { x: 0, y: currentPos.y },
          endPos: currentPos,
        };
      case Direction.Down:
        return {
          startPos: currentPos,
          endPos: lastPos ?? {
            x: Math.max(...Object.keys(this._positions).map(Number)),
            y: currentPos.y,
          },
        };
      case Direction.Right:
        return {
          startPos: currentPos,
          endPos: lastPos ?? {
            x: currentPos.x,
            y: this._lengthOfEntryByKey(currentPos.x),
          },
        };
      case Direction.Left:
        return {
          startPos: lastPos ?? {
            x: currentPos.x,
            y: 0,
          },
          endPos: currentPos,
        };
      default:
        console.error(`Direction ${direction} is not supported in getMinKey`);
        return {
          startPos: { x: -1, y: -1 },
          endPos: { x: -1, y: -1 },
        };
    }
  }

  get nextPos(): Position {
    const direction = this._guard.currentDir;
    let positions = this.availableMovePositions.filter(
      (pos) => pos.status == PositionStatus.Obstructed
    );

    if (positions.length > 0) {
      switch (direction) {
        case Direction.Up:
        case Direction.Left:
          return positions[positions.length - 1];
        case Direction.Down:
        case Direction.Right:
          return positions[0];
        default:
          console.error(`Direction ${direction} is not supported in getMinKey`);
          return { x: -1, y: -1 };
      }
    }

    positions = this.availableMovePositions.filter(
      (pos) => pos.status == PositionStatus.Visitable
    );

    if (positions.length > 0) {
      switch (direction) {
        case Direction.Up:
          return {
            x: 0,
            y: positions[positions.length - 1].y,
          };
        case Direction.Left:
          return {
            x: positions[positions.length - 1].x,
            y: 0,
          };
        case Direction.Down:
          return {
            x: Math.max(...Object.keys(this._positions).map(Number)),
            y: positions[positions.length - 1].y,
          };
        case Direction.Right:
          return {
            x: positions[positions.length - 1].x,
            y: this._lengthOfEntryByKey(positions[positions.length - 1].y),
          };
        default:
          console.error(`Direction ${direction} is not supported in getMinKey`);
          return { x: -1, y: -1 };
      }
    }

    return { x: -1, y: -1 };
  }

  get hasObstacles(): boolean {
    return this.nextPos.x > -1 && this.nextPos.y > -1;
  }

  get isLastRound(): boolean {
    return (
      !this.hasObstacles &&
      this.availableMovePositions.filter(
        (pos) => pos.status === PositionStatus.Visitable
      ).length > 0
    );
  }

  _lengthOfEntryByKey(key: number): number {
    if (this._positions[key]) {
      return this._positions[key].length;
    } else {
      console.log(`Key ${key} not found in positions.`);
      return -1;
    }
  }

  addPosition(posId: number, status: PositionStatus) {
    if (!this._positions[posId]) {
      this._positions[posId] = [];
    }

    this._positions[posId].push(status);
  }

  updatePosition(key: number, index: number, status: PositionStatus) {
    if (!this._positions[key]) {
      console.error(`Key ${key} does not exist in positions.`);
      return;
    }

    if (index < 0 || index >= this._positions[key].length) {
      console.error(`Index ${index} is out of bounds for key ${key}.`);
      return;
    }

    this._positions[key][index] = status;
  }

  executeGuardPatrolProtocol(range: Range): number {
    let totalPlacesVisited = 0;
    const startX = range.startPos.x;
    const endX = range.endPos.x;
    const startY = range.startPos.y;
    const endY = range.endPos.y;

    // console.log(this._guard);
    console.log(range);

    for (const key in this._positions) {
      const keyNum = Number(key);

      if (keyNum >= startX && keyNum <= endX) {
        const positionStatuses = this._positions[keyNum];

        for (let i = 0; i < positionStatuses.length; i++) {
          if (
            i >= startY &&
            i <= endY &&
            positionStatuses[i] === PositionStatus.Visitable
          ) {
            this.updatePosition(keyNum, i, PositionStatus.Visited);
            totalPlacesVisited++;
          }
        }
      }
    }

    return totalPlacesVisited;
  }
}

function initLabMap() {
  const rowData = readFileSync(filePath, "utf-8");

  let labMap = new LabMap();

  rowData
    .trim()
    .split("\n")
    .map((line, key) => {
      const positions = line.split("");

      positions.forEach((pos, index) => {
        switch (pos) {
          case ".":
            labMap.addPosition(key, PositionStatus.Visitable);
            break;
          case "#":
            labMap.addPosition(key, PositionStatus.Obstructed);
            break;
          case "^":
            labMap.addPosition(key, PositionStatus.Visited);
            labMap.guard.init({ x: key, y: index });
            break;
          default:
            console.error("The value in pos is invalid.");
            break;
        }
      });
    });

  return labMap;
}

function calculateTotalGuardVisitedPos() {
  let labMap = initLabMap();
  let guard = labMap.guard;

  while (labMap.hasObstacles || labMap.isLastRound) {
    const nextPos = labMap.nextPos;
    let placesVisited = labMap.executeGuardPatrolProtocol(
      labMap.moveRange(nextPos)
    );

    switch (guard.currentDir) {
      case Direction.Up:
        guard.move(
          {
            x: nextPos.x + 1,
            y: nextPos.y,
          },
          labMap.hasObstacles ? Direction.Right : Direction.Up,
          placesVisited
        );
        break;
      case Direction.Down:
        guard.move(
          {
            x: nextPos.x - 1,
            y: nextPos.y,
          },
          labMap.hasObstacles ? Direction.Left : Direction.Down,
          placesVisited
        );
        break;
      case Direction.Right:
        guard.move(
          {
            x: nextPos.x,
            y: nextPos.y - 1,
          },
          labMap.hasObstacles ? Direction.Down : Direction.Right,
          placesVisited
        );
        break;
      case Direction.Left:
        guard.move(
          {
            x: nextPos.x,
            y: nextPos.y + 1,
          },
          labMap.hasObstacles ? Direction.Up : Direction.Left,
          placesVisited
        );
        break;
      default:
        console.error(`Direction ${guard.currentDir} is not supported`);
        break;
    }
  }

  console.log(guard.totalPlacesVisited);
  return guard.totalPlacesVisited;
}

calculateTotalGuardVisitedPos();
