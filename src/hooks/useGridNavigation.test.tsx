import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useGridNavigation } from './useGridNavigation';

function TestGrid({ disabledIndices = [] as number[] }) {
  const { gridRef, handleGridKeyDown } = useGridNavigation();

  return (
    <div ref={gridRef} role="grid" tabIndex={-1} onKeyDown={handleGridKeyDown}>
      <div role="row">
        <button role="gridcell" disabled={disabledIndices.includes(0)}>1</button>
        <button role="gridcell" disabled={disabledIndices.includes(1)}>2</button>
      </div>
      <div role="row">
        <button role="gridcell" disabled={disabledIndices.includes(2)}>3</button>
        <button role="gridcell" disabled={disabledIndices.includes(3)}>4</button>
      </div>
    </div>
  );
}

describe('useGridNavigation', () => {
  it('should move focus right with ArrowRight', () => {
    render(<TestGrid />);
    const cells = screen.getAllByRole('gridcell');

    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(cells[1]);
  });

  it('should move focus left with ArrowLeft', () => {
    render(<TestGrid />);
    const cells = screen.getAllByRole('gridcell');

    cells[1].focus();
    fireEvent.keyDown(cells[1], { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(cells[0]);
  });

  it('should not move past first cell with ArrowLeft', () => {
    render(<TestGrid />);
    const cells = screen.getAllByRole('gridcell');

    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(cells[0]);
  });

  it('should not move past last cell with ArrowRight', () => {
    render(<TestGrid />);
    const cells = screen.getAllByRole('gridcell');

    cells[3].focus();
    fireEvent.keyDown(cells[3], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(cells[3]);
  });

  it('should skip disabled cells when navigating', () => {
    render(<TestGrid disabledIndices={[1]} />);
    const cells = screen.getAllByRole('gridcell');

    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'ArrowRight' });
    // Should skip disabled cell[1] and go to cell[2]
    expect(document.activeElement).toBe(cells[2]);
  });

  it('should not move on non-arrow keys', () => {
    render(<TestGrid />);
    const cells = screen.getAllByRole('gridcell');

    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'Tab' });
    expect(document.activeElement).toBe(cells[0]);
  });

  it('should move focus down with ArrowDown using spatial position', () => {
    render(<TestGrid />);
    const cells = screen.getAllByRole('gridcell');

    // Mock getBoundingClientRect for spatial navigation
    // Row 1: cells[0] at (0,0), cells[1] at (40,0)
    // Row 2: cells[2] at (0,40), cells[3] at (40,40)
    jest.spyOn(cells[0], 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 0, width: 32, height: 32, bottom: 32, right: 32, x: 0, y: 0, toJSON: () => {},
    });
    jest.spyOn(cells[1], 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 40, width: 32, height: 32, bottom: 32, right: 72, x: 40, y: 0, toJSON: () => {},
    });
    jest.spyOn(cells[2], 'getBoundingClientRect').mockReturnValue({
      top: 40, left: 0, width: 32, height: 32, bottom: 72, right: 32, x: 0, y: 40, toJSON: () => {},
    });
    jest.spyOn(cells[3], 'getBoundingClientRect').mockReturnValue({
      top: 40, left: 40, width: 32, height: 32, bottom: 72, right: 72, x: 40, y: 40, toJSON: () => {},
    });

    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(cells[2]);
  });

  it('should move focus up with ArrowUp using spatial position', () => {
    render(<TestGrid />);
    const cells = screen.getAllByRole('gridcell');

    jest.spyOn(cells[0], 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 0, width: 32, height: 32, bottom: 32, right: 32, x: 0, y: 0, toJSON: () => {},
    });
    jest.spyOn(cells[1], 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 40, width: 32, height: 32, bottom: 32, right: 72, x: 40, y: 0, toJSON: () => {},
    });
    jest.spyOn(cells[2], 'getBoundingClientRect').mockReturnValue({
      top: 40, left: 0, width: 32, height: 32, bottom: 72, right: 32, x: 0, y: 40, toJSON: () => {},
    });
    jest.spyOn(cells[3], 'getBoundingClientRect').mockReturnValue({
      top: 40, left: 40, width: 32, height: 32, bottom: 72, right: 72, x: 40, y: 40, toJSON: () => {},
    });

    cells[3].focus();
    fireEvent.keyDown(cells[3], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(cells[1]);
  });

  it('should not move up from top row', () => {
    render(<TestGrid />);
    const cells = screen.getAllByRole('gridcell');

    jest.spyOn(cells[0], 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 0, width: 32, height: 32, bottom: 32, right: 32, x: 0, y: 0, toJSON: () => {},
    });
    jest.spyOn(cells[1], 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 40, width: 32, height: 32, bottom: 32, right: 72, x: 40, y: 0, toJSON: () => {},
    });
    jest.spyOn(cells[2], 'getBoundingClientRect').mockReturnValue({
      top: 40, left: 0, width: 32, height: 32, bottom: 72, right: 32, x: 0, y: 40, toJSON: () => {},
    });
    jest.spyOn(cells[3], 'getBoundingClientRect').mockReturnValue({
      top: 40, left: 40, width: 32, height: 32, bottom: 72, right: 72, x: 40, y: 40, toJSON: () => {},
    });

    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(cells[0]);
  });
});
