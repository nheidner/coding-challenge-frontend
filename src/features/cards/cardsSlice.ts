import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

import { RootState, AppDispatch } from '../../lib/reduxStore';
import { Card } from '../../lib/types';
import {
    fetchCards,
    isPendingAction,
    isRejectedAction,
    isFulfilledAction,
} from './utils';

const cardsAdapter = createEntityAdapter<Card>();

const initialState = cardsAdapter.getInitialState<{
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentCategory: string;
    currentSearchTerm: string;
}>({
    status: 'idle',
    error: null,
    currentCategory: '',
    currentSearchTerm: '',
});

export const fetchAllCards = createAsyncThunk(
    'cards/fetchAllCards',
    async () => {
        return await fetchCards();
    }
);

export const fetchCardsforCategory = createAsyncThunk<
    Promise<Card[]>,
    string,
    { dispatch: AppDispatch; state: RootState }
>('cards/fetchCardsforCategory', async (category, thunkApi) => {
    const search = thunkApi.getState().cards.currentSearchTerm;

    thunkApi.dispatch(categoryChanged(category));

    return await fetchCards({ category, search });
});

export const fetchCardsForSearch = createAsyncThunk<
    Promise<Card[]>,
    string,
    { dispatch: AppDispatch; state: RootState }
>('cards/fetchCardsforSearch', async (search, thunkApi) => {
    const category = thunkApi.getState().cards.currentCategory;

    thunkApi.dispatch(searchTermChanged(search));

    return await fetchCards({ category, search });
});

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        categoryChanged: (state, action: PayloadAction<string>) => {
            state.currentCategory = action.payload;
        },
        searchTermChanged: (state, action: PayloadAction<string>) => {
            state.currentSearchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(isFulfilledAction, (state, { payload }) => {
            state.status = 'succeeded';
            cardsAdapter.setAll(state, payload);
        });
        builder.addMatcher(isRejectedAction, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'request failed';
        });
        builder.addMatcher(isPendingAction, (state) => {
            state.status = 'loading';
        });
    },
});

const { categoryChanged, searchTermChanged } = cardsSlice.actions;

export default cardsSlice.reducer;

export const {
    selectAll: selectAllCards,
    selectIds: selectCardsIds,
    selectById: selectCardById,
} = cardsAdapter.getSelectors((state: RootState) => state.cards);
