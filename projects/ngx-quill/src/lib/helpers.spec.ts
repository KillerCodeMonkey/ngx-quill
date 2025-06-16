import { describe, expect, test } from 'vitest'
import { raf$ } from './helpers'

describe('helpers', () => {
  test('should cancel requestAnimationFrame before it is fired', () => {
    vi.spyOn(globalThis, 'cancelAnimationFrame')
    const subscription = raf$().subscribe()
    expect(globalThis.cancelAnimationFrame).not.toHaveBeenCalled()
    subscription.unsubscribe()
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled()
  })
})
