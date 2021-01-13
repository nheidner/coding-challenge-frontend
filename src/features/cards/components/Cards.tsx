import { EntityId } from '@reduxjs/toolkit';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../lib/reduxStore';
import { selectCardsIds, selectCardById, fetchAllCards } from '../cardsSlice';

const Card: FC<{ id: EntityId }> = ({ id }) => {
    const card = useSelector((state: RootState) => selectCardById(state, id));

    if (!card) {
        return <div></div>;
    }

    return (
        <div>
            <h3>{card.fields.title}</h3>
            <p>{card.fields.teaser}</p>
        </div>
    );
};

export const Cards = () => {
    const dispatch = useDispatch();
    const cardIds = useSelector(selectCardsIds);
    const status = useSelector((state: RootState) => state.cards.status);
    const errorMessage = useSelector((state: RootState) => state.cards.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllCards());
        }
    });

    if (status === 'loading') {
        return <div>loading ...</div>;
    }

    if (status === 'failed') {
        return <div>{errorMessage}</div>;
    }

    const cards = cardIds.map((id) => <Card id={id} key={id} />);

    return <section>{cards}</section>;
};
