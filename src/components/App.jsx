import Navbar from './navbar/Navbar'
import Main from './main/Main'
import { useState, useEffect } from 'react'
import Logo from './navbar/Logo'
import Numresults from './navbar/Numresults'
import Search from './navbar/Search'
import Box from './main/left_part/Box'
import MovieList from './main/left_part/MovieList'
import WatchedSummary from './main/right_part/WatchedSummary'
import WatchedMoviesList from './main/right_part/WatchedMoviesList'
import Loader from './main/Loader'
import ErrorMessage from './ErrorMessage'
import MovieDetails from './main/right_part/MovieDetails'

const KEY = 'efbed116'

export default function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [watched, setWatched] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const handleSelectMovie = (id) => {
    setSelectedId(id)
    if (selectedId === id) {
      setSelectedId(null)
    }
  }

  const handleCloseMovie = () => {
    setSelectedId(null)
  }

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie])
  }

  useEffect(() => {
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

    fetchMovies()
  }, [query])

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}
