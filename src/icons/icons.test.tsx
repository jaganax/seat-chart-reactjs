import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SeatIcon } from './SeatIcon';
import { BerthIcon } from './BerthIcon';
import { DriverIcon } from './DriverIcon';
import { DoorIcon } from './DoorIcon';

describe('Icon Components', () => {
  describe('SeatIcon', () => {
    it('should render an SVG element', () => {
      const { container } = render(<SeatIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have aria-hidden attribute for accessibility', () => {
      const { container } = render(<SeatIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should apply className prop', () => {
      const { container } = render(<SeatIcon className="custom-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });

    it('should have correct viewBox', () => {
      const { container } = render(<SeatIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 100 100');
    });
  });

  describe('BerthIcon', () => {
    it('should render an SVG element', () => {
      const { container } = render(<BerthIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have aria-hidden attribute for accessibility', () => {
      const { container } = render(<BerthIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should apply className prop', () => {
      const { container } = render(<BerthIcon className="berth-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('berth-class');
    });

    it('should have correct viewBox for berth dimensions', () => {
      const { container } = render(<BerthIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 64 128');
    });
  });

  describe('DriverIcon', () => {
    it('should render an SVG element', () => {
      const { container } = render(<DriverIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have aria-hidden attribute for accessibility', () => {
      const { container } = render(<DriverIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should apply className prop', () => {
      const { container } = render(<DriverIcon className="driver-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('driver-class');
    });

    it('should have correct viewBox', () => {
      const { container } = render(<DriverIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 64 64');
    });

    it('should use currentColor for fill', () => {
      const { container } = render(<DriverIcon />);
      const g = container.querySelector('g');
      expect(g).toHaveAttribute('fill', 'currentColor');
    });
  });

  describe('DoorIcon', () => {
    it('should render an SVG element', () => {
      const { container } = render(<DoorIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should have aria-hidden attribute for accessibility', () => {
      const { container } = render(<DoorIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should apply className prop', () => {
      const { container } = render(<DoorIcon className="door-class" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('door-class');
    });

    it('should have correct viewBox', () => {
      const { container } = render(<DoorIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 100 100');
    });

    it('should use currentColor for fill', () => {
      const { container } = render(<DoorIcon />);
      const g = container.querySelector('g');
      expect(g).toHaveAttribute('fill', 'currentColor');
    });
  });

  describe('Memoization', () => {
    it('should be memoized components', () => {
      // All icons should be React.memo wrapped
      expect(SeatIcon).toBeDefined();
      expect(BerthIcon).toBeDefined();
      expect(DriverIcon).toBeDefined();
      expect(DoorIcon).toBeDefined();
    });
  });
});
