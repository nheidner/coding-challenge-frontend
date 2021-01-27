import { fireEvent, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, MemoryRouter } from 'react-router-dom';

import { CategorySelect } from '../components/CategorySelect';
import renderConnected from '../../../../lib/utils/renderConnected';

describe('Category Select', () => {
    it('should render "Alle Kategorien" option as selected on initial render', () => {
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

        const option1 = screen.getByText(
            'Alle Kategorien'
        ) as HTMLOptionElement;
        const option2 = screen.getByText(categoryName1) as HTMLOptionElement;
        const option3 = screen.getByText(categoryName2) as HTMLOptionElement;
        expect(option1.selected).toBeTruthy();
        expect(option2.selected).toBeFalsy();
        expect(option3.selected).toBeFalsy();
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

        const option1 = screen.getByText(
            'Alle Kategorien'
        ) as HTMLOptionElement;
        const option2 = screen.getByText(categoryName) as HTMLOptionElement;
        expect(option1.selected).toBeFalsy();
        expect(option2.selected).toBeTruthy();
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
