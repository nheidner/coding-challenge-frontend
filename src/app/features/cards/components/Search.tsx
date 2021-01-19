import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxStore';
import styles from './Search.module.sass';
import { useQuery } from '../../../../lib/hooks/useQuery';
import { useHistory } from 'react-router-dom';

export const Search = () => {
    const query = useQuery();
    const history = useHistory();

    const searchTerm = useSelector(
        (state: RootState) => state.cards.currentSearchTerm
    );
    const searchInput = useRef<HTMLInputElement | null>(null);

    const onSearchTermChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            query.set('search', e.target.value);
        } else {
            query.delete('search');
        }
        history.push('/?' + query.toString());
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
