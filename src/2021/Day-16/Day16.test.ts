import { readFileIntoLines } from "../../utils/readFile";

// https://adventofcode.com/2021/day/16
describe("Day 16: Packet Decoder", () => {
  const input = readFileIntoLines(__dirname + "/input.txt");

  test("Part 01 - what do you get if you add up the version numbers in all packets?", () => {
    expect(solve("D2FE28"));
    expect(solve("38006F45291200"));
    expect(solve("EE00D40C823060"));
    expect(solve("8A004A801A8002F478").versionSum).toBe(16);
    expect(solve("620080001611562C8802118E34").versionSum).toBe(12);
    expect(solve("C0015000016115A2E0802F182340").versionSum).toBe(23);
    expect(solve("A0016C880162017C3686B18A3D4780").versionSum).toBe(31);
    expect(solve(input[0]).versionSum).toBe(989);
  });

  test("Part 02 - What do you get if you evaluate the expression represented by your hexadecimal-encoded BITS transmission?", () => {
    expect(solve("C200B40A82").value).toBe(3);
    expect(solve("04005AC33890").value).toBe(54);
    expect(solve(input[0]).value).toBe(7936430475134);
  });
});

const hexBin = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};
const { min, max } = Math;

type Hex = keyof typeof hexBin;

interface Package {
  version: number;
  typeId: number;
  endIndex: number; // not included in package
  decimalValue?: number;
  value?: number;
  subPackages: Package[];
}

function solve(line: string) {
  const chars = line.split("");
  const bin = chars.map((c) => hexBin[c as Hex]);
  const binaryFull = bin.join("").split("").join("");

  const packageSet = new Set<Package>();
  const outermostPackage = parsePackage(0);

  // Part 1 - parse the hierarchy of the packets throughout the transmission and add up all of the version numbers.
  const versionSum = [...packageSet]
    .map((p) => p.version)
    .reduce((a, b) => a + b, 0);

  return {
    versionSum,
    // Part 2
    get value() {
      return outermostPackage.value;
    },
  };

  function parsePackage(startingAt: number, binary = binaryFull): Package {
    // Every packet begins with a standard header:
    // - the FIRST THREE BITS encode the packet VERSION,
    // - the NEXT THREE BITs encode the packet TYPE ID.
    const [version, typeId] = [
      binary.slice(startingAt, startingAt + 3),
      binary.slice(startingAt + 3, startingAt + 6),
    ].map(toDec);

    const subPackages: Package[] = [];

    let cursor = startingAt + 6;
    let decimalValue: number | undefined = undefined;

    if (typeId === 4) {
      // Packets with type ID 4 represent a LITERAL VALUE -> encode a single binary number
      let hasEnded = false;
      let literalValueBits = "";

      [...binary.slice(cursor).matchAll(/.{5}/g)].flatMap(([group]) => {
        if (hasEnded) return [];
        if (group.startsWith("0")) hasEnded = true;
        const valueBits = group.slice(1);
        literalValueBits += valueBits;
        cursor += group.length;
        return [group];
      });

      decimalValue = toDec(literalValueBits);
    } else {
      // Other TYPE IDs are operator that performs some calculation on one or more sub-packets contained within.
      // An OPERATOR packet contains one or more packets
      // the bit immediately after the packet header is called the LENGTH TYPE ID:
      const lengthTypeId = binary[cursor];
      cursor += 1;

      if (lengthTypeId === "0") {
        const numberBitsInSubPackets = toDec(binary.slice(cursor, cursor + 15));
        cursor += 15;

        let bitsRemaining = numberBitsInSubPackets;
        const subPaketBinary = binary.slice(
          cursor,
          cursor + numberBitsInSubPackets
        );
        cursor += numberBitsInSubPackets;

        while (bitsRemaining > 0) {
          const startSubAt = numberBitsInSubPackets - bitsRemaining;
          const subPacket = parsePackage(startSubAt, subPaketBinary);
          subPackages.push(subPacket);
          bitsRemaining -= subPacket.endIndex - startSubAt;
        }
      } else if (lengthTypeId) {
        const numberOfSubpackages = toDec(binary.slice(cursor, cursor + 11)); // end index not included
        cursor += 11;

        while (subPackages.length < numberOfSubpackages) {
          const startSubAt = cursor;
          const subPacket = parsePackage(startSubAt, binary);
          subPackages.push(subPacket);
          cursor = subPacket.endIndex;
        }
      }
    }

    const parsedPackage: Package = {
      version,
      typeId,
      subPackages,
      decimalValue,
      get value(): number {
        const subValues = subPackages.map((p) => p.decimalValue ?? p.value!);
        switch (typeId) {
          case 0:
            return subValues.reduce((a, b) => a + b, 0);
          case 1:
            return subValues.reduce((a, b) => a * b, 1);
          case 2:
            return min(...subValues);
          case 3:
            return max(...subValues);
          case 5: {
            const [first, second] = subValues;
            return first > second ? 1 : 0;
          }
          case 6: {
            const [first, second] = subValues;
            return first < second ? 1 : 0;
          }
          case 7: {
            const [first, second] = subValues;
            return first === second ? 1 : 0;
          }
          default:
            throw Error("unknown value " + typeId);
        }
      },
      endIndex: cursor,
    };
    packageSet.add(parsedPackage);
    return parsedPackage;
  }

  function toDec(s: string) {
    return parseInt(s, 2);
  }
}
