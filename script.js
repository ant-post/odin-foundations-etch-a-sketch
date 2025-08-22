const controlButtons = document.querySelectorAll('.control-pair > button');
controlButtons.forEach(button => {
    button.addEventListener('click', () => {
        requestAnimationFrame(() => {
            button.classList.add('clicked-control-button');
            setTimeout(() => {
                button.classList.remove('clicked-control-button');
            }, (100));
        });
    });
});

const gridContainer = document.querySelector('.grid-container');
gridContainer.addEventListener('contextmenu', (event) => event.preventDefault());

let solidMode = true;
let gradientMode = false;
let rainbowMode = false;

let gridSize;
const gridSizeSlider = document.querySelector('#grid-size');
gridSizeSlider.addEventListener('input', () => {
    gridSize = parseInt(gridSizeSlider.value);
    deleteGrid();
    createGrid(gridSize);
});

let displayCellBorders = true;
function toggleCellBorders () {
  displayCellBorders = !displayCellBorders;
  for (const cell of gridContainer.children) {
    cell.style.border = displayCellBorders ? '1px solid black' : '';
  }
}
const toggleCellBordersButton = document.querySelector('#toggle-cell-borders');
toggleCellBordersButton.addEventListener('click', toggleCellBorders);

const clearGridButton = document.querySelector('#clear-grid');
clearGridButton.addEventListener('click', () => {
    deleteGrid();
    createGrid(gridSize);
});

const solidModeButton = document.querySelector('#solid-mode');
const gradientModeButton = document.querySelector('#gradient-mode');
const rainbowModeButton = document.querySelector('#rainbow-mode');

solidModeButton.addEventListener('click', () => {
    solidMode = true;
    gradientMode = false;
    rainbowMode = false;
});

gradientModeButton.addEventListener('click', () => {
    solidMode = false;
    gradientMode = true;
    rainbowMode = false;
});

rainbowModeButton.addEventListener('click', () => {
    solidMode = false;
    gradientMode = false;
    rainbowMode = true;
});

let chosenColor;
const colorPicker = document.querySelector('#color-picker');
colorPicker.addEventListener('input', (event) => {
    chosenColor = event.target.value;
});

function getColor(elColor) {
    if (solidMode) {
        return chosenColor; 
    }
    else if (gradientMode) {
        let step = 70;
        let newColor = elColor.slice(0, 7);
        if (newColor === chosenColor.slice(0, 7) && elColor.slice(7) != '') {
            alpha = parseInt(elColor.slice(7), 16);
            alpha = parseInt(alpha + step > 255 ? 255 : alpha + step).toString(16);
            newColor = newColor + alpha;
        }
        else {
            newColor = chosenColor + (step).toString(16);
        }
        return newColor;
    }
    else if (rainbowMode) {
        const color = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
        const alpha = Math.floor(Math.random() * (0xFF - 0x99) + 0x99).toString(16).padStart(2, '0');
        return `#${color}${alpha}`;
    }
}

function createGrid(gridSize) {
    const fragment = document.createDocumentFragment();

    const cellPercent = 100 / gridSize;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const gridEl = document.createElement('div');
        gridEl.classList.add('grid-cell');

        gridEl.style.flexBasis = `${cellPercent}%`;
        gridEl.style.height = `${cellPercent}%`;

        gridEl.style.border = displayCellBorders ? '1px solid #484849ff' : '';
        gridEl.dataset.markedColor = 'inherit';
        gridEl.style['background-color'] = 'inherit';

        gridEl.addEventListener('mouseenter', (e) => {
            gridEl.style['background-color'] = 'gold';
        });

        gridEl.addEventListener('mouseleave', (e) => {
            if (e.buttons & 1 || e.buttons & 2) {
                gridEl.dataset.markedColor = getColor(gridEl.dataset.markedColor);
            }
            gridEl.style['background-color'] = gridEl.dataset.markedColor;
        });

        fragment.appendChild(gridEl);
    }

    gridContainer.appendChild(fragment);
}

function deleteGrid () {
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
};

colorPicker.dispatchEvent(new Event('input'));
gridSizeSlider.dispatchEvent(new Event('input'));
