import { renderHook, act } from '@testing-library/react';
import { useSelection } from './useSelection';

describe('useSelection hook', () => {
  const mockSeat = {
    label: 'A1',
    type: 'seat' as const,
    price: 100,
    status: 'available' as const,
  };

  const mockSeat2 = {
    label: 'A2',
    type: 'seat' as const,
    price: 150,
    status: 'available' as const,
  };

  const mockSeat3 = {
    label: 'A3',
    type: 'berth' as const,
    price: 200,
    status: 'available' as const,
  };

  describe('isSelected', () => {
    it('should return false for unselected seat', () => {
      const { result } = renderHook(() => useSelection({}));
      expect(result.current.isSelected('A1')).toBe(false);
    });

    it('should return true for selected seat', () => {
      const { result } = renderHook(() => useSelection({}));

      act(() => {
        result.current.toggleSelection(mockSeat);
      });

      expect(result.current.isSelected('A1')).toBe(true);
    });
  });

  describe('toggleSelection', () => {
    it('should select a seat when not selected', () => {
      const onSelectionChange = jest.fn();
      const { result } = renderHook(() => useSelection({ onSelectionChange }));

      act(() => {
        result.current.toggleSelection(mockSeat);
      });

      expect(result.current.isSelected('A1')).toBe(true);
      expect(onSelectionChange).toHaveBeenCalledWith([
        { label: 'A1', type: 'seat', price: 100, status: 'available' },
      ]);
    });

    it('should deselect a seat when already selected', () => {
      const onSelectionChange = jest.fn();
      const { result } = renderHook(() => useSelection({ onSelectionChange }));

      act(() => {
        result.current.toggleSelection(mockSeat);
      });

      act(() => {
        result.current.toggleSelection(mockSeat);
      });

      expect(result.current.isSelected('A1')).toBe(false);
      expect(onSelectionChange).toHaveBeenLastCalledWith([]);
    });

    it('should allow multiple selections', () => {
      const onSelectionChange = jest.fn();
      const { result } = renderHook(() => useSelection({ onSelectionChange }));

      act(() => {
        result.current.toggleSelection(mockSeat);
      });
      act(() => {
        result.current.toggleSelection(mockSeat2);
      });

      expect(result.current.isSelected('A1')).toBe(true);
      expect(result.current.isSelected('A2')).toBe(true);
    });
  });

  describe('maxSelectableSeats', () => {
    it('should enforce max selection limit', () => {
      const onSelectionChange = jest.fn();
      const onMaxSeatsReached = jest.fn();
      const { result } = renderHook(() =>
        useSelection({
          onSelectionChange,
          maxSelectableSeats: 2,
          onMaxSeatsReached,
        })
      );

      act(() => {
        result.current.toggleSelection(mockSeat);
      });
      act(() => {
        result.current.toggleSelection(mockSeat2);
      });
      act(() => {
        result.current.toggleSelection(mockSeat3);
      });

      expect(result.current.isSelected('A1')).toBe(true);
      expect(result.current.isSelected('A2')).toBe(true);
      expect(result.current.isSelected('A3')).toBe(false);
      expect(onMaxSeatsReached).toHaveBeenCalledWith(2);
    });

    it('should allow selection after deselecting when at max', () => {
      const { result } = renderHook(() =>
        useSelection({ maxSelectableSeats: 2 })
      );

      act(() => {
        result.current.toggleSelection(mockSeat);
      });
      act(() => {
        result.current.toggleSelection(mockSeat2);
      });

      // Deselect one
      act(() => {
        result.current.toggleSelection(mockSeat);
      });

      // Now should be able to select another
      act(() => {
        result.current.toggleSelection(mockSeat3);
      });

      expect(result.current.isSelected('A1')).toBe(false);
      expect(result.current.isSelected('A2')).toBe(true);
      expect(result.current.isSelected('A3')).toBe(true);
    });

    it('should work with maxSelectableSeats of 1', () => {
      const onMaxSeatsReached = jest.fn();
      const { result } = renderHook(() =>
        useSelection({ maxSelectableSeats: 1, onMaxSeatsReached })
      );

      act(() => {
        result.current.toggleSelection(mockSeat);
      });
      act(() => {
        result.current.toggleSelection(mockSeat2);
      });

      expect(result.current.isSelected('A1')).toBe(true);
      expect(result.current.isSelected('A2')).toBe(false);
      expect(onMaxSeatsReached).toHaveBeenCalledWith(1);
    });
  });

  describe('callbacks', () => {
    it('should call onSelectionChange with all selected seats', () => {
      const onSelectionChange = jest.fn();
      const { result } = renderHook(() => useSelection({ onSelectionChange }));

      act(() => {
        result.current.toggleSelection(mockSeat);
      });

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith([
        { label: 'A1', type: 'seat', price: 100, status: 'available' },
      ]);

      act(() => {
        result.current.toggleSelection(mockSeat2);
      });

      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenLastCalledWith([
        { label: 'A1', type: 'seat', price: 100, status: 'available' },
        { label: 'A2', type: 'seat', price: 150, status: 'available' },
      ]);
    });

    it('should not call onMaxSeatsReached when under limit', () => {
      const onMaxSeatsReached = jest.fn();
      const { result } = renderHook(() =>
        useSelection({ maxSelectableSeats: 3, onMaxSeatsReached })
      );

      act(() => {
        result.current.toggleSelection(mockSeat);
      });
      act(() => {
        result.current.toggleSelection(mockSeat2);
      });

      expect(onMaxSeatsReached).not.toHaveBeenCalled();
    });

    it('should work without any callbacks', () => {
      const { result } = renderHook(() => useSelection({}));

      // Should not throw
      act(() => {
        result.current.toggleSelection(mockSeat);
      });

      expect(result.current.isSelected('A1')).toBe(true);
    });
  });

  describe('O(1) lookup performance', () => {
    it('should handle many seats efficiently', () => {
      const { result } = renderHook(() => useSelection({}));

      // Add many seats - each selection must be in separate act() to allow state updates
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.toggleSelection({
            label: `Seat${i}`,
            type: 'seat',
            price: 100,
            status: 'available',
          });
        });
      }

      // isSelected should be O(1)
      expect(result.current.isSelected('Seat50')).toBe(true);
      expect(result.current.isSelected('NonExistent')).toBe(false);
    });
  });
});
