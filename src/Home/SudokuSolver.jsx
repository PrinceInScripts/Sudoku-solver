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
      <div className="flex flex-col lg:flex-row gap-5 justify-center lg:mt-0 mt-20 mb-20 font-serif font-bold">
      <select
          value={difficulty}
          onChange={handleDifficultyChange}
          className="bg-gray-50 border p-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option className="bg-white text-black " value="easy">Easy</option>
          <option className="bg-white text-black " value="medium">Medium</option>
          <option className="bg-white text-black " value="hard">Hard</option>
          <option className="bg-white text-black " value="random">Random</option>
        </select>
        <button onClick={() => getPuzzle(difficulty)} type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-2xl px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
          Get Puzzle
        </button>
        <button onClick={solvePuzzle} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-2xl px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          Solve Puzzle
        </button>
        <button onClick={solvePuzzleVisualizer} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-2xl px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
          Visualizer Puzzle
        </button>
        <button onClick={checkUserSolution} type="button" class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-2xl px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">
          Check Solution
        </button>
        
      </div>
    </div>
  );
};


export default SudokuSolver;