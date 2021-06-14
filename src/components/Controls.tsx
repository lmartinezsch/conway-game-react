import React, { useState, useRef, useCallback } from "react";
import produce from "immer";
import { generateEmptyGrid } from "./Utils";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    gridList: {},
  })
);

// Genero las posiciones de los vecinos a verificar
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

interface controlsInterface {
  setGrid: any;
  numCols: number;
  setNumCols: any;
  numRows: number;
  setNumRows: any;
  cellSize: number;
  setCellSize: any;
}

const Controls = (props: controlsInterface) => {
  const classes = useStyles();
  const {
    setGrid,
    numCols,
    setNumCols,
    numRows,
    setNumRows,
    cellSize,
    setCellSize,
  } = props;

  const [running, setRunning] = useState(false);
  const [interval, setInterval] = useState(100);

  const runningRef = useRef(running);
  runningRef.current = running;

  const intervalRef = useRef(interval);
  intervalRef.current = interval;

  const numRowsRef = useRef(numRows);
  numRowsRef.current = numRows;

  const numColsRef = useRef(numCols);
  numColsRef.current = numCols;

  const cellSizeRef = useRef(cellSize);
  cellSizeRef.current = cellSize;

  const produceNewBoard = () => {
    setGrid((g: any) => {
      return produce(g, (gridCopy: any) => {
        // Recorro filas y columnas y reviso celda por celda si tiene vecinos. Según la cantidad de vecinos que tenga la célula muere o vive
        for (let i = 0; i < numRowsRef.current; i++) {
          for (let k = 0; k < numColsRef.current; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (
                newI >= 0 &&
                newI < numRowsRef.current &&
                newK >= 0 &&
                newK < numColsRef.current
              ) {
                neighbors += g[newI][newK];
              }
            });

            // Si tiene menos de dos vecinos o más de tres muere, sino sigue vivo
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    produceNewBoard();

    setTimeout(runSimulation, intervalRef.current);
  }, []);

  const runGame = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
      runSimulation();
    }
  };

  const runGameByStep = () => {
    produceNewBoard();
  };

  const clearGame = () => {
    setGrid(generateEmptyGrid(numRows, numCols));
  };

  const intervalHandler = (e: any) => {
    setInterval(e.target.value);
  };

  const numColsHandler = (e: any) => {
    let value = parseInt(e.target.value);
    setNumCols(value);
    setGrid(generateEmptyGrid(numRows, value));
  };

  const numRowsHandler = (e: any) => {
    let value = parseInt(e.target.value);
    setNumRows(value);
    setGrid(generateEmptyGrid(value, numCols));
  };

  const cellSizeHandler = (e: any) => {
    setCellSize(e.target.value);
  };

  return (
    <>
      <div className="controls">
        <h1>Controles</h1>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={6}>
            <TextField
              id="filled-number"
              type="number"
              label="Intervalo"
              defaultValue={interval}
              onChange={intervalHandler}
            />
            <TextField
              id="filled-number"
              type="number"
              label="Filas"
              defaultValue={numRows}
              onChange={numRowsHandler}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="filled-number"
              type="number"
              label="Tamaño celda"
              defaultValue={cellSize}
              onChange={cellSizeHandler}
            />
            <TextField
              id="filled-number"
              type="number"
              label="Colúmnas"
              defaultValue={numCols}
              onChange={numColsHandler}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={4}>
            <Button variant="contained" color="primary" onClick={runGame}>
              {running ? "Detener" : "Ejecutar"}
            </Button>
          </Grid>

          <Grid item xs={4}>
            <Button variant="contained" color="default" onClick={runGameByStep}>
              Por paso
            </Button>
          </Grid>

          <Grid item xs={4}>
            <Button variant="contained" color="secondary" onClick={clearGame}>
              Borrar
            </Button>
          </Grid>
        </Grid>
        <br />
      </div>
    </>
  );
};

export default Controls;
