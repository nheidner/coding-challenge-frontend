import React from 'react';
import ReactDOM from 'react-dom';
import './index.module.sass';
import App from './app/App';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import store from './app/reduxStore';
import { fetchCategories } from './app/features/categories/categoriesSlice';

store.dispatch(fetchCategories());

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
