import { useEffect, useState, useRef } from 'react'
import StarRating from './StarRating'
import Loader from '../Loader'

const KEY = 'efbed116'

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState(0)

  const countRef = useRef(0)

  useEffect(() => {
    if (userRating) {
      countRef.current++
    }
  }, [userRating])

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Releases: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    }

    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }

  useEffect(() => {
    const callback = (e) => {
      if (e.code === 'Escape') {
        onCloseMovie()
      }
    }

    document.addEventListener('keydown', callback)

    return () => {
      document.removeEventListener('keydown', callback)
    }
  }, [onCloseMovie])

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        )
        const data = await res.json()
        setMovie(data)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    getMovieDetails()
  }, [selectedId])

  useEffect(() => {
    if (!title) {
      return
    }
    document.title = `Movie | ${title}`

    return () => {
      document.title = 'Movie_List'
    }
  }, [title])

  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>{imdbRating} IMDB rating</p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className='btn-add' onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You've already rated this movie with {watchedUserRating}⭐
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  )
}

export default MovieDetails
