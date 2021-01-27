import { createMemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import { fireEvent, screen } from '@testing-library/react';

import { Search } from '../components/Search';
import renderConnected from '../../../../lib/utils/renderConnected';

describe('Search Element', () => {
    it('should render state of currentSearchTerm', () => {
        const searchTerm = 'hello';
        const initialState = {
            cards: { currentSearchTerm: searchTerm },
        };
        renderConnected(
            <MemoryRouter>
                <Search />
            </MemoryRouter>,
            { initialState }
        );

        expect(screen.getByDisplayValue(searchTerm)).toBeInTheDocument();
    });
    it('should set correct URL Search Param when input is given', () => {
        const searchTerm = 'hello';
        const history = createMemoryHistory();
        renderConnected(
            <Router history={history}>
                <Search />
            </Router>
        );
        const selectElem = screen.getByPlaceholderText(
            'Suchen...'
        ) as HTMLInputElement;

        fireEvent.change(selectElem, { target: { value: searchTerm } });

        expect(history.location.search).toBe(`?search=${searchTerm}`);
    });
});
