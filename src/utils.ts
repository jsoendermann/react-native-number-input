const getCharArrayAndIndexForNumberAndDigitIndex = (
  n: number,
  numberOfIntegerDigits: number,
  digitIndex: number,
) => {
  let index = digitIndex
  const leftPad = numberOfIntegerDigits - n.toFixed(0).length
  const array: string[] = [
    ...Array(leftPad).fill('0'),
    ...String(n).split(''),
    String(n).split('').includes('.') ? '' : '.',
    ...Array(index).fill('0'),
  ]
  let i = 0
  while (i < index) {
    i += 1
    if (array[i] === '.') {
      i += 1
      index += 1
    }
  }
  return { array, index }
}

export const getDigitAtIndex = (
  n: number,
  numberOfIntegerDigits: number,
  digitIndex: number,
) => {
  const { array, index } = getCharArrayAndIndexForNumberAndDigitIndex(
    n,
    numberOfIntegerDigits,
    digitIndex,
  )
  return array[index]
}

export const setDigitAtIndex = (
  n: number,
  numberOfIntegerDigits: number,
  digitIndex: number,
  newValue: number,
) => {
  const { array, index } = getCharArrayAndIndexForNumberAndDigitIndex(
    n,
    numberOfIntegerDigits,
    digitIndex,
  )
  const arrayCopy = array
  arrayCopy[index] = String(newValue)
  return Number(arrayCopy.join(''))
}
