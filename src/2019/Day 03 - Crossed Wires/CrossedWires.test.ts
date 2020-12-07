import { readFileIntoLines } from "../../utils/readFile"

type WirePathStr = string
type XY = { x: number; y: number }
type XYStepPath = { x: number; y: number; steps: number }

function instructionToXYMovement(instruction: string): XY {
  const [direction, value] = [
    instruction.substr(0, 1),
    Number(instruction.substr(1)),
  ]
  return {
    x: direction === "R" ? value : direction === "L" ? value * -1 : 0,
    y: direction === "U" ? value : direction === "D" ? value * -1 : 0,
  }
}

function getManhattanDistance({ x, y }: XY) {
  return Math.abs(x) + Math.abs(y)
}

function getManhattanDistanceClosestIntersection(
  wireAStr: WirePathStr,
  wireBStr: WirePathStr
): number {
  const wireA = wireStrToXYPath(wireAStr)
  const wireB = wireStrToXYPath(wireBStr)
  const intersections = wireA
    .flatMap((val, i, arr) => {
      if (!i) return []
      return getIntersectionsOnPath([arr[i - 1], val], wireB)
    })
    .map((intersection) => ({
      ...intersection,
      manhattanDistance: getManhattanDistance(intersection),
    }))

  return intersections.length
    ? Math.min(...intersections.map((i) => i.manhattanDistance))
    : 0
}

function wireStrToXYPath(wireStr: WirePathStr): XYStepPath[] {
  const xyPath: XYStepPath[] = [{ x: 0, y: 0, steps: 0 }]
  const instructions = wireStr.split(",")

  for (const instruction of instructions) {
    const latestPos = xyPath[xyPath.length - 1]
    const movement = instructionToXYMovement(instruction)

    xyPath.push({
      x: latestPos.x + movement.x,
      y: latestPos.y + movement.y,
      steps: latestPos.steps + Math.abs(movement.x) + Math.abs(movement.y),
    })
  }

  return xyPath
}

function getLineIntersect(
  { x: x1, y: y1 }: XY,
  { x: x2, y: y2 }: XY,
  { x: x3, y: y3 }: XY,
  { x: x4, y: y4 }: XY
): XY | null {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  // Lines are parallel
  if (!denom) {
    return null
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom

  // Get the intersection point
  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    return { x: x1 + ua * (x2 - x1), y: y1 + ua * (y2 - y1) }
  }

  return null
}

function countSteps(a: XY, b: XY) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function getIntersectionsOnPath(
  pathPart: [XYStepPath, XYStepPath],
  wireIntersecting: XYStepPath[]
): XYStepPath[] {
  const [fromA, toA] = pathPart
  return wireIntersecting.flatMap<XYStepPath>((val, i, arr) => {
    if (!i) return []
    const [fromB, toB] = [arr[i - 1], val]
    const lineIntersect = getLineIntersect(fromA, toA, fromB, toB)

    if (lineIntersect) {
      if (lineIntersect.x === 0 && lineIntersect.y === 0) return []
      const additionalStepsA = countSteps(fromA, lineIntersect)
      const additionalStepsB = countSteps(fromB, lineIntersect)
      return [
        {
          ...lineIntersect,
          steps:
            fromA.steps + fromB.steps + additionalStepsA + additionalStepsB,
        },
      ]
    }
    return []
  })
}

function getFewestCombinedSteps(
  wireAStr: WirePathStr,
  wireBStr: WirePathStr
): number {
  const wireA = wireStrToXYPath(wireAStr)
  const wireB = wireStrToXYPath(wireBStr)
  const intersections = wireA.flatMap((val, i, arr) => {
    if (!i) return []
    return getIntersectionsOnPath([arr[i - 1], val], wireB)
  })

  return intersections.length
    ? Math.min(...intersections.map((intersection) => intersection.steps))
    : 0
}

describe("Crossed Wires", () => {
  describe("What is the Manhattan distance from the central port to the closest intersection?", () => {
    test("Examples", () => {
      expect(
        getManhattanDistanceClosestIntersection("R8,U5,L5,D3", "U7,R6,D4,L4")
      ).toEqual(6)
      expect(
        getManhattanDistanceClosestIntersection(
          "R75,D30,R83,U83,L12,D49,R71,U7,L72",
          "U62,R66,U55,R34,D71,R55,D58,R83"
        )
      ).toEqual(159)
      expect(
        getManhattanDistanceClosestIntersection(
          "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
          "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
        )
      ).toEqual(135)
    })

    test("Input Data", () => {
      const [wireA, wireB] = readFileIntoLines(`${__dirname}/input.txt`)

      expect(
        getManhattanDistanceClosestIntersection(wireA, wireB)
      ).toMatchInlineSnapshot(`316`)
    })
  })

  describe("What is the fewest combined steps the wires must take to reach an intersection?", () => {
    test("Examples", () => {
      expect(getFewestCombinedSteps("R8,U5,L5,D3", "U7,R6,D4,L4")).toEqual(30)
      expect(
        getFewestCombinedSteps(
          "R75,D30,R83,U83,L12,D49,R71,U7,L72",
          "U62,R66,U55,R34,D71,R55,D58,R83"
        )
      ).toEqual(610)
      expect(
        getFewestCombinedSteps(
          "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51",
          "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"
        )
      ).toEqual(410)
    })

    test("Input Data", () => {
      const [wireA, wireB] = readFileIntoLines(`${__dirname}/input.txt`)
      expect(getFewestCombinedSteps(wireA, wireB)).toMatchInlineSnapshot(
        `16368`
      )
    })
  })
})
