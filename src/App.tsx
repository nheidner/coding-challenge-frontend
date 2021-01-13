import React from 'react';

import './App.css';
import { Cards } from './features/cards/components/Cards';
import { Navbar } from './components/Navbar';

function App() {
    return (
        <div className='App'>
            <Navbar />
            <Cards />
        </div>
    );
}

export default App;
