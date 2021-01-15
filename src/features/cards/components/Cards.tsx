import { EntityId } from '@reduxjs/toolkit';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../lib/reduxStore';
import { selectCategoriesByIds } from '../../categories/categoriesSlice';
import {
    selectCardsIds,
    selectCardById,
    fetchAllCards,
    fetchCardsforCategory,
} from '../cardsSlice';
import styles from './Cards.module.sass';

const Card: FC<{ id: EntityId }> = ({ id }) => {
    const dispatch = useDispatch();
    const card = useSelector((state: RootState) => selectCardById(state, id));
    const categoriesData = useSelector((state: RootState) =>
        selectCategoriesByIds(state, card ? card.fields.categoryId : [])
    );

    const onCategoryClicked = (category: string) =>
        dispatch(fetchCardsforCategory(category));

    const categories = categoriesData.map((category) => (
        <button
            className={styles.category}
            key={category.id}
            style={{ backgroundColor: category.fields.color }}
            onClick={() => onCategoryClicked(category.fields.name)}>
            {category.fields.name}
        </button>
    ));

    if (!card) {
        return <div></div>;
    }

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{card.fields.title}</h3>
            <div className={styles.categories}>{categories}</div>
            <p className={styles.teaser}>{card.fields.teaser}</p>
        </div>
    );
};

export const Cards = () => {
    const dispatch = useDispatch();
    const cardIds = useSelector(selectCardsIds);
    const status = useSelector((state: RootState) => state.cards.status);
    const noItems = useSelector((state: RootState) => state.cards.noItems);
    const errorMessage = useSelector((state: RootState) => state.cards.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllCards());
        }
    });

    if (status === 'loading') {
        return (
            <div className={styles.cards}>
                <div className={`${styles.card} ${styles.skeleton}`}>
                    Loading...
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return <div className={styles.error}>{errorMessage}</div>;
    }

    if (noItems) {
        return (
            <div className={styles.error}>
                <span>Nichts Passendes gefunden</span>
            </div>
        );
    }

    const cards = cardIds.map((id) => <Card id={id} key={id} />);

    return <section className={styles.cards}>{cards}</section>;
};
