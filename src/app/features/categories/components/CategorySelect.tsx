import React from 'react';
import { useSelector } from 'react-redux';

import { selectAllCategories } from '../categoriesSlice';
import { RootState } from '../../../reduxStore';
import styles from './CategorySelect.module.sass';
import { useQuery } from '../../../../lib/hooks/useQuery';
import { useHistory } from 'react-router-dom';

export const CategorySelect = () => {
    const query = useQuery();
    const history = useHistory();

    const categories = useSelector(selectAllCategories);
    const currentCategory = useSelector(
        (state: RootState) => state.cards.currentCategory
    );

    const onCategoryChanged = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        if (e.target.value) {
            query.set('category', e.target.value);
        } else {
            query.delete('category');
        }
        history.push('/?' + query.toString());
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
                value={currentCategory}
                onChange={onCategoryChanged}>
                <option value=''>Alle Kategorien</option>
                {categoryOptions}
            </select>
        </div>
    );
};
