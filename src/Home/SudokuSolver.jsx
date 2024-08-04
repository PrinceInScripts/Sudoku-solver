import React, { useEffect, useState } from "react";
import axios from "axios";
import Cell from "../Components/Cell";
import { SudokuSol } from "./solver";
import { SudokuSolVisualizer } from "./solverVisulize";

const SudokuSolver = () => {
  const [board, setBoard] = useState(
    Array(9)
      .fill()
      .map(() => Array(9).fill({ value: 0, isInitial: false }))
  );

  const fillBoard = (board) => {
    const newBoard = board.map((row, i) =>
      row.map((cell, j) => {
        return { id: i * 9 + j, value: cell, isInitial: cell !== 0 };
      })
    );
    setBoard(newBoard);
  };

  useEffect(() => {
    getPuzzle();
  }, []);

  const getPuzzle = async () => {
    try {
      const response = await axios.get(
        "https://sugoku.onrender.com/board?difficulty=easy"
      );
      fillBoard(response.data.board);
    } catch (error) {
      console.error("Error fetching puzzle:", error);
    }
  };

  const handleChange = (value, id) => {
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const row = Math.floor(id / 9);
    const col = id % 9;
    newBoard[row][col].value = value ? parseInt(value, 10) : 0;
    setBoard(newBoard);
  };

  const solvePuzzle = () => {
    const currentBoard = board.map(row => row.map(cell => cell.value));
    if (SudokuSol(currentBoard, 0, 0)) {
      fillBoard(currentBoard);
    } else {
      alert("No solution found");
    }
  };

  const solvePuzzleVisualizer = async () => {
    const currentBoard = board.map(row => row.map(cell => cell.value));
    if (await SudokuSolVisualizer(currentBoard, 0, 0, (newBoard) => setBoard(newBoard.map((row, i) => row.map((value, j) => ({ id: i * 9 + j, value, isInitial: board[i][j].isInitial })))))) {
      fillBoard(currentBoard);
    } else {
      alert("No solution found");
    }
  };

  return (
    <div className="flex flex-col items-center h-screen w-screen mt-10">
      <div className="grid grid-cols-9 gap-1 mb-10">
        {board.map((row) =>
          row.map((cell) => (
            <Cell
              key={cell.id}
              id={cell.id}
              value={cell.value}
              isInitial={cell.isInitial}
              onChange={handleChange}
            />
          ))
        )}
      </div>
      <div className="flex justify-center mb-20">
        <button onClick={getPuzzle} className="btn-blue mx-2">
          Get Puzzle
        </button>
        <button onClick={solvePuzzle} className="btn-blue mx-2">
          Solve Puzzle
        </button>
        <button onClick={solvePuzzleVisualizer} className="btn-blue mx-2">
          Visualizer Puzzle
        </button>
      </div>
    </div>
  );
};


export default SudokuSolver;