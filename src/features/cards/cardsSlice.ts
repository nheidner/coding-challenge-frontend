import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

import { RootState, AppDispatch } from '../../lib/reduxStore';
import { Card } from '../../lib/utils/types';
import {
    fetchCards,
    isPendingAction,
    isRejectedAction,
    isFulfilledAction,
} from './utils';

export const fetchAllCards = createAsyncThunk(
    'cards/fetchAllCards',
    async () => {
        return await fetchCards();
    }
);

export const fetchCardsforCategory = createAsyncThunk<
    Promise<Card[] | undefined>,
    string,
    { dispatch: AppDispatch; state: RootState }
>('cards/fetchCardsforCategory', async (category, thunkApi) => {
    const {
        currentRequestId,
        status,
        currentSearchTerm: search,
    } = thunkApi.getState().cards;
    thunkApi.dispatch(categoryChanged(category));

    if (status !== 'loading' || thunkApi.requestId !== currentRequestId) {
        return;
    }

    return await fetchCards({ category, search });
});

export const fetchCardsForSearch = createAsyncThunk<
    Promise<Card[] | undefined>,
    string,
    { dispatch: AppDispatch; state: RootState }
>('cards/fetchCardsforSearch', async (search, thunkApi) => {
    const {
        currentCategory: category,
        currentRequestId,
        status,
    } = thunkApi.getState().cards;
    thunkApi.dispatch(searchTermChanged(search));

    if (status !== 'loading' || thunkApi.requestId !== currentRequestId) {
        return;
    }

    return await fetchCards({ category, search });
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
        builder.addMatcher(isFulfilledAction, (state, action) => {
            const { payload } = action;
            const { requestId } = action.meta;
            if (
                state.status === 'loading' &&
                state.currentRequestId === requestId
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
        builder.addMatcher(isRejectedAction, (state, action) => {
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
        builder.addMatcher(isPendingAction, (state, action) => {
            const { requestId } = action.meta;
            if (state.status === 'idle' || 'succeeded') {
                state.status = 'loading';
                state.currentRequestId = requestId;
            }
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
