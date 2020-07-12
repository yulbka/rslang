let target;
let shiftX;
let shiftY;
let elemBelow;
let targetSibling;
let relation;

document.body.addEventListener('mousedown', (event) => {
  target = event.target.closest('.puzzle-wrapper');
  if (!target) return;
  if (target.classList.contains('finished')) return;
  findElementRelations(target);
  const coords = target.getBoundingClientRect();
  shiftX = event.clientX - coords.x;
  shiftY = event.clientY - coords.y;
  target.style.position = 'absolute';
  target.style.zIndex = '1000';
  document.body.append(target);
  moveAt(event.pageX, event.pageY);
  document.addEventListener('mousemove', onMouseMove);
  target.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    dropPuzzle(coords, targetSibling, relation);
    target.onmouseup = null;
  };
  target.ondragstart = function() {
    return false;
  };
});

function moveAt(x, y) {
  target.style.left = `${x - shiftX}px`;
  target.style.top = `${y - shiftY}px`;
}

function onMouseMove(event) {
  moveAt(event.pageX, event.pageY);
  target.style.display = 'none';
  elemBelow = document.elementFromPoint(event.pageX, event.pageY);
  if (!elemBelow) return;
  target.style.display = 'inline-block';
}

function dropPuzzle(coords) {
  const newCoords = target.getBoundingClientRect();
  const rowIndex = document.querySelector('.count').lastChild?.textContent;
  const row =
    document.querySelector(`[data-row='${rowIndex}']`);
  settlePuzzle(target);
  if ((Math.floor(newCoords.x) === Math.floor(coords.x) &&
  Math.floor(newCoords.y) === Math.floor(coords.y)) || elemBelow === row) {
    row.append(target);
  } else if (elemBelow && elemBelow.closest('.settled')) {
    elemBelow.closest('.settled').after(target);
  } else {
    switch (relation) {
      case 'next':
        targetSibling.before(target);
        break;
      case 'prev':
        targetSibling.after(target);
        break;
      default:
        targetSibling.append(target);
    }
  }
  if (document.querySelectorAll('.settled').length ===
  document.querySelectorAll('.new').length) {
    showCheckButton();
  }
}

function settlePuzzle(puzzleItem) {
  const puzzle = puzzleItem;
  puzzle.style.position = 'relative';
  puzzle.style.left = 'unset';
  puzzle.style.top = 'unset';
  puzzle.classList.add('settled');
}

function findElementRelations() {
  if (target.nextSibling) {
    targetSibling = target.nextSibling;
    relation = 'next';
  }
  if (target.previousSibling) {
    targetSibling = target.previousSibling;
    relation = 'prev';
  }
  if (targetSibling === null) {
    targetSibling = target.parentElement;
    relation = 'parent';
  }
}

function showCheckButton() {
  const check = document.querySelector('.puzzle-btn_check');
  const help = document.querySelector('.puzzle-btn_help');
  check.classList.remove('btn_hidden');
  help.classList.add('btn_hidden');
}