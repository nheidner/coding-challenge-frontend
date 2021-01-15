import React from 'react';

import styles from './App.module.sass';
import { Cards } from './features/cards/components/Cards';
import { Navbar } from './components/Navbar';

function App() {
    return (
        <div className={styles.app}>
            <Navbar />
            <Cards />
        </div>
    );
}

export default App;
