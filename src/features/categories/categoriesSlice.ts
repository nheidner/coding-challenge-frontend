import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import { fetchData } from '../../lib/api/fetchData';
import { RootState } from '../../lib/reduxStore';
import { Category } from '../../lib/types';

const categoriesAdapter = createEntityAdapter<Category>();

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
    initialState: categoriesAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.fulfilled, categoriesAdapter.setAll);
    },
});

export const {
    selectAll: selectAllCategories,
    selectById: selectCategoryById,
} = categoriesAdapter.getSelectors((state: RootState) => state.categories);

export default categoriesSlice.reducer;
