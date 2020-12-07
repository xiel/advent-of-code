describe("Secure Container", () => {
  describe("How many different passwords within the range given in your puzzle input meet these criteria?", () => {
    test("Examples", () => {
      expect(countDifferentPossiblePasswords(124075, 580769)).toEqual(0)
    })
  })
})

function isValidPassword(num: number) {
  const numStr = '' + num
}

function countDifferentPossiblePasswords(min, max) {
  return 0
}
