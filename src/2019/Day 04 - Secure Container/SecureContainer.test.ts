/**
 You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.
 However, they do remember a few key facts about the password:
 - The value is within the range given in your puzzle input.
 - It is a six-digit number.
 - Two adjacent digits are the same (like 22 in 122345).
 - Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
**/

describe("Secure Container", () => {
  describe("How many different passwords within the range given in your puzzle input meet these criteria?", () => {
    test("Examples", () => {
      expect(isValidPassword("111111")).toBeTruthy()
      expect(isValidPassword("223450")).toBeFalsy()
      expect(isValidPassword("123789")).toBeFalsy()
    })

    test("Input", () => {
      expect(
        countDifferentPossiblePasswords(124075, 580769)
      ).toMatchInlineSnapshot(`2150`)
    })
  })

  describe("An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits", () => {
    test("Examples", () => {
      expect(isValidPassword("112233", true)).toBeTruthy()
      expect(isValidPassword("111122", true)).toBeTruthy()
      expect(isValidPassword("111111", true)).toBeFalsy()
      expect(isValidPassword("123444", true)).toBeFalsy()
      expect(isValidPassword("123789", true)).toBeFalsy()
    })

    test("Input", () => {
      expect(
        countDifferentPossiblePasswords(124075, 580769, true)
      ).toMatchInlineSnapshot(`1462`)
    })
  })
})

function isValidPassword(num: number | string, strict = false) {
  const numStr = "" + num
  if (numStr.length !== 6) return false

  let hadPair = false
  let min = -Infinity
  let prevPrevDigitStr = ""
  let prevDigitStr = ""

  for (let i = 0; i < numStr.length; i++) {
    const digitStr = numStr[i]
    const digit = Number(digitStr)
    const nextDigitStr = numStr[i + 1]

    if (digit < min) return false

    if (!hadPair) {
      if (digitStr === prevDigitStr) {
        const lookAroundNotSame =
          nextDigitStr !== digitStr && digitStr !== prevPrevDigitStr

        hadPair = strict ? lookAroundNotSame : true
      }
    }

    min = digit
    prevPrevDigitStr = prevDigitStr
    prevDigitStr = digitStr
  }

  return hadPair
}

function countDifferentPossiblePasswords(
  min: number,
  max: number,
  strict = false
) {
  let validPasswordsCount = 0
  let currentPasswordNumber = min

  while (currentPasswordNumber <= max) {
    if (isValidPassword(currentPasswordNumber, strict)) {
      validPasswordsCount++
    }
    currentPasswordNumber++
  }

  return validPasswordsCount
}
