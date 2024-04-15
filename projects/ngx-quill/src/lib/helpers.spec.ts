import { raf$ } from './helpers'

describe('helpers', () => {
  it('should cancel requestAnimationFrame before it is fired', () => {
    spyOn(globalThis, 'cancelAnimationFrame')
    const subscription = raf$().subscribe()
    expect(globalThis.cancelAnimationFrame).not.toHaveBeenCalled()
    subscription.unsubscribe()
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()
  })
})
