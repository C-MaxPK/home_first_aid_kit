import { useState } from 'react';
import Search from './components/Search/Search';
// import Sort from './components/Sort/Sort';
import Filters from './components/Filters/Filters';
import Drugs from './components/Drugs/Drugs';
import Logo from './logo.png';
import { ActiveSortType } from './types/types';
import './App.scss';

function App() {
  const [activeSort, setActiveSort] = useState<ActiveSortType>(null); // активная сортировка

  return (
    <div className='app'>

      <header className='header'>
        <img src={Logo} alt="Логотип" />
        <Search activeSort={activeSort} setActiveSort={setActiveSort} />
        {/* <Sort activeSort={activeSort} setActiveSort={setActiveSort} /> */}
      </header>

      <main className='main'>
        <Filters />
        <Drugs />
      </main>

    </div>
  );
}

export default App;
