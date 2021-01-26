import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchData from '../../../../lib/api/fetchData';
import renderConnected from '../../../../lib/utils/renderConnected';
import { Cards } from '../components/Cards';

jest.mock('../../../../lib/api/fetchData');

describe('Cards', () => {
    let mockedFetchData = fetchData as jest.Mock<ReturnType<typeof fetchData>>;
    it('should render loading skeleton when loading', async () => {
        mockedFetchData.mockImplementation(() =>
            Promise.resolve({ records: [] })
        );
        renderConnected(
            <MemoryRouter>
                <Cards />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
    });
    it('should render message when no records could be retrieved', async () => {
        mockedFetchData.mockImplementation(() =>
            Promise.resolve({ records: [] })
        );
        renderConnected(
            <MemoryRouter>
                <Cards />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(
                screen.getByText('Nichts Passendes gefunden')
            ).toBeInTheDocument();
        });
    });
    it('should render error message when request has failed', async () => {
        mockedFetchData.mockImplementation(() => Promise.reject(''));
        renderConnected(
            <MemoryRouter>
                <Cards />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument();
        });
    });
    it('should render cards from store when request has been successful', async () => {
        const title = 'Wegweiser';
        const teaser =
            'Du bist neu bei uns und möchtest Dich schnell in Deiner neuen Arbeitsumgebung zurechtfinden? Dann hast Du genau die richtige Seite gefunden.';
        const responsePayload = {
            records: [
                {
                    id: 'recuIGjx4QqsVsEsf',
                    fields: {
                        teaser,
                        title,
                        categoryId: ['recORhO5ZVPf4HIHX'],
                    },
                    createdTime: '2020-12-18T13:31:23.000Z',
                },
            ],
        };
        mockedFetchData.mockImplementation(() =>
            Promise.resolve(responsePayload)
        );
        renderConnected(
            <MemoryRouter>
                <Cards />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(title)).toBeInTheDocument();
            expect(screen.getByText(teaser)).toBeInTheDocument();
        });
    });
});
