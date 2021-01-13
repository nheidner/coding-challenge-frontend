import { AsyncThunk, AnyAction } from '@reduxjs/toolkit';

import { fetchData } from '../../lib/api/fetchData';
import { Card } from '../../lib/types';

interface QueryOptions {
    category?: string;
    search?: string;
    [param: string]: string | undefined;
}

export const createQueryString = (params: QueryOptions): string => {
    if (!params) return '';
    return Object.keys(params)
        .map((key) => {
            if (!params[key]) return '';
            return `${key}=${params[key]}`;
        })
        .join('&');
};

export const createUrl = (url: string, queryOptions?: QueryOptions): string =>
    url +
    (queryOptions ? `?${createQueryString(queryOptions as QueryOptions)}` : '');

export const fetchCards = async (queryOptions?: QueryOptions) => {
    const res = await fetchData<{
        records: Card[];
    }>(
        createUrl(
            'https://orgavision-codingchallenge.azurewebsites.net/v1/article',
            queryOptions
        )
    );

    return res.records;
};

type fetchCardsAsyncThunk = AsyncThunk<Card[], QueryOptions | undefined, {}>;

type PendingAction = ReturnType<fetchCardsAsyncThunk['pending']>;
type RejectedAction = ReturnType<fetchCardsAsyncThunk['rejected']>;
type FulfilledAction = ReturnType<fetchCardsAsyncThunk['fulfilled']>;

export const isPendingAction = (action: AnyAction): action is PendingAction => {
    return action.type.startsWith('cards/') && action.type.endsWith('/pending');
};

export const isFulfilledAction = (
    action: AnyAction
): action is FulfilledAction => {
    return (
        action.type.startsWith('cards/') && action.type.endsWith('/fulfilled')
    );
};

export const isRejectedAction = (
    action: AnyAction
): action is RejectedAction => {
    return (
        action.type.startsWith('cards/') && action.type.endsWith('/rejected')
    );
};
