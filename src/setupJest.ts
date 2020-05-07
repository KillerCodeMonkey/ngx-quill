import 'jest-preset-angular'

const res = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  x: 0,
  y: 0
}
const range = {
  setStart: () => {},
  setEnd: () => {},
  getBoundingClientRect: () => ({
    ...res,
    toJSON: () => JSON.stringify(res)
  })
}

Range

jest.spyOn(document, 'createRange').mockReturnValue(range as any)
jest.spyOn(document, 'getSelection').mockReturnValue({
  getRangeAt: () => range,
  removeAllRanges: () => {},
  addRange: () => {},
  rangeCount: 1,
  startNode: null
} as any)

