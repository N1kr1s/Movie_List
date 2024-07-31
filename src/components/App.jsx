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
import { useMovies } from './hooks/useMovies'
import { useLocalStorageState } from './hooks/useLocalStorageState'

export default function App() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie)

  const [watched, setWatched] = useLocalStorageState([], 'watched')

  const handleSelectMovie = (id) => {
    setSelectedId(id)
    if (selectedId === id) {
      setSelectedId(null)
    }
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie])
  }

  const handleDeleteWatched = (id) => {
    setWatched(watched.filter((movie) => movie.imdbID !== id))
  }

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
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}
