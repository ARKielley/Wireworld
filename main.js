const width = 65;
const height = 40;

const game = new Wireworld(height, width);

const tds = [];

const table = document.createElement('tbody');
// rows
for (let h = 0; h < height; h++) {
  const tr = document.createElement('tr');
  // columns
  for (let w = 0; w < width; w++) {
    const td = document.createElement('td');
    td.dataset.y = h;
    td.dataset.x = w;
    tds.push(td);
    tr.append(td);
  }
  table.append(tr);
}
document.getElementById('board').append(table);

function paint() {
  tds.forEach(cell => {
    switch (game.cellStatus(cell.dataset.y, cell.dataset.x)) {
      case 0:
          cell.className = 'empty';
          break;
      case 1:
          cell.className = 'electron_head';
          break;
      case 2:
          cell.className = 'electron_tail';
          break;
      case 3:
          cell.className = 'conductor';
          break;
      default:
          break;
    }
  });
}

document.getElementById('board').addEventListener('click', event => {
  const cellCoords = event.target.dataset,
  type = document.getElementsByTagName('select')[0].selectedIndex;

  game.addUndo();
  game.setCell(cellCoords.y, cellCoords.x, type);
  paint();
});

document.getElementById('step_btn').addEventListener('click', event => {
  game.tick();
  paint();
});

const speedBar = document.getElementById('speed');

document.getElementById('play_btn').addEventListener('click', event => {
  if (game.gameInterval === null) {
    game.play(2000 / Math.pow(1.5, speedBar.valueAsNumber / 2));
    event.target.innerText = 'Pause';
  }
  else {
    game.stop();
    event.target.innerText = 'Play';
  }
});

speedBar.addEventListener('change', (event) => {
  game.play(2000 / Math.pow(1.5, speedBar.valueAsNumber / 2));
});

document.getElementById('undo_btn').addEventListener('click', event => {
  // This one was annoying to implement...
  game.stop();
  game.useUndo();
  paint();
});

document.getElementById('clear_all_btn').addEventListener('click', event => {
  game.addUndo();
  game.board = game.makeBoard(height, width);
  game.stop();
  paint();
});

document.getElementById('clear_electrons_btn').addEventListener('click', event => {
  game.addUndo();
  game.forEachCell((y, x) => {
    const cell = game.cellStatus(y, x);
    if (cell === 1 || cell === 2) {
      game.setCell(y, x, 3);
      paint();
    }
  });
});

// TODO: add file input/output functionality
// option to crop out unnecessary blank space in output
// management of inputs being differently-sized relative to the board
//   startY and startX top left corner that's (board h/w minus input h/w) / 2
