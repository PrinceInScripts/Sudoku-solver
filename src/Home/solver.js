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
  
  export const SudokuSol = (board, i, j) => {
    const n = 9;
    if (i === n) {
      return true;
    }
  
    if (j === n) {
      return SudokuSol(board, i + 1, 0);
    }
  
    if (board[i][j] !== 0) {
      return SudokuSol(board, i, j + 1);
    }
  
    for (let num = 1; num <= 9; num++) {
      if (isValid(board, i, j, num)) {
        board[i][j] = num;
        if (SudokuSol(board, i, j + 1)) {
          return true;
        }
        board[i][j] = 0;
      }
    }
    return false;
  };