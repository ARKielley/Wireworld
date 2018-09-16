const width = 65;
const height = 40;

const ww = new Wireworld(height, width);

const tds = [];

const table = document.createElement('tbody');
// rows
for (let h = 0; h < height; h++) {
  const tr = document.createElement('tr');
  // columns
  for (let w = 0; w < width; w++) {
    const td = document.createElement('td');
    td.dataset.row = h;
    td.dataset.col = w;
    tds.push(td);
    tr.append(td);
  }
  table.append(tr);
}
document.getElementById('board').append(table);
