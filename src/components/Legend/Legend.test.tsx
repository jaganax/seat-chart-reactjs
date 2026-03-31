import { render, screen } from '@testing-library/react';
import { Legend } from './index';
import type { LegendItem } from '../../types';

describe('Legend Component', () => {
  describe('Rendering', () => {
    it('should render legend container with correct role', () => {
      const legends: LegendItem[] = [{ status: 'available' }];
      render(<Legend legends={legends} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('should have correct aria-label', () => {
      const legends: LegendItem[] = [{ status: 'available' }];
      render(<Legend legends={legends} />);
      expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Seat status legend');
    });

    it('should render all legend items', () => {
      const legends: LegendItem[] = [
        { status: 'available' },
        { status: 'booked' },
        { status: 'blocked' },
        { status: 'selected' },
      ];
      render(<Legend legends={legends} />);
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });
  });

  describe('Status labels', () => {
    it('should render "available" status text', () => {
      const legends: LegendItem[] = [{ status: 'available' }];
      render(<Legend legends={legends} />);
      expect(screen.getByText('available')).toBeInTheDocument();
    });

    it('should render "booked" status text', () => {
      const legends: LegendItem[] = [{ status: 'booked' }];
      render(<Legend legends={legends} />);
      expect(screen.getByText('booked')).toBeInTheDocument();
    });

    it('should render "blocked" status text', () => {
      const legends: LegendItem[] = [{ status: 'blocked' }];
      render(<Legend legends={legends} />);
      expect(screen.getByText('blocked')).toBeInTheDocument();
    });

    it('should render "selected" status text', () => {
      const legends: LegendItem[] = [{ status: 'selected' }];
      render(<Legend legends={legends} />);
      expect(screen.getByText('selected')).toBeInTheDocument();
    });
  });

  describe('Seat type variations', () => {
    it('should render seat type by default', () => {
      const legends: LegendItem[] = [{ status: 'available' }];
      const { container } = render(<Legend legends={legends} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render berth type when specified', () => {
      const legends: LegendItem[] = [{ status: 'available', type: 'berth' }];
      const { container } = render(<Legend legends={legends} />);
      const button = container.querySelector('button');
      // Berth has h-[5.5rem] which is different from seat size
      expect(button?.className).toContain('h-[5.5rem]');
    });

    it('should render mixed types', () => {
      const legends: LegendItem[] = [
        { status: 'available', type: 'seat' },
        { status: 'available', type: 'berth' },
      ];
      const { container } = render(<Legend legends={legends} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(2);
    });
  });

  describe('Selected status handling', () => {
    it('should show selected button with blue fill for "selected" status', () => {
      const legends: LegendItem[] = [{ status: 'selected' }];
      const { container } = render(<Legend legends={legends} />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-blue-500');
    });

    it('should show available styles (green) for available status', () => {
      const legends: LegendItem[] = [{ status: 'available' }];
      const { container } = render(<Legend legends={legends} />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-green-500');
    });
  });

  describe('Decorative mode', () => {
    it('should render legend seat buttons as decorative (no gridcell role)', () => {
      const legends: LegendItem[] = [{ status: 'available' }, { status: 'booked' }];
      render(<Legend legends={legends} />);
      expect(screen.queryAllByRole('gridcell')).toHaveLength(0);
    });

    it('should have aria-hidden wrapper for decorative buttons', () => {
      const legends: LegendItem[] = [{ status: 'available' }];
      const { container } = render(<Legend legends={legends} />);
      const ariaHiddenDivs = container.querySelectorAll('[aria-hidden="true"]');
      expect(ariaHiddenDivs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Disabled state', () => {
    it('should render all legend seat buttons as disabled', () => {
      const legends: LegendItem[] = [{ status: 'available' }, { status: 'booked' }];
      const { container } = render(<Legend legends={legends} />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('Empty legends', () => {
    it('should render empty container for empty legends array', () => {
      render(<Legend legends={[]} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    });
  });

  describe('Legend row layout', () => {
    it('should display seat button and status text side by side', () => {
      const legends: LegendItem[] = [{ status: 'available' }];
      render(<Legend legends={legends} />);
      const listitem = screen.getByRole('listitem');

      expect(listitem.querySelector('button')).toBeInTheDocument();
      expect(listitem).toHaveTextContent('available');
    });
  });

  describe('Accessibility', () => {
    it('should have proper list structure', () => {
      const legends: LegendItem[] = [{ status: 'available' }, { status: 'booked' }];
      render(<Legend legends={legends} />);

      const list = screen.getByRole('list');
      const items = screen.getAllByRole('listitem');

      expect(list).toBeInTheDocument();
      expect(items).toHaveLength(2);
      items.forEach((item) => {
        expect(list).toContainElement(item);
      });
    });

    it('should have explicit text color for legend labels', () => {
      const legends: LegendItem[] = [{ status: 'available' }];
      const { container } = render(<Legend legends={legends} />);
      const textEl = container.querySelector('.text-xs.capitalize');
      expect(textEl?.className).toContain('text-gray-700');
      expect(textEl?.className).toContain('dark:text-gray-300');
    });
  });
});
