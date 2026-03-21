import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
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

    it('should render as a button element inside a gridcell', () => {
      render(<SeatButton {...defaultProps} />);
      const gridcell = screen.getByRole('gridcell');
      const button = gridcell.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button?.tagName).toBe('BUTTON');
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
    it('should have role="gridcell" on wrapper div', () => {
      render(<SeatButton {...defaultProps} />);
      expect(screen.getByRole('gridcell')).toBeInTheDocument();
    });

    it('should have correct aria-label on button for available seat with price', () => {
      render(<SeatButton {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Seat A1, available, $100');
    });

    it('should have correct aria-label for berth', () => {
      render(<SeatButton {...defaultProps} type="berth" label="B1" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Berth B1, available, $100');
    });

    it('should have correct aria-label for selected seat', () => {
      render(<SeatButton {...defaultProps} isSelected />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Seat A1, selected, $100');
    });

    it('should have correct aria-label for booked seat', () => {
      render(<SeatButton {...defaultProps} status="booked" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Seat A1, booked, $100');
    });

    it('should omit price from aria-label when price is 0', () => {
      render(<SeatButton {...defaultProps} price={0} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Seat A1, available');
    });

    it('should have aria-selected on gridcell wrapper for selection state', () => {
      const { rerender } = render(<SeatButton {...defaultProps} isSelected={false} />);
      expect(screen.getByRole('gridcell')).toHaveAttribute('aria-selected', 'false');

      rerender(<SeatButton {...defaultProps} isSelected={true} />);
      expect(screen.getByRole('gridcell')).toHaveAttribute('aria-selected', 'true');
    });

    it('should have aria-disabled on button for non-available seats', () => {
      render(<SeatButton {...defaultProps} status="booked" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be focusable when available', () => {
      render(<SeatButton {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0');
    });

    it('should not be focusable when booked', () => {
      render(<SeatButton {...defaultProps} status="booked" />);
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '-1');
    });

    it('should not be focusable when disabled', () => {
      render(<SeatButton {...defaultProps} disabled />);
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '-1');
    });

    it('should use custom priceFormatter when provided', () => {
      render(<SeatButton {...defaultProps} priceFormatter={(p) => `₹${p}`} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Seat A1, available, ₹100');
    });
  });

  describe('Click handling', () => {
    it('should call onClick when clicked on available seat', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<SeatButton {...defaultProps} onClick={onClick} />);

      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when clicked on booked seat', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<SeatButton {...defaultProps} status="booked" onClick={onClick} />);

      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when clicked on blocked seat', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<SeatButton {...defaultProps} status="blocked" onClick={onClick} />);

      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when disabled', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<SeatButton {...defaultProps} disabled onClick={onClick} />);

      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard handling', () => {
    it('should call onClick when Enter is pressed on available seat', () => {
      const onClick = vi.fn();
      render(<SeatButton {...defaultProps} onClick={onClick} />);

      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Space is pressed on available seat', () => {
      const onClick = vi.fn();
      render(<SeatButton {...defaultProps} onClick={onClick} />);

      fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when other keys are pressed', () => {
      const onClick = vi.fn();
      render(<SeatButton {...defaultProps} onClick={onClick} />);

      fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' });
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' });
      fireEvent.keyDown(screen.getByRole('button'), { key: 'a' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick on Enter when disabled', () => {
      const onClick = vi.fn();
      render(<SeatButton {...defaultProps} disabled onClick={onClick} />);

      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick on Enter when booked', () => {
      const onClick = vi.fn();
      render(<SeatButton {...defaultProps} status="booked" onClick={onClick} />);

      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Status styles', () => {
    it('should apply available styles (green) for available status', () => {
      const { container } = render(<SeatButton {...defaultProps} status="available" />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-green-500');
    });

    it('should apply selected styles (blue) when isSelected is true', () => {
      const { container } = render(<SeatButton {...defaultProps} isSelected />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-blue-500');
    });

    it('should apply booked styles (gray) for booked status', () => {
      const { container } = render(<SeatButton {...defaultProps} status="booked" />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-gray-400');
    });

    it('should apply blocked styles (red) for blocked status', () => {
      const { container } = render(<SeatButton {...defaultProps} status="blocked" />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-red-500');
    });

    it('should apply opacity-50 when disabled', () => {
      const { container } = render(<SeatButton {...defaultProps} disabled />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('opacity-50');
    });
  });

  describe('Status indicator icons', () => {
    it('should show checkmark icon when selected', () => {
      const { container } = render(<SeatButton {...defaultProps} isSelected />);
      const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
      // Should have seat icon + checkmark icon
      expect(svgs.length).toBeGreaterThanOrEqual(2);
    });

    it('should show user icon when booked', () => {
      const { container } = render(<SeatButton {...defaultProps} status="booked" />);
      const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(svgs.length).toBeGreaterThanOrEqual(2);
    });

    it('should show lock icon when blocked', () => {
      const { container } = render(<SeatButton {...defaultProps} status="blocked" />);
      const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(svgs.length).toBeGreaterThanOrEqual(2);
    });

    it('should not show status icon when available', () => {
      const { container } = render(<SeatButton {...defaultProps} status="available" />);
      // Only the seat shape icon, no status indicator
      const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(svgs).toHaveLength(1);
    });
  });

  describe('Berth specific', () => {
    it('should have different size for berth type', () => {
      const { container } = render(<SeatButton {...defaultProps} type="berth" />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('h-[5.5rem]');
    });
  });

  describe('Decorative mode', () => {
    it('should not render gridcell role when decorative', () => {
      render(<SeatButton {...defaultProps} decorative />);
      expect(screen.queryByRole('gridcell')).not.toBeInTheDocument();
    });

    it('should have aria-hidden on wrapper when decorative', () => {
      const { container } = render(<SeatButton {...defaultProps} decorative />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render gridcell role when not decorative', () => {
      render(<SeatButton {...defaultProps} />);
      expect(screen.getByRole('gridcell')).toBeInTheDocument();
    });
  });
});
