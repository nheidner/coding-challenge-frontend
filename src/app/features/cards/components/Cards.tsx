import { EntityId } from '@reduxjs/toolkit';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useQuery } from '../../../../lib/hooks/useQuery';

import { RootState } from '../../../reduxStore';
import { selectCategoriesByIds } from '../../categories/categoriesSlice';
import {
    selectCardsIds,
    selectCardById,
    fetchCards,
    selectNoItems,
    selectStatus,
    selectError,
} from '../cardsSlice';
import styles from './Cards.module.sass';

export const Card: FC<{ id: EntityId }> = ({ id }) => {
    const card = useSelector((state: RootState) => selectCardById(state, id));
    const categoriesData = useSelector((state: RootState) =>
        selectCategoriesByIds(state, card ? card.fields.categoryId : [])
    );
    const query = useQuery();

    const categories = categoriesData.map((category) => {
        query.set('category', category.fields.name);
        return (
            <Link
                className={styles.category}
                to={`/?${query.toString()}`}
                key={category.id}
                style={{ backgroundColor: category.fields.color }}>
                {category.fields.name}
            </Link>
        );
    });

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
    const status = useSelector(selectStatus);
    const noItems = useSelector(selectNoItems);
    const errorMessage = useSelector(selectError);
    const query = useQuery();

    const search = query.get('search');
    const category = query.get('category');

    useEffect(() => {
        dispatch(fetchCards({ search, category }));
    }, [dispatch, search, category]);

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
        return (
            <div className={styles.error} data-testid='error'>
                {errorMessage}
            </div>
        );
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
