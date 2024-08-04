
export const isValid = (board, i, j, num) => {
    const n = 9;
    for (let x = 0; x < n; x++) {
      if (board[i][x] === num || board[x][j] === num) {
        return false;
      }
    }
  
    const rn = Math.sqrt(n);
    const si = i - (i % rn);
    const sj = j - (j % rn);
  
    for (let x = si; x < si + rn; x++) {
      for (let y = sj; y < sj + rn; y++) {
        if (board[x][y] === num) {
          return false;
        }
      }
    }
  
    return true;
  };
  
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  export const SudokuSolVisualizer = async (board, i, j, updateBoard) => {
    const n = 9;
    if (i === n) {
      return true;
    }
  
    if (j === n) {
      return await SudokuSolVisualizer(board, i + 1, 0, updateBoard);
    }
  
    if (board[i][j] !== 0) {
      return await SudokuSolVisualizer(board, i, j + 1, updateBoard);
    }
  
    for (let num = 1; num <= 9; num++) {
      if (isValid(board, i, j, num)) {
        board[i][j] = num;
        updateBoard(board.map(row => [...row])); // Create a new array to trigger re-render
        await sleep(100); // Delay to visualize the process
  
        if (await SudokuSolVisualizer(board, i, j + 1, updateBoard)) {
          return true;
        }
        board[i][j] = 0;
        updateBoard(board.map(row => [...row])); // Create a new array to trigger re-render
        await sleep(100); // Delay to visualize the process
      }
    }
    return false;
  };