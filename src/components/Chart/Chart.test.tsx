import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
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
      // 4 seats in a 2x2 grid — each seat has a gridcell wrapper
      const gridcells = screen.getAllByRole('gridcell');
      expect(gridcells).toHaveLength(4);
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
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();
      render(<Chart {...defaultProps} onSelectionChange={onSelectionChange} />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      expect(onSelectionChange).toHaveBeenCalledWith([
        expect.objectContaining({ label: '1', type: 'seat', price: 100 }),
      ]);
    });

    it('should allow deselecting a seat', async () => {
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();
      render(<Chart {...defaultProps} onSelectionChange={onSelectionChange} />);

      const buttons = screen.getAllByRole('button');

      // Select
      await user.click(buttons[0]);
      // Deselect
      await user.click(buttons[0]);

      expect(onSelectionChange).toHaveBeenLastCalledWith([]);
    });

    it('should allow selecting multiple seats', async () => {
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();
      render(<Chart {...defaultProps} onSelectionChange={onSelectionChange} />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      await user.click(buttons[1]);

      expect(onSelectionChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ label: '1' }),
        expect.objectContaining({ label: '2' }),
      ]);
    });

    it('should update aria-selected on gridcell wrapper when selected', async () => {
      const user = userEvent.setup();
      render(<Chart {...defaultProps} />);

      const gridcells = screen.getAllByRole('gridcell');
      expect(gridcells[0]).toHaveAttribute('aria-selected', 'false');

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      expect(gridcells[0]).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Max selection limit', () => {
    it('should enforce maxSelectableSeats', async () => {
      const onSelectionChange = vi.fn();
      const onMaxSeatsReached = vi.fn();
      const user = userEvent.setup();

      render(
        <Chart
          {...defaultProps}
          maxSelectableSeats={2}
          onSelectionChange={onSelectionChange}
          onMaxSeatsReached={onMaxSeatsReached}
        />,
      );

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);
      await user.click(buttons[1]);
      await user.click(buttons[2]); // Should trigger max reached

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
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();

      render(<Chart {...defaultProps} bookedSeats={['1']} onSelectionChange={onSelectionChange} />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]); // Seat 1 is booked

      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('should render blocked seats as non-interactive', async () => {
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Chart {...defaultProps} blockedSeats={['2']} onSelectionChange={onSelectionChange} />,
      );

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[1]); // Seat 2 is blocked

      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('should have correct aria-disabled on button for booked seats', () => {
      render(<Chart {...defaultProps} bookedSeats={['1']} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Disabled state', () => {
    it('should disable all seats when disabled prop is true', async () => {
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();

      render(<Chart {...defaultProps} disabled onSelectionChange={onSelectionChange} />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

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

    it('should render space as accessible with aria-label', () => {
      const seatMapWithSpace = ['a_a'];
      render(<Chart {...defaultProps} seatMaps={seatMapWithSpace} />);

      expect(screen.getByLabelText('Empty')).toBeInTheDocument();
    });
  });

  describe('Multi-layer support', () => {
    const multiLayerSeatMaps = {
      'Lower Deck': ['aa'],
      'Upper Deck': ['aa'],
    };

    it('should render tabs for multi-layer layout', () => {
      render(<Chart {...defaultProps} seatMaps={multiLayerSeatMaps} />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);
      expect(tabs[0]).toHaveTextContent('Lower Deck');
      expect(tabs[1]).toHaveTextContent('Upper Deck');
    });

    it('should show first layer by default', () => {
      render(<Chart {...defaultProps} seatMaps={multiLayerSeatMaps} />);

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');

      // Only one grid visible (the active tab panel)
      const grids = screen.getAllByRole('grid');
      expect(grids).toHaveLength(1);
    });

    it('should switch layers when clicking tabs', async () => {
      const user = userEvent.setup();
      render(<Chart {...defaultProps} seatMaps={multiLayerSeatMaps} />);

      // Initially shows Lower Deck seats (1, 2)
      expect(screen.getByLabelText(/Seat 1/)).toBeInTheDocument();

      // Click Upper Deck tab
      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[1]);

      // Now shows Upper Deck seats (3, 4)
      expect(screen.getByLabelText(/Seat 3/)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Seat 1/)).not.toBeInTheDocument();
    });

    it('should navigate tabs with arrow keys', async () => {
      render(<Chart {...defaultProps} seatMaps={multiLayerSeatMaps} />);

      const tabs = screen.getAllByRole('tab');
      tabs[0].focus();

      fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      expect(document.activeElement).toBe(tabs[1]);

      fireEvent.keyDown(tabs[1], { key: 'ArrowLeft' });
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(document.activeElement).toBe(tabs[0]);
    });

    it('should wrap around with arrow key navigation', async () => {
      render(<Chart {...defaultProps} seatMaps={multiLayerSeatMaps} />);

      const tabs = screen.getAllByRole('tab');
      tabs[1].focus();

      // ArrowRight from last tab wraps to first
      fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('should support Home and End keys on tabs', () => {
      render(<Chart {...defaultProps} seatMaps={multiLayerSeatMaps} />);

      const tabs = screen.getAllByRole('tab');
      tabs[0].focus();

      fireEvent.keyDown(tabs[0], { key: 'End' });
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

      fireEvent.keyDown(tabs[1], { key: 'Home' });
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('should have proper tab panel ARIA linkage', () => {
      render(<Chart {...defaultProps} seatMaps={multiLayerSeatMaps} />);

      const tabs = screen.getAllByRole('tab');
      const tabpanel = screen.getByRole('tabpanel');

      // Active tab should control the visible panel
      const controlsId = tabs[0].getAttribute('aria-controls');
      expect(tabpanel).toHaveAttribute('id', controlsId);
      expect(tabpanel).toHaveAttribute('aria-labelledby', tabs[0].id);
    });

    it('should continue seat numbering across layers', async () => {
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Chart
          {...defaultProps}
          seatMaps={multiLayerSeatMaps}
          onSelectionChange={onSelectionChange}
        />,
      );

      // Switch to Upper Deck
      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[1]);

      const buttons = screen.getAllByRole('button');
      // Filter out tab buttons — seat buttons have aria-label
      const seatButtons = buttons.filter((b) => b.getAttribute('aria-label')?.match(/Seat|Berth/));
      await user.click(seatButtons[0]); // Should be seat 3

      expect(onSelectionChange).toHaveBeenCalledWith([expect.objectContaining({ label: '3' })]);
    });

    it('should preserve selection when switching tabs', async () => {
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Chart
          {...defaultProps}
          seatMaps={multiLayerSeatMaps}
          onSelectionChange={onSelectionChange}
        />,
      );

      // Select seat on Lower Deck
      const seatButtons = screen
        .getAllByRole('button')
        .filter((b) => b.getAttribute('aria-label')?.match(/Seat/));
      await user.click(seatButtons[0]);

      // Switch to Upper Deck and back
      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[1]);
      await user.click(tabs[0]);

      // Seat 1 should still be selected
      const gridcells = screen.getAllByRole('gridcell');
      expect(gridcells[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('should not render tabs for single-layer layout', () => {
      render(<Chart {...defaultProps} />);
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
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
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Chart {...defaultProps} seatMaps={berthSeatMap} onSelectionChange={onSelectionChange} />,
      );

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      expect(onSelectionChange).toHaveBeenCalledWith([
        expect.objectContaining({ type: 'berth', price: 200 }),
      ]);
    });
  });

  describe('Legend', () => {
    it('should render legend when provided', () => {
      const legends: LegendItem[] = [{ status: 'available' }, { status: 'booked' }];

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
      const onSelectionChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Chart
          {...defaultProps}
          seatMaps={customLabelSeatMap}
          onSelectionChange={onSelectionChange}
        />,
      );

      expect(screen.getByLabelText(/Seat R1/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Seat R2/)).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      expect(onSelectionChange).toHaveBeenCalledWith([expect.objectContaining({ label: 'R1' })]);
    });
  });

  describe('Keyboard navigation', () => {
    it('should allow selecting seats with keyboard', () => {
      const onSelectionChange = vi.fn();
      render(<Chart {...defaultProps} onSelectionChange={onSelectionChange} />);

      const buttons = screen.getAllByRole('button');
      buttons[0].focus();

      fireEvent.keyDown(buttons[0], { key: 'Enter' });
      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('should allow selecting seats with Space key', () => {
      const onSelectionChange = vi.fn();
      render(<Chart {...defaultProps} onSelectionChange={onSelectionChange} />);

      const buttons = screen.getAllByRole('button');
      buttons[0].focus();

      fireEvent.keyDown(buttons[0], { key: ' ' });
      expect(onSelectionChange).toHaveBeenCalled();
    });
  });

  describe('Arrow key navigation', () => {
    it('should move focus right with ArrowRight', () => {
      render(<Chart {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      expect(document.activeElement).toBe(buttons[0]);

      fireEvent.keyDown(buttons[0], { key: 'ArrowRight' });
      expect(document.activeElement).toBe(buttons[1]);
    });

    it('should move focus left with ArrowLeft', () => {
      render(<Chart {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons[1].focus();
      expect(document.activeElement).toBe(buttons[1]);

      fireEvent.keyDown(buttons[1], { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(buttons[0]);
    });

    it('should not move past the first cell with ArrowLeft', () => {
      render(<Chart {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons[0].focus();

      fireEvent.keyDown(buttons[0], { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(buttons[0]);
    });

    it('should not move past the last cell with ArrowRight', () => {
      render(<Chart {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      const lastButton = buttons[buttons.length - 1];
      lastButton.focus();

      fireEvent.keyDown(lastButton, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(lastButton);
    });
  });

  describe('Realistic bus layout', () => {
    it('should render a complete bus seat layout', () => {
      const busLayout = ['d__o', 'aa_a', 'aa_a', 'aaaa'];

      render(<Chart {...defaultProps} seatMaps={busLayout} />);

      // Driver position
      expect(screen.getByLabelText('Driver position')).toBeInTheDocument();
      // Door
      expect(screen.getByLabelText('Door')).toBeInTheDocument();
      // 10 seats total: 3 + 3 + 4
      const seats = screen.getAllByLabelText(/Seat \d/);
      expect(seats).toHaveLength(10);
    });
  });

  describe('Accessibility features', () => {
    it('should have sr-only keyboard instructions linked via aria-describedby', () => {
      render(<Chart {...defaultProps} />);
      const grid = screen.getByRole('grid');
      const describedBy = grid.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const instructions = document.getElementById(describedBy!);
      expect(instructions).toBeInTheDocument();
      expect(instructions?.textContent).toContain('arrow keys');
    });

    it('should have live region for selection announcements', async () => {
      const user = userEvent.setup();
      const { container } = render(<Chart {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]);

      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion?.textContent).toContain('1 seat selected');
    });

    it('should have assertive live region for max seats reached', async () => {
      const user = userEvent.setup();
      const { container } = render(<Chart {...defaultProps} maxSelectableSeats={1} />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]); // Select first seat
      await user.click(buttons[1]); // Try to exceed limit

      const assertiveRegion = container.querySelector('[aria-live="assertive"]');
      expect(assertiveRegion).toBeInTheDocument();
      expect(assertiveRegion?.textContent).toContain('Maximum of 1 seats reached');
    });

    it('should have proper ARIA grid structure: grid > row > gridcell', () => {
      render(<Chart {...defaultProps} />);

      const grid = screen.getByRole('grid');
      const rows = grid.querySelectorAll('[role="row"]');
      expect(rows.length).toBeGreaterThan(0);

      rows.forEach((row) => {
        const gridcells = row.querySelectorAll('[role="gridcell"]');
        expect(gridcells.length).toBeGreaterThan(0);
      });
    });

    it('should have buttons inside gridcells (not gridcell on button)', () => {
      render(<Chart {...defaultProps} />);

      const gridcells = screen.getAllByRole('gridcell');
      gridcells.forEach((gridcell) => {
        // gridcell should be a div, not a button
        expect(gridcell.tagName).toBe('DIV');
        // Should contain a button (for seat cells)
        const button = gridcell.querySelector('button');
        if (button) {
          expect(button.getAttribute('role')).not.toBe('gridcell');
        }
      });
    });
  });

  describe('Multi-layer berth support', () => {
    const multiLayerBerthMaps = {
      'Lower Deck': ['ab', 'aa'],
      'Upper Deck': ['bb'],
    };

    it('should render berth grid layout within a tabbed multi-layer view', async () => {
      const user = userEvent.setup();
      render(<Chart {...defaultProps} seatMaps={multiLayerBerthMaps} />);

      // Switch to Upper Deck (berths only)
      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[1]);

      const grid = screen.getByRole('grid');
      expect(grid).toHaveAttribute('aria-label', 'Seat chart');
      // hideHeading is true in tabbed layout — should have rounded-b-lg
      expect(grid.className).toContain('rounded-b-lg');
    });

    it('should render mixed seat and berth in grid layout with correct grid-row span', () => {
      // Single named layer with both seats and berths triggers grid layout
      const mixedSeatMap = ['ab'];
      render(<Chart {...defaultProps} seatMaps={mixedSeatMap} />);

      const grid = screen.getByRole('grid');
      expect(grid).toBeInTheDocument();

      // The berth cell should have grid-row span 2
      const gridcells = screen.getAllByRole('gridcell');
      const berthCell = gridcells.find((gc) => gc.querySelector('[aria-label*="Berth"]'));
      expect(berthCell?.parentElement?.style.gridRow).toContain('span 2');
    });

    it('should render named single layer with heading in berth grid layout', () => {
      const namedBerthMap = { 'Sleeper Deck': ['ab'] };
      render(<Chart {...defaultProps} seatMaps={namedBerthMap} />);

      // Single named layer — no tabs, heading shown
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      const heading = screen.getByRole('heading', { name: 'Sleeper Deck' });
      expect(heading).toBeInTheDocument();

      // Grid should use aria-labelledby (not aria-label) since heading exists
      const grid = screen.getByRole('grid');
      expect(grid).toHaveAttribute('aria-labelledby', heading.id);
      expect(grid).not.toHaveAttribute('aria-label');
    });
  });

  describe('Price formatter', () => {
    it('should use custom priceFormatter in aria-labels', () => {
      render(<Chart {...defaultProps} priceFormatter={(price) => `₹${price}`} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-label', 'Seat 1, available, ₹100');
    });
  });
});
