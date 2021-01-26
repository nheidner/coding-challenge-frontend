import { fireEvent, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, MemoryRouter } from 'react-router-dom';

import { CategorySelect } from '../components/CategorySelect';
import renderConnected from '../../../../lib/utils/renderConnected';

describe('Category Select', () => {
    it('should render "Alle Kategorien" as selected on initial render', () => {
        renderConnected(
            <MemoryRouter>
                <CategorySelect />
            </MemoryRouter>
        );

        expect(screen.queryByDisplayValue('Alle Kategorien')).not.toBeNull();
    });
    it('should render all categories from the store', async () => {
        const categoryName1 = 'IT-Self-Service';
        const categoryName2 = 'Wegweiser';
        const initialState = {
            categories: {
                entities: {
                    recMUqLOa3lfxxd5v: {
                        id: 'recMUqLOa3lfxxd5v',
                        fields: { color: '#E88735', name: categoryName1 },
                        createdTime: '2021-01-04T14:41:37.000Z',
                    },
                    recORhO5ZVPf4HIHX: {
                        id: 'recORhO5ZVPf4HIHX',
                        fields: { color: '#7DA11A', name: categoryName2 },
                        createdTime: '2020-12-18T14:00:12.000Z',
                    },
                },
                ids: ['recMUqLOa3lfxxd5v', 'recORhO5ZVPf4HIHX'],
            },
        };
        renderConnected(
            <MemoryRouter>
                <CategorySelect />
            </MemoryRouter>,
            { initialState }
        );

        expect(screen.queryByText('Alle Kategorien')).not.toBeNull();
        expect(screen.queryByText(categoryName1)).not.toBeNull();
        expect(screen.queryByText(categoryName1)).not.toBeNull();
    });
    it('should render state property of currentCategory as selected', () => {
        const categoryName = 'IT-Self-Service';
        const initialState = {
            categories: {
                entities: {
                    recMUqLOa3lfxxd5v: {
                        id: 'recMUqLOa3lfxxd5v',
                        fields: { color: '#E88735', name: categoryName },
                        createdTime: '2021-01-04T14:41:37.000Z',
                    },
                },
                ids: ['recMUqLOa3lfxxd5v'],
            },
            cards: {
                currentCategory: categoryName,
            },
        };
        renderConnected(
            <MemoryRouter>
                <CategorySelect />
            </MemoryRouter>,
            { initialState }
        );

        const option = screen.getByText(categoryName) as HTMLOptionElement;
        expect(option.selected).toBeTruthy();
    });
    it('should set correct URL Search Params when category is changed', () => {
        const categoryName = 'IT-Self-Service';
        const history = createMemoryHistory();
        const initialState = {
            categories: {
                entities: {
                    recMUqLOa3lfxxd5v: {
                        id: 'recMUqLOa3lfxxd5v',
                        fields: { color: '#E88735', name: categoryName },
                        createdTime: '2021-01-04T14:41:37.000Z',
                    },
                },
                ids: ['recMUqLOa3lfxxd5v'],
            },
            cards: {
                currentCategory: '',
            },
        };
        renderConnected(
            <Router history={history}>
                <CategorySelect />
            </Router>,
            { initialState }
        );
        const selectElem = screen.getByRole('listbox') as HTMLSelectElement;

        fireEvent.change(selectElem, { target: { value: categoryName } });

        expect(history.location.search).toBe(`?category=${categoryName}`);
    });
});
