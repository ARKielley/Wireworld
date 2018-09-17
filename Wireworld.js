class Wireworld {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.board = this.makeBoard();
    this.gameInterval = null;
    this.undo = [];
  }
  // LEGEND:
  // 0: empty, 1: conductor, 2: electron head, 3: electron tail

  forEachCell(callback, ...args) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        callback(y, x, ...args);
      }
    }
  }

  makeBoard() {
    let newBoard = [];
    for (let h = 0; h < this.height; h++) {
      newBoard.push(new Array(this.width).fill(0));
    }
    return newBoard;
  }

  cellExists(y, x) {
    if (this.board[y] && this.board[y][x] !== undefined) return true;
    else return false;
  }

  cellStatus(y, x) {
    if (this.cellExists(y, x)) return this.board[y][x];

    return null;
  }

  getHeadNeighbors(y, x) {
    const mooreNeighborhood = [
      [-1, -1], [-1, 0], [-1, 1],
       [0, -1],           [0, 1],
       [1, -1],  [1, 0],  [1, 1]
    ]
    if (this.cellExists(y, x)) {
      return mooreNeighborhood.reduce((count, cell) => {
        const currCoords = [y + cell[0], x + cell[1]];
        if (this.cellExists(...currCoords) && this.cellStatus(...currCoords) === 1) {
          return count + 1;
        } else {
          return count;
        }
      }, 0);
    }

    return null;
  }

  getNewStatus(y, x) {
    const headNeighbors = this.getHeadNeighbors(y, x);

    switch (this.cellStatus(y, x)) {
      case 0:
          return 0;
      case 1:
          return 2;
      case 2:
          return 3;
      case 3:
          if (headNeighbors > 0 && headNeighbors < 3) return 1;
          else return 3;
      default:
          return null;
    }
  }

  setCell(y, x, value) {
    if (this.cellExists(y, x)) this.board[y][x] = value;
  }

  tick() {
    const newBoard = this.makeBoard(this.height, this.width);
    this.forEachCell((y, x) => {
      newBoard[y][x] = this.getNewStatus(y, x);
    });

    this.addUndo();
    this.board = newBoard;
  }

  play(speed) {
    clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => {
      this.tick();
      paint();
    }, speed);
  }

  stop() {
    clearInterval(this.gameInterval);
    this.gameInterval = null;
  }

  copyCells() {
    return this.board.map(row => row.map(cell => cell));
  }

  useUndo() {
    if (this.undo.length > 1) {
      this.board = this.undo.pop();
    } else if (this.undo.length === 1) {
      this.board = this.undo[0];
      this.undo = [];
    } else {
      document.getElementById('undo_btn').disabled = true;
      // in case of weird errors
      this.undo = [];
    }
  }

  addUndo() {
    this.undo.push(this.board.map(row => row.map(cell => cell)));
    document.getElementById('undo_btn').disabled = false;
  }
}
