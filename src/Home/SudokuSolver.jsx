import React, { useEffect, useState } from "react";
import axios from "axios";
import Cell from "../Components/Cell";
import { isValid, SudokuSol } from "./solver";
import { SudokuSolVisualizer } from "./solverVisulize";
import { toast } from "react-toastify";

const SudokuSolver = () => {
  const [board, setBoard] = useState(
    Array(9)
      .fill()
      .map(() => Array(9).fill({ value: 0, isInitial: false }))
  );

  const [difficulty, setDifficulty] = useState("easy");

  const fillBoard = (board) => {
    const newBoard = board.map((row, i) =>
      row.map((cell, j) => {
        return { id: i * 9 + j, value: cell, isInitial: cell !== 0 };
      })
    );
    setBoard(newBoard);
  };

  useEffect(() => {
    getPuzzle("easy");
  }, []);

  const getPuzzle = async (difficulty) => {
    try {
      const response = await axios.get(
        `https://sugoku.onrender.com/board?difficulty=${difficulty}`
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
      toast.success("Puzzle solved successfully!");
    } else {
      toast.error("No solution found");
    }
  };

  const solvePuzzleVisualizer = async () => {
    const currentBoard = board.map(row => row.map(cell => cell.value));
    if (await SudokuSolVisualizer(currentBoard, 0, 0, (newBoard) => setBoard(newBoard.map((row, i) => row.map((value, j) => ({ id: i * 9 + j, value, isInitial: board[i][j].isInitial })))))) {
      fillBoard(currentBoard);
      toast.success("Puzzle solved successfully!");
    } else {
      toast.error("No solution found");
    }
  };

  const isValidSudoku = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const num = board[i][j].value;
        if (num !== 0) {
          board[i][j].value = 0;
          if (!isValid(board.map((row) => row.map((cell) => cell.value)), i, j, num)) {
            board[i][j].value = num;
            return false;
          }
          board[i][j].value = num;
        }
      }
    }
    return true;
  };

  const checkUserSolution = () => {
    for (const row of board) {
      for (const cell of row) {
        if (cell.value === 0) {
          toast.error("Please fill all cells before checking the solution.");
          return;
        }
      }
    }

    if (isValidSudoku(board)) {
      toast.success("Congratulations! The Sudoku solution is correct.");
    } else {
      toast.error("The Sudoku solution is incorrect. Please try again.");
    } 
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
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
      <div className="flex justify-center mb-20 font-serif font-bold">
      <select
          value={difficulty}
          onChange={handleDifficultyChange}
          className="btn-blue mx-4"
        >
          <option className="bg-white text-black " value="easy">Easy</option>
          <option className="bg-white text-black " value="medium">Medium</option>
          <option className="bg-white text-black " value="hard">Hard</option>
          <option className="bg-white text-black " value="random">Random</option>
        </select>
        <button onClick={() => getPuzzle(difficulty)} className="btn-blue mx-2">
          Get Puzzle
        </button>
        <button onClick={solvePuzzle} className="btn-blue mx-2">
          Solve Puzzle
        </button>
        <button onClick={solvePuzzleVisualizer} className="btn-blue mx-2">
          Visualizer Puzzle
        </button>
        <button onClick={checkUserSolution} className="btn-blue mx-2">
          Check Solution
        </button>
        
      </div>
    </div>
  );
};


export default SudokuSolver;