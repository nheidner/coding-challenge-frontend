export interface Card {
    id: string;
    fields: {
        teaser: string;
        title: string;
        categoryId: string[];
    };
    createdTime: string;
}

export interface Category {
    id: string;
    fields: {
        color: string;
        name: string;
    };
    createdTime: string;
}
