import WatchedMovie from './WatchedMovie'

function WatchedMoviesList({ watched }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  )
}

export default WatchedMoviesList
