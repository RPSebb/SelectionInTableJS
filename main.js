function getTimeFormated(minutes) {
    let min = minutes % 60 + "";
    let hour = (minutes - min) / 60 + "";

    if(min.length  < 2) { min  = min +  '0'; }
    if(hour.length < 2) { hour = '0' + hour; }
    return hour + "h" + min;
}

function createTable() {
    const table = document.createElement("table");
    const body  = document.createElement("tbody");
    const head  = document.createElement("thead");

    let row = document.createElement("tr");
    for(let x = 0; x < 8; x++) {
        const cell = document.createElement("th");
        if(x === 0) {
            cell.innerText = "Time"
        } else {
            cell.innerText = days[x - 1];
        }
        row.appendChild(cell);
    }

    head.appendChild(row);

    const startMin = 7 * 60;
    const endMin = 16 * 60;
    for(let y = startMin; y <= endMin; y+= step) {
        const row = document.createElement("tr");

        for(let x = 0; x < 8; x++) {
            let type = x === 0 ? "th" : "td";
            const cell = document.createElement(type);

            if(x === 0) {
                if(y % 60 !== 0) { continue; }
                cell.textContent = getTimeFormated(y);
                cell.rowSpan = Math.round(60 / step);
                cell.style.verticalAlign = "top";
            } else {
                // cell.textContent = x + y;
            }
            row.appendChild(cell);
        }

        body.appendChild(row);
    }

    table.appendChild(head);
    table.appendChild(body);
    return table;
}

function handleMouseDown(event) {
    event.preventDefault();

    input.start.x = event.pageX;
    input.end.x   = event.pageX;
    input.start.y = event.pageY;
    input.end.y   = event.pageY;

    resetBox(boundingBox);
    retrieveCoords = true;
    drawSelectionBox();
    getCellsInSelection();
    drawBoundingBox();
}

function handleMouseMove(event) {
    event.preventDefault();

    if(!retrieveCoords) { return ;}

    input.end.x   = event.pageX;
    input.end.y   = event.pageY;
    drawSelectionBox();
    getCellsInSelection();
    drawBoundingBox();
}


function handleMouseUp(event) {
    event.preventDefault();
    retrieveCoords = false;
    showCellContent();
    resetBox(selectionBox);
}

function getCellsInSelection() {
    selectedCells = [];
    // Récupérer les coordonnées du rectangle de sélection
    const x = Math.min(input.start.x, input.end.x) - window.scrollX;
    const y = Math.min(input.start.y, input.end.y) - window.scrollY;
    const width  = Math.abs(input.end.x - input.start.x);
    const height = Math.abs(input.end.y - input.start.y);

    // Sélectionner toutes les cellules du tableau
    const cells = document.querySelectorAll('td');

    // Filtrer les cellules qui se trouvent à l'intérieur de la zone de sélection
    selectedCells = [...cells].filter(cell => {
        const rect = cell.getBoundingClientRect();
        return (
            rect.left < x + width &&
            rect.right > x &&
            rect.top < y + height &&
            rect.bottom > y
        );
    });
}

function resetBox(box) {
    box.style.display = "none";
    box.style.left    = 0;
    box.style.left    = 0;
    box.style.width   = 0;
    box.style.height  = 0;
}

function drawSelectionBox() {
    const x = Math.min(input.start.x, input.end.x);
    const y = Math.min(input.start.y, input.end.y);
    const width  = Math.abs(input.end.x - input.start.x);
    const height = Math.abs(input.end.y - input.start.y);

    selectionBox.style.left    = x + 'px';
    selectionBox.style.top     = y + 'px';
    selectionBox.style.width   = width + 'px';
    selectionBox.style.height  = height + 'px';
    selectionBox.style.display = "block";

}

function drawBoundingBox() {
    let minX =  Infinity;
    let minY =  Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedCells.forEach(cell => {
        const rect = cell.getBoundingClientRect();
        minX = Math.min(minX, rect.left);
        minY = Math.min(minY, rect.top);
        maxX = Math.max(maxX, rect.right);
        maxY = Math.max(maxY, rect.bottom);
    });

    boundingBox.style.left    = minX - window.scrollX + 'px';
    boundingBox.style.top     = minY + window.scrollY + 'px';
    boundingBox.style.width   = (maxX - minX) + 'px';
    boundingBox.style.height  = (maxY - minY) + 'px';
    boundingBox.style.display = "block";

}

function showCellContent() {
    let text = '{';
    for(let i = 0; i < selectedCells.length; i++) {
        text += selectedCells[i].textContent;
        if(i != selectedCells.length - 1) {
            text += ', ';
        } 
    }

    text += '}\n';
    console.log(text)
}

const days = ["Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday", "Sunday"];
const startHour = 7;
const endHour = 18;
const step = 10; // in minute
let selectedCells = [];

let input = { start : { x : 0, y : 0 }, end : { x : 0, y : 0 } };
let retrieveCoords = false;

const style = document.createElement('style');
style.textContent = 'td { height :10px; }';

const selectionBox = document.createElement('div');
selectionBox.id = "selectionBox";
selectionBox.style.display = "none";

const boundingBox = document.createElement('div');
boundingBox.id = "boundingBox";
boundingBox.style.display = "none";

const table = createTable();

table.addEventListener('mousedown', handleMouseDown);
table.addEventListener('mouseup'  , handleMouseUp  );
table.addEventListener('mousemove', handleMouseMove);

document.body.appendChild(selectionBox);
document.body.appendChild(boundingBox);
document.body.appendChild(table);
document.head.append(style);

// fetch('./db/users.json')
//     .then((reponse) => reponse.json())
//     .then((data) => console.log(data));