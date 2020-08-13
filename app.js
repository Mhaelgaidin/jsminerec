// Need to fix shuffle to usee Fisher yates Algorithmn
// Need to fix checks that use numbers to dynamically calculate based on the size of the grid

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    let flagsLeft = document.querySelector('.flags');

    //create Board
    function createBoard() {
        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            //normal click
            square.addEventListener('click', function (e) {
                click(square);
            })

            //right click
            square.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(square);
            }



        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);

            if (squares[i].classList.contains('valid')) {
                //Check square to left
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                //Check square to top left
                if (i > 10 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                //Check square above
                if (i > 9 && squares[i - width].classList.contains('bomb')) total++;
                //Check square to top right
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                //Check square to right
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                //Check square to bottom right
                if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                //Check square to bottom
                if (i < 90 && squares[i + width].classList.contains('bomb')) total++;
                //Check square to  bottom left
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data-c', total);
            }

        }

        flagsLeft.innerHTML = bombAmount - flags;

    }

    createBoard();

    //add flag with right click
    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                checkForWin();
                flagsLeft.innerHTML = bombAmount - flags;
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsLeft.innerHTML = bombAmount - flags;
            }
        }
    }

    //click on square actions
    function click(square) {
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;
        if (square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data-c')
            if (total != 0) {
                square.classList.add('checked');
                square.innerHTML = total;
                return;
            }
            square.classList.add('checked');
            checkSquare(square);
        }
    }

    //check neighbouring squares once a square is clicked
    function checkSquare(square) {
        let currentId = square.id;
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1);

        setTimeout(() => {
            //Check square to left
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //Check square top left
            if (currentId > 10 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //check square above
            if (currentId > 9) {
                const newId = squares[parseInt(currentId) - width].id
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //Check square to top right
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //Check square to right
            if (currentId < 99 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //Check square  bottom right
            if (currentId < 89 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //Check square below
            if (currentId < 90) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            //check square bottom left
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

        }, 10)

    }

    //Game Over 
    function gameOver(square) {
        isGameOver = true;
        document.querySelector('.gameOver').style.visibility = 'visible';
        document.querySelector('.result').innerHTML = 'You Lost';
        square.classList.remove('bomb');
        square.innerHTML = '💥'

        //show ALL bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
            }
        })
    }

    //check for win
    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
            if (matches === bombAmount && isGameOver === false) {
                isGameOver = true;
                document.querySelector('.gameOver').style.visibility = 'visible';
                document.querySelector('.result').innerHTML = 'You Won';
            }
        }
    }

})