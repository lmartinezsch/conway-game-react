export const NUM_ROWS = 30;
export const NUM_COLS = 50;
export const CELL_SIZE = 20;

// Genero un tablero vacío (sin células vivas)
export const generateEmptyGrid = (numRows: number, numCols: number) => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};
