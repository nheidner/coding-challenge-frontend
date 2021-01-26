import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice,
    EntityId,
} from '@reduxjs/toolkit';
import fetchData from '../../../lib/api/fetchData';
import { RootState } from '../../reduxStore';
import { Category } from '../../../lib/types';

const categoriesAdapter = createEntityAdapter<Category>();

export const initialState = categoriesAdapter.getInitialState();

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async () => {
        const res = await fetchData<{ records: Category[] }>(
            'https://orgavision-codingchallenge.azurewebsites.net/v1/category'
        );

        return res.records;
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.fulfilled, categoriesAdapter.setAll);
    },
});

export const {
    selectAll: selectAllCategories,
} = categoriesAdapter.getSelectors((state: RootState) => state.categories);

export default categoriesSlice.reducer;

export const selectCategoriesByIds = createSelector(
    [selectAllCategories, (_: RootState, ids: EntityId[]) => ids],
    (categories, ids) =>
        categories.filter((category) => ids.includes(category.id))
);
