import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { SeatButton } from './index';

describe('SeatButton Component', () => {
  const defaultProps = {
    type: 'seat' as const,
    label: 'A1',
    price: 100,
    status: 'available' as const,
    isSelected: false,
  };

  describe('Rendering', () => {
    it('should render the seat label', () => {
      render(<SeatButton {...defaultProps} />);
      expect(screen.getByText('A1')).toBeInTheDocument();
    });

    it('should render as a button element', () => {
      render(<SeatButton {...defaultProps} />);
      const button = screen.getByRole('gridcell');
      expect(button.tagName).toBe('BUTTON');
    });

    it('should render SeatIcon for seat type', () => {
      const { container } = render(<SeatButton {...defaultProps} type="seat" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render BerthIcon for berth type', () => {
      const { container } = render(<SeatButton {...defaultProps} type="berth" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="gridcell"', () => {
      render(<SeatButton {...defaultProps} />);
      expect(screen.getByRole('gridcell')).toBeInTheDocument();
    });

    it('should have correct aria-label for available seat with price', () => {
      render(<SeatButton {...defaultProps} />);
      const button = screen.getByRole('gridcell');
      expect(button).toHaveAttribute('aria-label', 'Seat A1, available, $100');
    });

    it('should have correct aria-label for berth', () => {
      render(<SeatButton {...defaultProps} type="berth" label="B1" />);
      const button = screen.getByRole('gridcell');
      expect(button).toHaveAttribute('aria-label', 'Berth B1, available, $100');
    });

    it('should have correct aria-label for selected seat', () => {
      render(<SeatButton {...defaultProps} isSelected />);
      const button = screen.getByRole('gridcell');
      expect(button).toHaveAttribute('aria-label', 'Seat A1, selected, $100');
    });

    it('should have correct aria-label for booked seat', () => {
      render(<SeatButton {...defaultProps} status="booked" />);
      const button = screen.getByRole('gridcell');
      expect(button).toHaveAttribute('aria-label', 'Seat A1, booked, $100');
    });

    it('should omit price from aria-label when price is 0', () => {
      render(<SeatButton {...defaultProps} price={0} />);
      const button = screen.getByRole('gridcell');
      expect(button).toHaveAttribute('aria-label', 'Seat A1, available');
    });

    it('should have aria-selected for selection state', () => {
      const { rerender } = render(<SeatButton {...defaultProps} isSelected={false} />);
      expect(screen.getByRole('gridcell')).toHaveAttribute('aria-selected', 'false');

      rerender(<SeatButton {...defaultProps} isSelected={true} />);
      expect(screen.getByRole('gridcell')).toHaveAttribute('aria-selected', 'true');
    });

    it('should have aria-disabled for non-available seats', () => {
      render(<SeatButton {...defaultProps} status="booked" />);
      expect(screen.getByRole('gridcell')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be focusable when available', () => {
      render(<SeatButton {...defaultProps} />);
      expect(screen.getByRole('gridcell')).toHaveAttribute('tabIndex', '0');
    });

    it('should not be focusable when booked', () => {
      render(<SeatButton {...defaultProps} status="booked" />);
      expect(screen.getByRole('gridcell')).toHaveAttribute('tabIndex', '-1');
    });

    it('should not be focusable when disabled', () => {
      render(<SeatButton {...defaultProps} disabled />);
      expect(screen.getByRole('gridcell')).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Click handling', () => {
    it('should call onClick when clicked on available seat', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();
      render(<SeatButton {...defaultProps} onClick={onClick} />);

      await user.click(screen.getByRole('gridcell'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when clicked on booked seat', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();
      render(<SeatButton {...defaultProps} status="booked" onClick={onClick} />);

      await user.click(screen.getByRole('gridcell'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when clicked on blocked seat', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();
      render(<SeatButton {...defaultProps} status="blocked" onClick={onClick} />);

      await user.click(screen.getByRole('gridcell'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when disabled', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();
      render(<SeatButton {...defaultProps} disabled onClick={onClick} />);

      await user.click(screen.getByRole('gridcell'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard handling', () => {
    it('should call onClick when Enter is pressed on available seat', () => {
      const onClick = jest.fn();
      render(<SeatButton {...defaultProps} onClick={onClick} />);

      fireEvent.keyDown(screen.getByRole('gridcell'), { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Space is pressed on available seat', () => {
      const onClick = jest.fn();
      render(<SeatButton {...defaultProps} onClick={onClick} />);

      fireEvent.keyDown(screen.getByRole('gridcell'), { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when other keys are pressed', () => {
      const onClick = jest.fn();
      render(<SeatButton {...defaultProps} onClick={onClick} />);

      fireEvent.keyDown(screen.getByRole('gridcell'), { key: 'Tab' });
      fireEvent.keyDown(screen.getByRole('gridcell'), { key: 'Escape' });
      fireEvent.keyDown(screen.getByRole('gridcell'), { key: 'a' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick on Enter when disabled', () => {
      const onClick = jest.fn();
      render(<SeatButton {...defaultProps} disabled onClick={onClick} />);

      fireEvent.keyDown(screen.getByRole('gridcell'), { key: 'Enter' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick on Enter when booked', () => {
      const onClick = jest.fn();
      render(<SeatButton {...defaultProps} status="booked" onClick={onClick} />);

      fireEvent.keyDown(screen.getByRole('gridcell'), { key: 'Enter' });
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Status styles', () => {
    it('should apply available styles for available status', () => {
      const { container } = render(<SeatButton {...defaultProps} status="available" />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-green-500');
    });

    it('should apply selected styles when isSelected is true', () => {
      const { container } = render(<SeatButton {...defaultProps} isSelected />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-blue-500');
    });

    it('should apply booked styles for booked status', () => {
      const { container } = render(<SeatButton {...defaultProps} status="booked" />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-gray-500');
    });

    it('should apply blocked styles for blocked status', () => {
      const { container } = render(<SeatButton {...defaultProps} status="blocked" />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-amber-500');
    });

    it('should apply opacity-50 when disabled', () => {
      const { container } = render(<SeatButton {...defaultProps} disabled />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('opacity-50');
    });
  });

  describe('Berth specific', () => {
    it('should have different size for berth type', () => {
      const { container } = render(<SeatButton {...defaultProps} type="berth" />);
      const button = container.querySelector('button');
      // Berth has h-[4.5rem] which is different from seat size
      expect(button?.className).toContain('h-[4.5rem]');
    });
  });
});
