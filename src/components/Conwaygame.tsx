import React, { useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import produce from "immer";
import { NUM_COLS, NUM_ROWS, generateEmptyGrid, CELL_SIZE } from "./Utils";
import Controls from "./Controls";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      backgroundColor: "#e0e0e1",
    },
    root: {
      flexGrow: 1,
      marginTop: "15px",
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
    gridBoard: {
      background: "#ffffff",
    },
    controls: {
      background: "#D4F5F5",
    },
  })
);

const ConwayGame = () => {
  const classes = useStyles();
  const [numCols, setNumCols] = useState(NUM_COLS);
  const [numRows, setNumRows] = useState(NUM_ROWS);
  const [cellSize, setCellSize] = useState(CELL_SIZE);
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid(numRows, numCols);
  });

  // Guardo la posición donde se hizo click en el tablero
  const handleClick = (i: any, k: any) => {
    const newGrid = produce(grid, (gridCopy) => {
      gridCopy[i][k] = grid[i][k] ? 0 : 1;
    });
    setGrid(newGrid);
  };

  const GridBoard = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => handleClick(i, k)}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: grid[i][k] ? "black" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={9} className={classes.gridBoard}>
          <GridBoard />
        </Grid>
        <Grid item xs={3} className={classes.controls}>
          <Controls
            setGrid={setGrid}
            numCols={numCols}
            setNumCols={setNumCols}
            numRows={numRows}
            setNumRows={setNumRows}
            cellSize={cellSize}
            setCellSize={setCellSize}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ConwayGame;
