import { useEffect, useState } from 'react'

export default function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = target / (duration / 16) // ~60fps
    const step = () => {
      start += increment
      if (start >= target) {
        setCount(target)
      } else {
        setCount(Math.floor(start * 100) / 100) // round to 2 decimals
        requestAnimationFrame(step)
      }
    }
    step()
  }, [target, duration])

  return count
}
