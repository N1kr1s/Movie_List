import ListBox from './left_part/ListBox'
import WatchedBox from './right_part/WatchedBox'

function Main({ movies }) {
  return (
    <main className='main'>
      <ListBox movies={movies} />
      <WatchedBox />
    </main>
  )
}

export default Main
