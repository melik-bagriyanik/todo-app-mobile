import { renderHook, act } from '@testing-library/react-native';
import { useAsyncState } from '@/hooks/useAsyncState';

describe('useAsyncState Hook', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAsyncState());
    
    expect(result.current[0]).toEqual({
      data: null,
      loading: false,
      error: null,
      isSuccess: false,
      isError: false,
    });
  });

  it('should initialize with initial data', () => {
    const initialData = { id: 1, name: 'Test' };
    const { result } = renderHook(() => useAsyncState(initialData));
    
    expect(result.current[0].data).toEqual(initialData);
  });

  it('should execute async function successfully', async () => {
    const mockAsyncFunction = jest.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsyncState());
    
    await act(async () => {
      await result.current[1].execute(mockAsyncFunction);
    });
    
    expect(result.current[0]).toEqual({
      data: 'success',
      loading: false,
      error: null,
      isSuccess: true,
      isError: false,
    });
  });

  it('should handle async function error', async () => {
    const mockError = new Error('Test error');
    const mockAsyncFunction = jest.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useAsyncState());
    
    await act(async () => {
      await result.current[1].execute(mockAsyncFunction);
    });
    
    expect(result.current[0]).toEqual({
      data: null,
      loading: false,
      error: mockError,
      isSuccess: false,
      isError: true,
    });
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useAsyncState());
    
    act(() => {
      result.current[1].setData('test data');
      result.current[1].setError(new Error('test error'));
    });
    
    act(() => {
      result.current[1].reset();
    });
    
    expect(result.current[0]).toEqual({
      data: null,
      loading: false,
      error: null,
      isSuccess: false,
      isError: false,
    });
  });

  it('should set data manually', () => {
    const { result } = renderHook(() => useAsyncState());
    
    act(() => {
      result.current[1].setData('manual data');
    });
    
    expect(result.current[0].data).toBe('manual data');
    expect(result.current[0].isSuccess).toBe(true);
  });

  it('should set error manually', () => {
    const { result } = renderHook(() => useAsyncState());
    const error = new Error('Manual error');
    
    act(() => {
      result.current[1].setError(error);
    });
    
    expect(result.current[0].error).toBe(error);
    expect(result.current[0].isError).toBe(true);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useAsyncState());
    
    act(() => {
      result.current[1].setLoading(true);
    });
    
    expect(result.current[0].loading).toBe(true);
  });
});
