import Search from './components/Search/Search';
import Filters from './components/Filters/Filters';
import Drugs from './components/Drugs/Drugs';
import Logo from './logo.png';
import './App.scss';


// http://fkn.ktu10.com/?q=node/12450 хук для отслежки ширины экрана
function App() {
  return (
    <div className='app'>

      <header className='header'>
        <img src={Logo} alt="Логотип" />
        <Search />
        {/* <button>Добавить лекарство</button> */}
      </header>

      <main className='main'>
        <Filters />
        <Drugs />
      </main>

    </div>
  );
}

export default App;
