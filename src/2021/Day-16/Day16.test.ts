import { readExampleIntoLines, readFileIntoLines } from "../../utils/readFile";

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

  test("Part 02 - ..", () => {
    // ...
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

type Hex = keyof typeof hexBin;

function solve(line: string) {
  const chars = line.split("");
  const bin = chars.map((c) => hexBin[c as Hex]);
  const binaryFull = bin.join("").split("").join("");

  console.log("!!!             !!!!!!!!!!!!!      !!!!!!!1");
  console.log(`binary`, line, binaryFull);

  const packageSet = new Set<Package>();
  const outermostPackage = parsePackage(0);

  // Part 1 - parse the hierarchy of the packets throughout the transmission and add up all of the version numbers.
  const versionSum = [...packageSet]
    .map((p) => p.version)
    .reduce((a, b) => a + b, 0);

  console.log({
    versionSum,
    outermostPackage,
  });

  return {
    versionSum,
  };

  interface Package {
    version: number;
    typeId: number;
    endIndex: number; // not included
    // one or the other
    decimalValue?: number;
    subPackages: Package[];
  }

  // The BITS transmission contains a single packet at its outermost layer
  // which itself contains many other packets.
  // ----
  // The hexadecimal representation of this packet might encode a few extra 0 bits at the end; these are not part of the transmission and should be ignored.
  function parsePackage(
    startingAt: number,
    binary = binaryFull
    // until?: { packageNumber: number } | { bla: number }
  ): Package {
    // Every packet begins with a standard header:
    // - the FIRST THREE BITS encode the packet VERSION,
    // - the NEXT THREE BITs encode the packet TYPE ID.
    // ...
    const [version, typeId] = [
      binary.slice(startingAt, startingAt + 3),
      binary.slice(startingAt + 3, startingAt + 6),
    ].map(toDec);

    const subPackages: Package[] = [];
    let cursor = startingAt + 6;
    let decimalValue: number | undefined = undefined;

    console.log("parsing pack, header:", { version, typeId, cursor });

    if (typeId === 4) {
      // Packets with type ID 4 represent a LITERAL VALUE. -> encode a single binary number
      // To do this, the binary number is padded with leading zeroes until its LENGTH IS A MULTIPLE OF FOUR BITS,
      //  and then it is broken into GROUPS OF FOUR BITS.
      // Each group is prefixed by a 1 bit except the last group, which is prefixed by a 0 bit.
      // These GROUPS OF FIVE BITS immediately follow the packet header.
      let hasEnded = false;
      let literalValueBits = "";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const groupOfFive = [...binary.slice(cursor).matchAll(/.{5}/g)].flatMap(
        ([group]) => {
          if (hasEnded) return [];
          if (group.startsWith("0")) hasEnded = true;
          const valueBits = group.slice(1);
          literalValueBits += valueBits;
          cursor += group.length;
          return [group];
        }
      );
      decimalValue = toDec(literalValueBits);
      console.log(`decimalValue`, decimalValue);
    } else {
      // other TYPE IDs are operator that performs some calculation on one or more sub-packets contained within.
      // An OPERATOR packet contains one or more packets
      // the bit immediately after the packet header is called the LENGTH TYPE ID:
      const lengthTypeId = binary[cursor];
      cursor += 1;

      if (lengthTypeId === "0") {
        /// If the length type ID is 0,
        //    then the NEXT 15 BITS are a number that represents the TOTAL LENGTH IN BITS OF THE SUB-PACKETS contained by this packet.
        const numberBitsInSubPackets = toDec(binary.slice(cursor, cursor + 15)); // end index not included ;
        cursor += 15;

        let bitsRemaining = numberBitsInSubPackets;
        const subPaketBinary = binary.slice(
          cursor,
          cursor + numberBitsInSubPackets
        );

        cursor += numberBitsInSubPackets;
        // After reading 11 and 16 bits of sub-packet data, the total length indicated in L (27) is reached, and so parsing of this packet stops.
        while (bitsRemaining > 0) {
          const startSubAt = numberBitsInSubPackets - bitsRemaining;
          const subPacket = parsePackage(startSubAt, subPaketBinary);
          subPackages.push(subPacket);
          bitsRemaining -= subPacket.endIndex - startSubAt; // TODO this should not be negative i gues
        }
      } else if (lengthTypeId) {
        // If the length type ID is 1,
        //  then the NEXT 11 BITS are a number that represents the NUMBER OF SUB-PACKETS IMMEDIATELY CONTAINED BY THIS PACKET.
        // After reading 3 complete sub-packets, the number of sub-packets indicated in L (3) is reached, and so parsing of this packet stops.
        const numberOfSubpackages = toDec(binary.slice(cursor, cursor + 11)); // end index not included
        cursor += 11;
        console.log(`numberOfSubpackages !!`, numberOfSubpackages);

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
      endIndex: cursor,
    };
    packageSet.add(parsedPackage);
    return parsedPackage;
  }

  function toDec(s: string) {
    return parseInt(s, 2);
  }
}
