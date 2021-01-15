import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectAllCategories } from '../categoriesSlice';
import { fetchCardsforCategory } from '../../cards/cardsSlice';
import { RootState } from '../../../lib/reduxStore';
import styles from './CategorySelect.module.sass';

export const CategorySelect = () => {
    const dispatch = useDispatch();
    const categories = useSelector(selectAllCategories);
    const category = useSelector(
        (state: RootState) => state.cards.currentCategory
    );

    const onCategoryChanged = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        dispatch(fetchCardsforCategory(e.target.value));
    };

    const categoryOptions = categories.map((category) => (
        <option key={category.id} value={category.fields.name}>
            {category.fields.name}
        </option>
    ));

    return (
        <div className={styles.selectCategory}>
            <select
                className={styles.select}
                value={category}
                onChange={onCategoryChanged}>
                <option value=''>Alle Kategorien</option>
                {categoryOptions}
            </select>
        </div>
    );
};
