import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useGridNavigation } from './useGridNavigation';

function TestGrid({ disabledIndices = [] as number[] }) {
  const { gridRef, handleGridKeyDown } = useGridNavigation();

  return (
    <div ref={gridRef} role="grid" tabIndex={-1} onKeyDown={handleGridKeyDown}>
      <div role="row">
        <div role="gridcell">
          <button disabled={disabledIndices.includes(0)}>1</button>
        </div>
        <div role="gridcell">
          <button disabled={disabledIndices.includes(1)}>2</button>
        </div>
      </div>
      <div role="row">
        <div role="gridcell">
          <button disabled={disabledIndices.includes(2)}>3</button>
        </div>
        <div role="gridcell">
          <button disabled={disabledIndices.includes(3)}>4</button>
        </div>
      </div>
    </div>
  );
}

function TestGridWithLayoutCells() {
  const { gridRef, handleGridKeyDown } = useGridNavigation();

  return (
    <div ref={gridRef} role="grid" tabIndex={-1} onKeyDown={handleGridKeyDown}>
      <div role="row">
        <div role="gridcell" tabIndex={-1} aria-label="Empty">
          {/* Layout cell — no button inside, gridcell itself is focusable */}
        </div>
        <div role="gridcell">
          <button>1</button>
        </div>
      </div>
    </div>
  );
}

describe('useGridNavigation', () => {
  it('should move focus right with ArrowRight', () => {
    render(<TestGrid />);
    const buttons = screen.getAllByRole('button');

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('should move focus left with ArrowLeft', () => {
    render(<TestGrid />);
    const buttons = screen.getAllByRole('button');

    buttons[1].focus();
    fireEvent.keyDown(buttons[1], { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('should not move past first cell with ArrowLeft', () => {
    render(<TestGrid />);
    const buttons = screen.getAllByRole('button');

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('should not move past last cell with ArrowRight', () => {
    render(<TestGrid />);
    const buttons = screen.getAllByRole('button');

    buttons[3].focus();
    fireEvent.keyDown(buttons[3], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[3]);
  });

  it('should navigate to all gridcells including those with disabled buttons', () => {
    render(<TestGrid disabledIndices={[1]} />);
    const buttons = screen.getAllByRole('button');

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowRight' });
    // Should navigate to the gridcell with the disabled button
    // The focus goes to the button inside the gridcell (even if disabled, it's still navigable)
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('should not move on non-arrow keys', () => {
    render(<TestGrid />);
    const buttons = screen.getAllByRole('button');

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'Tab' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('should move focus down with ArrowDown using spatial position', () => {
    render(<TestGrid />);
    const buttons = screen.getAllByRole('button');

    // Mock getBoundingClientRect on the buttons (focusable elements inside gridcells)
    vi.spyOn(buttons[0], 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
      width: 32,
      height: 32,
      bottom: 32,
      right: 32,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    vi.spyOn(buttons[1], 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 40,
      width: 32,
      height: 32,
      bottom: 32,
      right: 72,
      x: 40,
      y: 0,
      toJSON: () => {},
    });
    vi.spyOn(buttons[2], 'getBoundingClientRect').mockReturnValue({
      top: 40,
      left: 0,
      width: 32,
      height: 32,
      bottom: 72,
      right: 32,
      x: 0,
      y: 40,
      toJSON: () => {},
    });
    vi.spyOn(buttons[3], 'getBoundingClientRect').mockReturnValue({
      top: 40,
      left: 40,
      width: 32,
      height: 32,
      bottom: 72,
      right: 72,
      x: 40,
      y: 40,
      toJSON: () => {},
    });

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(buttons[2]);
  });

  it('should move focus up with ArrowUp using spatial position', () => {
    render(<TestGrid />);
    const buttons = screen.getAllByRole('button');

    vi.spyOn(buttons[0], 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
      width: 32,
      height: 32,
      bottom: 32,
      right: 32,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    vi.spyOn(buttons[1], 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 40,
      width: 32,
      height: 32,
      bottom: 32,
      right: 72,
      x: 40,
      y: 0,
      toJSON: () => {},
    });
    vi.spyOn(buttons[2], 'getBoundingClientRect').mockReturnValue({
      top: 40,
      left: 0,
      width: 32,
      height: 32,
      bottom: 72,
      right: 32,
      x: 0,
      y: 40,
      toJSON: () => {},
    });
    vi.spyOn(buttons[3], 'getBoundingClientRect').mockReturnValue({
      top: 40,
      left: 40,
      width: 32,
      height: 32,
      bottom: 72,
      right: 72,
      x: 40,
      y: 40,
      toJSON: () => {},
    });

    buttons[3].focus();
    fireEvent.keyDown(buttons[3], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('should not move up from top row', () => {
    render(<TestGrid />);
    const buttons = screen.getAllByRole('button');

    vi.spyOn(buttons[0], 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
      width: 32,
      height: 32,
      bottom: 32,
      right: 32,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    vi.spyOn(buttons[1], 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 40,
      width: 32,
      height: 32,
      bottom: 32,
      right: 72,
      x: 40,
      y: 0,
      toJSON: () => {},
    });
    vi.spyOn(buttons[2], 'getBoundingClientRect').mockReturnValue({
      top: 40,
      left: 0,
      width: 32,
      height: 32,
      bottom: 72,
      right: 32,
      x: 0,
      y: 40,
      toJSON: () => {},
    });
    vi.spyOn(buttons[3], 'getBoundingClientRect').mockReturnValue({
      top: 40,
      left: 40,
      width: 32,
      height: 32,
      bottom: 72,
      right: 72,
      x: 40,
      y: 40,
      toJSON: () => {},
    });

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('should navigate when focus is directly on a gridcell (layout cell without button)', () => {
    render(<TestGridWithLayoutCells />);
    const gridcells = screen.getAllByRole('gridcell');
    const layoutCell = gridcells[0]; // No button inside
    const button = screen.getByRole('button'); // Button in second gridcell

    // Focus the layout cell directly (it has role="gridcell")
    layoutCell.focus();
    expect(document.activeElement).toBe(layoutCell);

    fireEvent.keyDown(layoutCell, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(button);
  });

  it('should implement roving tabindex on arrow navigation', () => {
    render(<TestGrid />);
    const buttons = screen.getAllByRole('button');

    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowRight' });

    // Old cell should have tabIndex -1, new cell should have tabIndex 0
    expect(buttons[0]).toHaveAttribute('tabindex', '-1');
    expect(buttons[1]).toHaveAttribute('tabindex', '0');
  });
});
