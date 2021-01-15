import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../reduxStore';
import { fetchCardsForSearch } from '../cardsSlice';
import styles from './Search.module.sass';

export const Search = () => {
    const dispatch = useDispatch();
    const searchTerm = useSelector(
        (state: RootState) => state.cards.currentSearchTerm
    );
    const searchInput = useRef<HTMLInputElement | null>(null);

    const onSearchTermChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(fetchCardsForSearch(e.target.value));
    };

    const focusSearchInput = () => {
        if (searchInput.current) searchInput.current.focus();
    };

    return (
        <div className={styles.search}>
            <div className={styles.inputDiv}>
                <input
                    className={styles.searchInput}
                    type='text'
                    value={searchTerm}
                    placeholder='Suchen...'
                    ref={searchInput}
                    onChange={onSearchTermChanged}
                />
                <FontAwesomeIcon
                    icon={faSearch}
                    className={styles.searchIcon}
                    onClick={focusSearchInput}
                />
            </div>
        </div>
    );
};
