import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

import { RootState, AppDispatch } from '../../reduxStore';
import { Card } from '../../../lib/types';
import { createUrl } from './utils';
import { fetchData } from '../../../lib/api/fetchData';

export const fetchCards = createAsyncThunk<
    Promise<Card[] | undefined>,
    { search: string | null; category: string | null },
    { dispatch: AppDispatch; state: RootState }
>('cards/fetchCards', async (params, thunkApi) => {
    const { currentRequestId, status } = thunkApi.getState().cards;
    const category = params.category || '';
    const search = params.search || '';

    if (status !== 'loading' || thunkApi.requestId !== currentRequestId) {
        return;
    }

    thunkApi.dispatch(categoryChanged(category));
    thunkApi.dispatch(searchTermChanged(search));

    const url = createUrl(
        'https://orgavision-codingchallenge.azurewebsites.net/v1/article',
        { category, search }
    );

    const res = await fetchData<{
        records: Card[];
    }>(url);

    return res.records;
});

const cardsAdapter = createEntityAdapter<Card>();

const initialState = cardsAdapter.getInitialState<{
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentCategory: string;
    currentSearchTerm: string;
    noItems: boolean;
    currentRequestId: string | undefined;
}>({
    status: 'idle',
    error: null,
    currentCategory: '',
    currentSearchTerm: '',
    noItems: false,
    currentRequestId: undefined,
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
        builder.addCase(fetchCards.pending, (state, action) => {
            const { requestId } = action.meta;
            if (state.status === 'idle' || 'succeeded') {
                state.status = 'loading';
                state.currentRequestId = requestId;
            }
        });
        builder.addCase(fetchCards.fulfilled, (state, action) => {
            const { payload } = action;
            const { requestId } = action.meta;
            if (
                state.status === 'loading' &&
                state.currentRequestId === requestId &&
                Array.isArray(payload)
            ) {
                if (payload.length > 0) {
                    state.noItems = false;
                } else {
                    state.noItems = true;
                }
                state.status = 'succeeded';
                cardsAdapter.setAll(state, payload);
                state.currentRequestId = undefined;
            }
        });
        builder.addCase(fetchCards.rejected, (state, action) => {
            const { requestId } = action.meta;
            if (
                state.status === 'loading' &&
                state.currentRequestId === requestId
            ) {
                console.error(action.error.message);
                state.status = 'failed';
                state.error = 'request failed';
            }
        });
    },
});

const { categoryChanged, searchTermChanged } = cardsSlice.actions;

export default cardsSlice.reducer;

export const {
    selectIds: selectCardsIds,
    selectById: selectCardById,
} = cardsAdapter.getSelectors((state: RootState) => state.cards);
