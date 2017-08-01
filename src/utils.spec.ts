import {} from 'jest'
import { getDigitAtIndex, setDigitAtIndex } from './utils'

describe('getDigitAtIndex', () => {
  it('should get the first digit', () => {
    expect(getDigitAtIndex(123, 3, 0)).toBe('1')
  })
})
