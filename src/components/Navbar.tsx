import React from 'react';

import { Search } from '../features/cards/components/Search';
import { CategorySelect } from '../features/categories/CategorySelect';

export const Navbar = () => {
    return (
        <nav>
            <CategorySelect />
            <Search />
        </nav>
    );
};
