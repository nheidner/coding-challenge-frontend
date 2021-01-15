import { configureStore } from '@reduxjs/toolkit';

import cardsSlice from './features/cards/cardsSlice';
import categoriesSlice from './features/categories/categoriesSlice';

const store = configureStore({
    reducer: {
        cards: cardsSlice,
        categories: categoriesSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
