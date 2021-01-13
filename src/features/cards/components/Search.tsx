import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../lib/reduxStore';
import { fetchCardsForSearch } from '../cardsSlice';

export const Search = () => {
    const dispatch = useDispatch();
    const searchTerm = useSelector(
        (state: RootState) => state.cards.currentSearchTerm
    );

    const onSearchTermChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(fetchCardsForSearch(e.target.value));
    };

    return (
        <input type='text' value={searchTerm} onChange={onSearchTermChanged} />
    );
};
