import React from 'react';

import { Cards } from './features/cards/components/Cards';
import { Navbar } from './components/Navbar';

function App() {
    return (
        <React.Fragment>
            <Navbar />
            <Cards />
        </React.Fragment>
    );
}

export default App;
