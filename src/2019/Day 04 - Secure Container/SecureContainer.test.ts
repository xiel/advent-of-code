/**
 You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

 However, they do remember a few key facts about the password:

 The value is within the range given in your puzzle input.
 It is a six-digit number.
 Two adjacent digits are the same (like 22 in 122345).
 Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
 */

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
})

function isValidPassword(num: number | string) {
  const numStr = "" + num
  if (numStr.length !== 6) return false

  let prevNumStr = ""
  let hadSameDigit = false
  let min = -Infinity

  for (const digitStr of numStr) {
    const digit = Number(digitStr)

    if (digit < min) return false
    if (!hadSameDigit) {
      if (digitStr === prevNumStr) {
        hadSameDigit = true
      }
    }

    min = digit
    prevNumStr = digitStr
  }

  return hadSameDigit
}

function countDifferentPossiblePasswords(min, max) {
  let validPasswordsCount = 0
  let currentPasswordNumber = min

  while (currentPasswordNumber <= max) {
    if (isValidPassword(currentPasswordNumber)) {
      validPasswordsCount++
    }

    currentPasswordNumber++
  }

  return validPasswordsCount
}
