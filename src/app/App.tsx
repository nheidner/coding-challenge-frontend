import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import styles from './App.module.sass';
import { Cards } from './features/cards/components/Cards';
import { Navbar } from './components/Navbar';

function App() {
    return (
        <Router>
            <div className={styles.app}>
                <Navbar />
                <Cards />
            </div>
        </Router>
    );
}

export default App;
