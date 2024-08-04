import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cell from './Components/Cell';

const SudokuSolver = () => {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));

  const fillBoard = (board) => {
    const newBoard = board.map((row, i) =>
      row.map((cell, j) => {
        return { id: i * 9 + j, value: cell };
      })
    );
    setBoard(newBoard);
  };

  useEffect(() => {
    getPuzzle();
  }, []);

  const getPuzzle = async () => {
    try {
      const response = await axios.get('https://sugoku.onrender.com/board?difficulty=easy');
      fillBoard(response.data.board);
    } catch (error) {
      console.error('Error fetching puzzle:', error);
    }
  };

  const handleChange = (value, id) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const row = Math.floor(id / 9);
    const col = id % 9;
    newBoard[row][col].value = value ? parseInt(value, 10) : 0;
    setBoard(newBoard);
  };

  const solvePuzzle = () => {
    // Sudoku solver logic here
  };

  return (
    <div className="flex flex-col items-center h-screen w-screen mt-10">
      <div className="grid grid-cols-9 gap-1 mb-10">
        {board.map((row) =>
          row.map((cell) => (
            <Cell key={cell.id} id={cell.id} value={cell.value} onChange={handleChange} />
          ))
        )}
      </div>
      <div className="flex justify-center mb-20">
        <button onClick={getPuzzle} className="btn-blue mx-2">Get Puzzle</button>
        <button onClick={solvePuzzle} className="btn-blue mx-2">Solve Puzzle</button>
      </div>
    </div>
  );
};

const getBoxClass = (id) => {
  const boxColors = [
    'bg-blue-200', 'bg-blue-300', 'bg-blue-400',
    'bg-orange-200', 'bg-orange-300', 'bg-orange-400',
    'bg-green-200', 'bg-green-300', 'bg-green-400',
  ];

  const row = Math.floor(id / 9);
  const col = id % 9;
  const blockIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

  return `${boxColors[blockIndex]} ${getBorderClass(id)}`;
};

const getBorderClass = (id) => {
  let borderClass = '';
  if (id % 9 === 0) borderClass += ' border-l-4';
  if (id % 3 === 2) borderClass += ' border-r-4';
  if (Math.floor(id / 9) % 3 === 2) borderClass += ' border-b-4';
  if (id < 9) borderClass += ' border-t-4';
  return borderClass;
};

export default SudokuSolver;