import React, { FC } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import cardsReducer, {
    initialState as cardsInitialState,
} from '../../app/features/cards/cardsSlice';
import categoriesReducer, {
    initialState as categoriesInitialState,
} from '../../app/features/categories/categoriesSlice';

const renderConnected = (
    ui: React.ReactElement,
    {
        initialState = {
            cards: cardsInitialState,
            categories: categoriesInitialState,
        },
        ...renderOptions
    }: Partial<{
        initialState: { cards?: any; categories?: any };
        [option: string]: any;
    }> = {}
) => {
    const reducer = combineReducers({
        cards: cardsReducer,
        categories: categoriesReducer,
    });
    const store = createStore(reducer, initialState, applyMiddleware(thunk));
    const Wrapper: FC = ({ children }) => (
        <Provider store={store}>{children}</Provider>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export default renderConnected;
