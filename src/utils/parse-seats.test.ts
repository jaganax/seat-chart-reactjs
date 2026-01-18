import { parseSeatMap } from './parse-seats';
import type { SeatTypeConfig } from '../types';

describe('parseSeatMap', () => {
  const basicSeatTypes: Record<string, SeatTypeConfig> = {
    a: { type: 'seat', price: 100 },
    b: { type: 'berth', price: 200 },
    d: { type: 'driver' },
    o: { type: 'door' },
    _: { type: 'space' },
  };

  describe('Basic parsing', () => {
    it('should parse a simple seat map with auto-numbering', () => {
      const seatMap = ['aa', 'aa'];
      const result = parseSeatMap(seatMap, basicSeatTypes);

      expect(result.seatMap).toHaveLength(2);
      expect(result.seatMap[0]).toHaveLength(2);
      expect(result.seatMap[1]).toHaveLength(2);

      // Check first row
      expect(result.seatMap[0][0]).toEqual({
        type: 'seat',
        label: '1',
        price: 100,
        status: 'available',
      });
      expect(result.seatMap[0][1]).toEqual({
        type: 'seat',
        label: '2',
        price: 100,
        status: 'available',
      });

      // Check second row
      expect(result.seatMap[1][0]).toEqual({
        type: 'seat',
        label: '3',
        price: 100,
        status: 'available',
      });
      expect(result.seatMap[1][1]).toEqual({
        type: 'seat',
        label: '4',
        price: 100,
        status: 'available',
      });

      expect(result.nextIndex).toBe(4);
    });

    it('should parse berths correctly', () => {
      const seatMap = ['bb'];
      const result = parseSeatMap(seatMap, basicSeatTypes);

      expect(result.seatMap[0][0]).toEqual({
        type: 'berth',
        label: '1',
        price: 200,
        status: 'available',
      });
      expect(result.seatMap[0][1]).toEqual({
        type: 'berth',
        label: '2',
        price: 200,
        status: 'available',
      });
    });

    it('should parse layout cells (driver, door, space)', () => {
      const seatMap = ['d_o'];
      const result = parseSeatMap(seatMap, basicSeatTypes);

      expect(result.seatMap[0][0]).toEqual({ type: 'driver' });
      expect(result.seatMap[0][1]).toEqual({ type: 'space' });
      expect(result.seatMap[0][2]).toEqual({ type: 'door' });
    });

    it('should handle unknown characters as space', () => {
      const seatMap = ['axa'];
      const result = parseSeatMap(seatMap, basicSeatTypes);

      // 'x' is not defined, should be treated as space
      expect(result.seatMap[0][1]).toEqual({ type: 'space' });
    });
  });

  describe('Custom labeling', () => {
    it('should parse custom labels with [n,label] syntax', () => {
      const seatMap = ['a[1,R1]a[2,R2]'];
      const result = parseSeatMap(seatMap, basicSeatTypes);

      expect(result.seatMap[0][0]).toEqual({
        type: 'seat',
        label: 'R1',
        price: 100,
        status: 'available',
      });
      expect(result.seatMap[0][1]).toEqual({
        type: 'seat',
        label: 'R2',
        price: 100,
        status: 'available',
      });
    });

    it('should handle labels with spaces', () => {
      const seatMap = ['a[1, A 1]'];
      const result = parseSeatMap(seatMap, basicSeatTypes);

      expect(result.seatMap[0][0].type).toBe('seat');
      if (result.seatMap[0][0].type === 'seat') {
        expect((result.seatMap[0][0] as { label: string }).label).toBe('A 1');
      }
    });
  });

  describe('Booked and blocked seats', () => {
    it('should mark booked seats correctly', () => {
      const seatMap = ['aa'];
      const bookedSeats = ['1'];
      const result = parseSeatMap(seatMap, basicSeatTypes, bookedSeats);

      expect(result.seatMap[0][0]).toEqual({
        type: 'seat',
        label: '1',
        price: 100,
        status: 'booked',
      });
      expect(result.seatMap[0][1]).toEqual({
        type: 'seat',
        label: '2',
        price: 100,
        status: 'available',
      });
    });

    it('should mark blocked seats correctly', () => {
      const seatMap = ['aa'];
      const blockedSeats = ['2'];
      const result = parseSeatMap(seatMap, basicSeatTypes, [], blockedSeats);

      expect(result.seatMap[0][0]).toEqual({
        type: 'seat',
        label: '1',
        price: 100,
        status: 'available',
      });
      expect(result.seatMap[0][1]).toEqual({
        type: 'seat',
        label: '2',
        price: 100,
        status: 'blocked',
      });
    });

    it('should prioritize booked over blocked for same seat', () => {
      const seatMap = ['a'];
      const bookedSeats = ['1'];
      const blockedSeats = ['1'];
      const result = parseSeatMap(seatMap, basicSeatTypes, bookedSeats, blockedSeats);

      expect(result.seatMap[0][0]).toEqual({
        type: 'seat',
        label: '1',
        price: 100,
        status: 'booked',
      });
    });

    it('should handle custom labeled booked seats', () => {
      const seatMap = ['a[1,A1]a[2,A2]'];
      const bookedSeats = ['A1'];
      const result = parseSeatMap(seatMap, basicSeatTypes, bookedSeats);

      expect(result.seatMap[0][0]).toEqual({
        type: 'seat',
        label: 'A1',
        price: 100,
        status: 'booked',
      });
      expect(result.seatMap[0][1]).toEqual({
        type: 'seat',
        label: 'A2',
        price: 100,
        status: 'available',
      });
    });
  });

  describe('Start index for multi-layer', () => {
    it('should continue numbering from startIndex', () => {
      const seatMap = ['aa'];
      const result = parseSeatMap(seatMap, basicSeatTypes, [], [], 10);

      expect(result.seatMap[0][0]).toEqual({
        type: 'seat',
        label: '11',
        price: 100,
        status: 'available',
      });
      expect(result.seatMap[0][1]).toEqual({
        type: 'seat',
        label: '12',
        price: 100,
        status: 'available',
      });
      expect(result.nextIndex).toBe(12);
    });
  });

  describe('Mixed layouts', () => {
    it('should parse a realistic bus seat map', () => {
      const seatMap = [
        'd__o',
        'aa_a',
        'aa_a',
        'aa_a',
        'aaaa',
      ];
      const result = parseSeatMap(seatMap, basicSeatTypes);

      // First row: driver, space, space, door
      expect(result.seatMap[0][0]).toEqual({ type: 'driver' });
      expect(result.seatMap[0][1]).toEqual({ type: 'space' });
      expect(result.seatMap[0][2]).toEqual({ type: 'space' });
      expect(result.seatMap[0][3]).toEqual({ type: 'door' });

      // Verify seat count
      let seatCount = 0;
      for (const row of result.seatMap) {
        for (const cell of row) {
          if (cell.type === 'seat' || cell.type === 'berth') {
            seatCount++;
          }
        }
      }
      expect(seatCount).toBe(13); // 3+3+3+4 seats
    });
  });

  describe('Edge cases', () => {
    it('should handle empty seat map', () => {
      const result = parseSeatMap([], basicSeatTypes);
      expect(result.seatMap).toEqual([]);
      expect(result.nextIndex).toBe(0);
    });

    it('should handle empty row', () => {
      const seatMap = ['', 'aa'];
      const result = parseSeatMap(seatMap, basicSeatTypes);

      expect(result.seatMap[0]).toEqual([]);
      expect(result.seatMap[1]).toHaveLength(2);
    });

    it('should handle default price when not specified', () => {
      const seatTypes: Record<string, SeatTypeConfig> = {
        a: { type: 'seat' }, // no price
      };
      const result = parseSeatMap(['a'], seatTypes);

      expect(result.seatMap[0][0]).toEqual({
        type: 'seat',
        label: '1',
        price: 0,
        status: 'available',
      });
    });
  });
});
