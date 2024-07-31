import { useState, useEffect } from 'react'

const KEY = 'efbed116'

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchMovies = async () => {
        try {
          setIsLoading(true)
          setError('')
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          )

          if (!res.ok) {
            throw new Error('Something went wrong with fetching movies')
          }

          const data = await res.json()
          if (data.Response === 'False') {
            throw new Error('Movie not found')
          }
          setMovies(data.Search)
        } catch (error) {
          setError(error.message)
        } finally {
          setIsLoading(false)
        }
      }
      if (query.length < 3) {
        setMovies([])
        setError('')
        return
      }

      callback?.()
      // handleCloseMovie()
      fetchMovies()
    }, 500)
    return () => {
      clearTimeout(timeout)
    }
  }, [query])
  return { movies, isLoading, error }
}
