import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chart } from './index';
import type { ChartProps, SeatTypeConfig, LegendItem } from '../../types';

describe('Chart Component', () => {
  const basicSeatTypes: Record<string, SeatTypeConfig> = {
    a: { type: 'seat', price: 100 },
    b: { type: 'berth', price: 200 },
    d: { type: 'driver' },
    o: { type: 'door' },
    _: { type: 'space' },
  };

  const simpleSeatMap = ['aa', 'aa'];

  const defaultProps: ChartProps = {
    seatMaps: simpleSeatMap,
    seatTypes: basicSeatTypes,
  };

  describe('Rendering', () => {
    it('should render the chart container', () => {
      const { container } = render(<Chart {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render seats from seat map', () => {
      render(<Chart {...defaultProps} />);
      // 4 seats in a 2x2 grid
      const seats = screen.getAllByRole('gridcell');
      expect(seats).toHaveLength(4);
    });

    it('should render grid structure', () => {
      render(<Chart {...defaultProps} />);
      const grid = screen.getByRole('grid');
      expect(grid).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Chart {...defaultProps} className="custom-chart" />);
      expect(container.firstChild).toHaveClass('custom-chart');
    });
  });

  describe('Seat selection', () => {
    it('should allow selecting a seat', async () => {
      const onSelectionChange = jest.fn();
      const user = userEvent.setup();
      render(<Chart {...defaultProps} onSelectionChange={onSelectionChange} />);

      const seats = screen.getAllByRole('gridcell');
      await user.click(seats[0]);

      expect(onSelectionChange).toHaveBeenCalledWith([
        expect.objectContaining({ label: '1', type: 'seat', price: 100 }),
      ]);
    });

    it('should allow deselecting a seat', async () => {
      const onSelectionChange = jest.fn();
      const user = userEvent.setup();
      render(<Chart {...defaultProps} onSelectionChange={onSelectionChange} />);

      const seats = screen.getAllByRole('gridcell');

      // Select
      await user.click(seats[0]);
      // Deselect
      await user.click(seats[0]);

      expect(onSelectionChange).toHaveBeenLastCalledWith([]);
    });

    it('should allow selecting multiple seats', async () => {
      const onSelectionChange = jest.fn();
      const user = userEvent.setup();
      render(<Chart {...defaultProps} onSelectionChange={onSelectionChange} />);

      const seats = screen.getAllByRole('gridcell');
      await user.click(seats[0]);
      await user.click(seats[1]);

      expect(onSelectionChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ label: '1' }),
        expect.objectContaining({ label: '2' }),
      ]);
    });

    it('should update aria-pressed on selected seats', async () => {
      const user = userEvent.setup();
      render(<Chart {...defaultProps} />);

      const seats = screen.getAllByRole('gridcell');
      expect(seats[0]).toHaveAttribute('aria-pressed', 'false');

      await user.click(seats[0]);
      expect(seats[0]).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Max selection limit', () => {
    it('should enforce maxSelectableSeats', async () => {
      const onSelectionChange = jest.fn();
      const onMaxSeatsReached = jest.fn();
      const user = userEvent.setup();

      render(
        <Chart
          {...defaultProps}
          maxSelectableSeats={2}
          onSelectionChange={onSelectionChange}
          onMaxSeatsReached={onMaxSeatsReached}
        />
      );

      const seats = screen.getAllByRole('gridcell');
      await user.click(seats[0]);
      await user.click(seats[1]);
      await user.click(seats[2]); // Should trigger max reached

      expect(onMaxSeatsReached).toHaveBeenCalledWith(2);
      // Only 2 seats should be selected
      expect(onSelectionChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ label: '1' }),
        expect.objectContaining({ label: '2' }),
      ]);
    });
  });

  describe('Booked and blocked seats', () => {
    it('should render booked seats as non-interactive', async () => {
      const onSelectionChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Chart
          {...defaultProps}
          bookedSeats={['1']}
          onSelectionChange={onSelectionChange}
        />
      );

      const seats = screen.getAllByRole('gridcell');
      await user.click(seats[0]); // Seat 1 is booked

      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('should render blocked seats as non-interactive', async () => {
      const onSelectionChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Chart
          {...defaultProps}
          blockedSeats={['2']}
          onSelectionChange={onSelectionChange}
        />
      );

      const seats = screen.getAllByRole('gridcell');
      await user.click(seats[1]); // Seat 2 is blocked

      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('should have correct aria-disabled for booked seats', () => {
      render(<Chart {...defaultProps} bookedSeats={['1']} />);

      const seats = screen.getAllByRole('gridcell');
      expect(seats[0]).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Disabled state', () => {
    it('should disable all seats when disabled prop is true', async () => {
      const onSelectionChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Chart {...defaultProps} disabled onSelectionChange={onSelectionChange} />
      );

      const seats = screen.getAllByRole('gridcell');
      await user.click(seats[0]);

      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('Layout cells', () => {
    it('should render driver, door, and space cells', () => {
      const seatMapWithLayout = ['d_o', 'aaa'];
      render(<Chart {...defaultProps} seatMaps={seatMapWithLayout} />);

      // Should have driver position
      expect(screen.getByLabelText('Driver position')).toBeInTheDocument();
      // Should have door
      expect(screen.getByLabelText('Door')).toBeInTheDocument();
      // Should have 3 seats
      expect(screen.getAllByLabelText(/Seat \d/)).toHaveLength(3);
    });

    it('should render space as aria-hidden', () => {
      const seatMapWithSpace = ['a_a'];
      const { container } = render(
        <Chart {...defaultProps} seatMaps={seatMapWithSpace} />
      );

      const hiddenCells = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenCells.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Multi-layer support', () => {
    it('should render multiple layers', () => {
      const multiLayerSeatMaps = {
        'Lower Deck': ['aa'],
        'Upper Deck': ['aa'],
      };

      render(<Chart {...defaultProps} seatMaps={multiLayerSeatMaps} />);

      // Should have 2 grids
      const grids = screen.getAllByRole('grid');
      expect(grids).toHaveLength(2);
    });

    it('should display layer names', () => {
      const multiLayerSeatMaps = {
        'Lower Deck': ['aa'],
        'Upper Deck': ['aa'],
      };

      render(<Chart {...defaultProps} seatMaps={multiLayerSeatMaps} />);

      expect(screen.getByText('Lower Deck')).toBeInTheDocument();
      expect(screen.getByText('Upper Deck')).toBeInTheDocument();
    });

    it('should continue seat numbering across layers', async () => {
      const multiLayerSeatMaps = {
        'Lower Deck': ['aa'], // Seats 1, 2
        'Upper Deck': ['aa'], // Seats 3, 4
      };
      const onSelectionChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Chart
          {...defaultProps}
          seatMaps={multiLayerSeatMaps}
          onSelectionChange={onSelectionChange}
        />
      );

      const seats = screen.getAllByRole('gridcell');
      await user.click(seats[3]); // Should be seat 4

      expect(onSelectionChange).toHaveBeenCalledWith([
        expect.objectContaining({ label: '4' }),
      ]);
    });

    it('should use grid aria-label with layer name', () => {
      const multiLayerSeatMaps = {
        'Lower Deck': ['aa'],
        'Upper Deck': ['aa'],
      };

      render(<Chart {...defaultProps} seatMaps={multiLayerSeatMaps} />);

      expect(screen.getByRole('grid', { name: 'Lower Deck' })).toBeInTheDocument();
      expect(screen.getByRole('grid', { name: 'Upper Deck' })).toBeInTheDocument();
    });
  });

  describe('Berth support', () => {
    it('should render berth seats', () => {
      const berthSeatMap = ['bb'];
      render(<Chart {...defaultProps} seatMaps={berthSeatMap} />);

      const berths = screen.getAllByLabelText(/Berth/);
      expect(berths).toHaveLength(2);
    });

    it('should handle berth selection', async () => {
      const berthSeatMap = ['bb'];
      const onSelectionChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Chart
          {...defaultProps}
          seatMaps={berthSeatMap}
          onSelectionChange={onSelectionChange}
        />
      );

      const berths = screen.getAllByRole('gridcell');
      await user.click(berths[0]);

      expect(onSelectionChange).toHaveBeenCalledWith([
        expect.objectContaining({ type: 'berth', price: 200 }),
      ]);
    });
  });

  describe('Legend', () => {
    it('should render legend when provided', () => {
      const legends: LegendItem[] = [
        { status: 'available' },
        { status: 'booked' },
      ];

      render(<Chart {...defaultProps} legends={legends} />);

      expect(screen.getByRole('list', { name: 'Seat status legend' })).toBeInTheDocument();
    });

    it('should not render legend when not provided', () => {
      render(<Chart {...defaultProps} />);

      expect(screen.queryByRole('list', { name: 'Seat status legend' })).not.toBeInTheDocument();
    });
  });

  describe('Custom labeling', () => {
    it('should use custom labels from seat map notation', async () => {
      const customLabelSeatMap = ['a[1,R1]a[2,R2]'];
      const onSelectionChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Chart
          {...defaultProps}
          seatMaps={customLabelSeatMap}
          onSelectionChange={onSelectionChange}
        />
      );

      expect(screen.getByLabelText(/Seat R1/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Seat R2/)).toBeInTheDocument();

      const seats = screen.getAllByRole('gridcell');
      await user.click(seats[0]);

      expect(onSelectionChange).toHaveBeenCalledWith([
        expect.objectContaining({ label: 'R1' }),
      ]);
    });
  });

  describe('Keyboard navigation', () => {
    it('should allow selecting seats with keyboard', () => {
      const onSelectionChange = jest.fn();
      render(<Chart {...defaultProps} onSelectionChange={onSelectionChange} />);

      const seats = screen.getAllByRole('gridcell');
      seats[0].focus();

      fireEvent.keyDown(seats[0], { key: 'Enter' });
      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('should allow selecting seats with Space key', () => {
      const onSelectionChange = jest.fn();
      render(<Chart {...defaultProps} onSelectionChange={onSelectionChange} />);

      const seats = screen.getAllByRole('gridcell');
      seats[0].focus();

      fireEvent.keyDown(seats[0], { key: ' ' });
      expect(onSelectionChange).toHaveBeenCalled();
    });
  });

  describe('Realistic bus layout', () => {
    it('should render a complete bus seat layout', () => {
      const busLayout = [
        'd__o',
        'aa_a',
        'aa_a',
        'aaaa',
      ];

      render(<Chart {...defaultProps} seatMaps={busLayout} />);

      // Driver position
      expect(screen.getByLabelText('Driver position')).toBeInTheDocument();
      // Door
      expect(screen.getByLabelText('Door')).toBeInTheDocument();
      // 11 seats total: 2+1 + 2+1 + 4 = 10... wait let me count again
      // Row 2: aa_a = 3 seats
      // Row 3: aa_a = 3 seats
      // Row 4: aaaa = 4 seats
      // Total: 10 seats
      const seats = screen.getAllByLabelText(/Seat \d/);
      expect(seats).toHaveLength(10);
    });
  });
});
