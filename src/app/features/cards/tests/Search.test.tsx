import { Search } from '../components/Search';
import { createMemoryHistory } from 'history';
import renderConnected from '../../../../lib/utils/renderConnected';
import { MemoryRouter, Router } from 'react-router-dom';
import { fireEvent, screen } from '@testing-library/react';

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

        expect(screen.getByDisplayValue(searchTerm)).not.toBeNull();
    });
    it('should set correct URL Search Param when input is given', () => {
        const inputValue = 'hello';
        const history = createMemoryHistory();
        renderConnected(
            <Router history={history}>
                <Search />
            </Router>
        );
        const selectElem = screen.getByPlaceholderText(
            'Suchen...'
        ) as HTMLInputElement;

        fireEvent.change(selectElem, { target: { value: inputValue } });

        expect(history.location.search).toBe(`?search=${inputValue}`);
    });
});
