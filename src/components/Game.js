import React, { useState, useEffect } from "react";
import Board from "./Board";

function Game() {
  const [row, setRow] = useState(10);
  const [col, setCol] = useState(10);
  const [isNext, setIsNext] = useState(true);
  const [history, setHistory] = useState([
    {
      squares: Array(row)
        .fill()
        .map(() => Array(col).fill(0)),
      x: null,
      y: null,
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [moves, setMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [ascending, setAscending] = useState(false);
  const [winnerCells, setWinnerCells] = useState([]);
  const [sq, setSq] = useState(history[stepNumber].squares);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cntCell, setCntCell] = useState(0);

  const [_row, set_row] = useState(null);
  const [_col, set_col] = useState(null);

  const handleOnClick = (x, y) => {
    if (winner) return;
    if (!isPlaying) setIsPlaying(true);

    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = JSON.parse(JSON.stringify(current.squares));

    if (squares[x][y] !== 0) return;

    setCntCell(cntCell + 1);
    squares[x][y] = isNext ? "X" : "O";
    const _winnerCells = checkWinner(x, y, squares[x][y]);
    if (_winnerCells) {
      setWinnerCells(_winnerCells);
      setWinner(squares[x][y]);
    }

    const _history = newHistory.concat([
      {
        squares,
        x,
        y,
      },
    ]);

    setSq(squares);

    setHistory(_history);
    setStepNumber(stepNumber + 1);
    setIsNext(!isNext);
  };

  const jumpTo = (move) => {
    setSq(history[move].squares);
    setStepNumber(move);
    setIsNext(move % 2 === 0);
  };

  const reStart = (move) => {
    setSq(history[move].squares);
    setStepNumber(move);
    setIsNext(move % 2 === 0);
    setWinnerCells([]);
  };

  useEffect(() => {
    const _moves = history.map((step, move) => {
      if (ascending) {
        move = history.length - 1 - move;
      }

      const desc = move
        ? `Go to move #${move}: (${history[move].x}, ${history[move].y})`
        : "Go to game start";
      if (move === stepNumber) {
        if (!move) {
          return (
            <li key={move}>
              <button onClick={() => reStart(move)}>
                <b> {desc} </b>
              </button>
            </li>
          );
        }
        return (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>
              <b> {desc} </b>
            </button>
          </li>
        );
      }
      if (!move) {
        return (
          <li key={move} className="list-none">
            <button onClick={() => reStart(move)}>{desc}</button>
          </li>
        );
      }
      return (
        <li key={move} className="list-none">
          <button onClick={() => jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    //   .slice(0, stepNumber + 1);

    setMoves(_moves);
  }, [stepNumber, ascending]);

  const status =
    cntCell === col * row
      ? "Both draw"
      : winner
      ? "Winner: " + winner
      : "Next player: " + (isNext ? "X" : "O");

  const toggle = () => {
    setAscending(!ascending);
  };

  const onHandleChangeRow = (e) => {
    const { value } = e.target;
    set_row(value);
  };

  const onHandleChangeCol = (e) => {
    const { value } = e.target;
    set_col(value);
  };

  const onAccept = () => {
    if (isPlaying) return;

    setRow(parseInt(_row));
    setCol(parseInt(_col));

    const _history = [
      {
        squares: Array(parseInt(_row))
          .fill()
          .map(() => Array(parseInt(_col)).fill(0)),
        x: null,
        y: null,
      },
    ];

    setSq(_history[0].squares);
    setHistory(_history);
    set_col(null);
    set_row(null);
  };

  const checkWinner = (x, y, currentVal) => {
    const current = history[stepNumber];
    const squares = current.squares.slice();
    console.log("quares", squares);
    let winCells = [];

    let coorX = x;
    let coorY = y;
    winCells.push([x, y]);

    //check on col
    let cntInCol = 1;
    coorX = x - 1;
    while (coorX >= 0 && squares[coorX][coorY] === currentVal) {
      winCells.push([coorX, coorY]);
      cntInCol++;
      coorX--;
    }

    coorX = x + 1;
    while (coorX < row && squares[coorX][coorY] === currentVal) {
      winCells.push([coorX, coorY]);
      cntInCol++;
      coorX++;
    }
    if (cntInCol >= 5) {
      return winCells;
    }

    //check on row
    winCells = [];
    winCells.push([x, y]);
    let cntInRow = 1;
    coorX = x;
    coorY = y - 1;
    while (coorY >= 0 && squares[coorX][coorY] === currentVal) {
      winCells.push([coorX, coorY]);
      cntInRow++;
      coorY--;
    }

    coorY = y + 1;
    while (coorX < col && squares[coorX][coorY] === currentVal) {
      winCells.push([coorX, coorY]);
      cntInRow++;
      coorY++;
    }
    if (cntInRow >= 5) {
      return winCells;
    }

    //check main diagonal
    winCells = [];
    winCells.push([x, y]);
    let cntMainDiagonal = 1;
    coorY = y - 1;
    coorX = x - 1;
    while (coorY >= 0 && coorX >= 0 && squares[coorX][coorY] === currentVal) {
      winCells.push([coorX, coorY]);
      cntMainDiagonal++;
      coorY--;
      coorX--;
    }

    coorX = x + 1;
    coorY = y + 1;
    while (coorX < row && coorY < col && squares[coorX][coorY] === currentVal) {
      cntMainDiagonal++;
      winCells.push([coorX, coorY]);
      coorX++;
      coorY++;
    }
    if (cntMainDiagonal >= 5) {
      return winCells;
    }

    //check skew diagonal
    winCells = [];
    winCells.push([x, y]);
    let cntSkewDiagonal = 1;
    coorX = x - 1;
    coorY = y + 1;
    while (coorY < col && coorX >= 0 && squares[coorX][coorY] === currentVal) {
      cntSkewDiagonal++;
      winCells.push([coorX, coorY]);
      coorY++;
      coorX--;
    }

    coorX = x + 1;
    coorY = y - 1;
    while (coorX < row && coorY >= 0 && squares[coorX][coorY] === currentVal) {
      cntSkewDiagonal++;
      winCells.push([coorX, coorY]);
      coorX++;
      coorY--;
    }
    if (cntSkewDiagonal >= 5) {
      return winCells;
    }

    return false;
  };

  return (
    <div className="flex">
      <Board
        square={sq}
        winnerCells={winnerCells}
        row={row}
        col={col}
        onClick={(x, y) => {
          handleOnClick(x, y);
        }}
      />

      <div className="pt-10 flex">
        <div className="flex flex-col mr-16">
          <p>Input row and column if you want to change</p>
          {isPlaying ? (
            <input
              placeholder="Input row"
              value={_row ? _row : ""}
              name="row"
              disabled
              onChange={onHandleChangeRow}
              className="w-full h-[37px] text-sm focus:border-orange focus:border focus:bg-white transition duration-50 rounded-lg bg-[#F1F1F2] outline-none mb-2 mt-2 pl-2"
            ></input>
          ) : (
            <input
              placeholder="Input row"
              value={_row ? _row : ""}
              name="row"
              onChange={onHandleChangeRow}
              className="w-full h-[37px] text-sm focus:border-orange focus:border focus:bg-white transition duration-50 rounded-lg bg-[#F1F1F2] outline-none mb-2 mt-2 pl-2"
            ></input>
          )}
          {isPlaying ? (
            <input
              placeholder="Input column"
              value={_col ? _col : ""}
              name="col"
              disabled
              onChange={onHandleChangeCol}
              className="w-full h-[37px] text-sm focus:border-orange focus:border focus:bg-white transition duration-50 rounded-lg bg-[#F1F1F2] outline-none mb-2 pl-2"
            ></input>
          ) : (
            <input
              placeholder="Input column"
              value={_col ? _col : ""}
              name="col"
              onChange={onHandleChangeCol}
              className="w-full h-[37px] text-sm focus:border-orange focus:border focus:bg-white transition duration-50 rounded-lg bg-[#F1F1F2] outline-none mb-2 pl-2"
            ></input>
          )}

          <button
            onClick={onAccept}
            className="text-sm pl-8 h-10 pr-8 pt-2 pb-2 mb-2 rounded-full bg-[#F1F1F2] shadow-lg hover:bg-gray-300 transition duration-200"
          >
            Confirm
          </button>

          <button
            onClick={toggle}
            className="text-sm pl-8 h-10 pr-8 pt-2 pb-2 mb-4 rounded-full bg-[#F1F1F2] shadow-lg hover:bg-gray-300 transition duration-200"
          >
            {ascending ? "Ascending" : "Descending"}
          </button>
        </div>
        <div className="h-screen">
          <div className="flex flex-col h-5/6 w-52 ">
            <p className="text-lg mt-2 mb-2 font-bold">{status}</p>
            <div>{moves}</div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Game;
