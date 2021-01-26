import { Store } from '../../../reduxStore';
import { configureStore } from '@reduxjs/toolkit';

import cardsReducer, {
    fetchCards,
    initialState,
    selectStatus,
    selectError,
    selectNoItems,
    selectCardsData,
    selectCurrentSearchTerm,
    selectCurrentCategory,
} from '../cardsSlice';
import categoriesReducer, {
    initialState as categoriesInitialState,
} from '../../categories/categoriesSlice';
import fetchData from '../../../../lib/api/fetchData';

jest.mock('../../../../lib/api/fetchData');

describe('Cards Slice', () => {
    it('should return initial state on first run', () => {
        const result = cardsReducer(undefined, { type: '' });

        expect(result).toEqual(initialState);
    });
    it('should set correct status and error state when request has been made', () => {
        const nextState = cardsReducer(
            initialState,
            fetchCards.pending('not important requestId', {
                search: null,
                category: null,
            })
        );
        const rootState = {
            cards: nextState,
            categories: categoriesInitialState,
        };

        expect(selectStatus(rootState)).toBe('loading');
        expect(selectError(rootState)).toBeNull();
        expect(selectNoItems(rootState)).toBeFalsy();
    });
    describe('fetchCards Thunk', () => {
        let mockedFetchData = fetchData as jest.Mock<
            ReturnType<typeof fetchData>
        >;
        let store: Store;

        beforeEach(() => {
            store = configureStore({
                reducer: {
                    cards: cardsReducer,
                    categories: categoriesReducer,
                },
            });
        });

        it('should set correct state when request succeeded', async () => {
            const id = 'recuIGjx4QqsVsEsf';
            const search = 'Die';
            const category = 'Personal';
            const responsePayload = {
                records: [
                    {
                        createdTime: '2020-12-18T13:31:23.000Z',
                        fields: {
                            categoryId: ['recORhO5ZVPf4HIHX'],
                            teaser:
                                'Du bist neu bei uns und möchtest Dich schnell in Deiner neuen Arbeitsumgebung zurechtfinden? Dann hast Du genau die richtige Seite gefunden.',
                            title: 'Wegweiser',
                        },
                        id,
                    },
                ],
            };
            mockedFetchData.mockImplementation(() =>
                Promise.resolve(responsePayload)
            );

            await store.dispatch(fetchCards({ search, category }));

            const state = store.getState();
            expect(state.cards.entities[id]).toEqual(
                responsePayload.records[0]
            );
            expect(selectStatus(state)).toBe('succeeded');
            expect(selectNoItems(state)).toBeFalsy();
            expect(selectCurrentSearchTerm(state)).toBe(search);
            expect(selectCurrentCategory(state)).toBe(category);
        });
        it('should set correct state when request failed', async () => {
            const search = 'Die';
            const category = 'Personal';
            mockedFetchData.mockImplementation(() => Promise.reject(''));

            await store.dispatch(fetchCards({ search, category }));

            const state = store.getState();
            expect(selectCardsData(state)).toEqual({});
            expect(selectStatus(state)).toBe('failed');
            expect(selectNoItems(state)).toBeFalsy();
            expect(selectCurrentSearchTerm(state)).toBe(search);
            expect(selectCurrentCategory(state)).toBe(category);
        });
        it('should set correct state when no records could be retrieved', async () => {
            const search = 'Die';
            const category = 'Personal';
            mockedFetchData.mockImplementation(() =>
                Promise.resolve({ records: [] })
            );

            await store.dispatch(fetchCards({ search, category }));

            const state = store.getState();
            expect(selectNoItems(state)).toBeTruthy();
            expect(selectCardsData(state)).toEqual({});
            expect(selectStatus(state)).toBe('succeeded');
            expect(selectCurrentSearchTerm(state)).toBe(search);
            expect(selectCurrentCategory(state)).toBe(category);
        });
    });
});
