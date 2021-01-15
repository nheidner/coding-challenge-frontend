import React from 'react';

import { Search } from '../features/cards/components/Search';
import { CategorySelect } from '../features/categories/components/CategorySelect';
import styles from './Navbar.module.sass';

export const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <h1>Knowledge Base</h1>
                <div className={styles.filterOptions}>
                    <CategorySelect />
                    <Search />
                </div>
            </div>
        </nav>
    );
};
