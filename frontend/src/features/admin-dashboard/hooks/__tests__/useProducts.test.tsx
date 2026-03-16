import { renderHook, waitFor, createWrapper } from '@/test/test-utils';
import { useProducts } from '../useProducts';
import { adminService } from '../../api/admin.api';

// Mock the admin service
jest.mock('../../api/admin.api');

describe('useProducts hook', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch and map products correctly', async () => {
        // ... (mock data stays same)
        const mockData = {
            success: true,
            data: [
                {
                    id: '1',
                    name: 'Test Product',
                    price: 1000,
                    updatedAt: '2026-01-25T08:00:00.000Z',
                    user: { fullName: 'John Doe' },
                    market: { name: 'Virunga' }
                }
            ]
        };

        (adminService.getProducts as jest.Mock).mockResolvedValue(mockData);

        const { result } = renderHook(() => useProducts({ searchQuery: '' }), {
            wrapper: createWrapper()
        });

        // Wait for results
        await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });

        expect(result.current.products).toHaveLength(1);
    });

    it('should handle API errors', async () => {
        const testError = new Error('Network Error');
        (adminService.getProducts as jest.Mock).mockRejectedValue(testError);

        const { result } = renderHook(() => useProducts({ searchQuery: '' }), {
            wrapper: createWrapper()
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });

        expect(result.current.error).toBe('Network Error');
        expect(result.current.products).toEqual([]);
    });
});

