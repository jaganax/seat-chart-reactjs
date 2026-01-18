import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LayoutCell } from './index';

describe('LayoutCell Component', () => {
  describe('Driver type', () => {
    it('should render driver layout cell', () => {
      render(<LayoutCell type="driver" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toBeInTheDocument();
    });

    it('should have correct aria-label for driver', () => {
      render(<LayoutCell type="driver" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('aria-label', 'Driver position');
    });

    it('should render DriverIcon SVG', () => {
      const { container } = render(<LayoutCell type="driver" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have correct size class', () => {
      const { container } = render(<LayoutCell type="driver" />);
      const cell = container.querySelector('[role="gridcell"]');
      expect(cell?.className).toContain('size-8');
    });
  });

  describe('Door type', () => {
    it('should render door layout cell', () => {
      render(<LayoutCell type="door" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toBeInTheDocument();
    });

    it('should have correct aria-label for door', () => {
      render(<LayoutCell type="door" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('aria-label', 'Door');
    });

    it('should render DoorIcon SVG', () => {
      const { container } = render(<LayoutCell type="door" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have correct size class', () => {
      const { container } = render(<LayoutCell type="door" />);
      const cell = container.querySelector('[role="gridcell"]');
      expect(cell?.className).toContain('size-8');
    });
  });

  describe('Space type', () => {
    it('should render space layout cell', () => {
      render(<LayoutCell type="space" />);
      const cell = screen.getByRole('gridcell', { hidden: true });
      expect(cell).toBeInTheDocument();
    });

    it('should have aria-hidden for space', () => {
      render(<LayoutCell type="space" />);
      const cell = screen.getByRole('gridcell', { hidden: true });
      expect(cell).toHaveAttribute('aria-hidden', 'true');
    });

    it('should not render any icon for space', () => {
      const { container } = render(<LayoutCell type="space" />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('should have correct size class', () => {
      const { container } = render(<LayoutCell type="space" />);
      const cell = container.querySelector('[role="gridcell"]');
      expect(cell?.className).toContain('size-8');
    });
  });

  describe('Styling', () => {
    it('should apply dark mode classes for driver icon', () => {
      const { container } = render(<LayoutCell type="driver" />);
      const svg = container.querySelector('svg');
      // SVG className is an SVGAnimatedString, need to check baseVal or use classList
      expect(svg?.classList.contains('dark:text-white')).toBe(true);
    });

    it('should apply dark mode classes for door icon', () => {
      const { container } = render(<LayoutCell type="door" />);
      const svg = container.querySelector('svg');
      expect(svg?.classList.contains('dark:text-white')).toBe(true);
    });
  });

  describe('Non-interactive nature', () => {
    it('should not have button role', () => {
      render(<LayoutCell type="driver" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should be a div element', () => {
      const { container } = render(<LayoutCell type="driver" />);
      const cell = container.querySelector('[role="gridcell"]');
      expect(cell?.tagName).toBe('DIV');
    });
  });
});
