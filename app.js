// Need to fix shuffle to usee Fisher yates Algorithmn
// Need to fix checks that use numbers to dynamically calculate based on the size of the grid

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;
    let bombAmount = 20;
    let squares = [];

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
                this.innerHTML = this.attributes.data.value;
            })



        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);

            if (squares[i].classList.contains('valid')) {
                //Check square to left
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                //Check square to top right
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                //Check square above
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
                //Check square to top left
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                //Check square to right
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                //Check square to  bottom left
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                //Check square to bottom right
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                //Check square to bottom
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total);
            }

        }













    }

    createBoard();

})