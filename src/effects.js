import { useEffect, useRef } from 'react'

export function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
}
  
export function useResize(callback) {
    const savedCallback = useRef()
  
    useEffect(() => {
      savedCallback.current = callback
    }, [callback])
  
    useEffect(() => {
      function resize() {
        savedCallback.current()
      }
      window.addEventListener('resize', resize, false)
      return () => {
        window.removeEventListener('resize', resize, false)
      }
    }, [])
}
  