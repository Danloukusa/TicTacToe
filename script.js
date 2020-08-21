// STORE ttt gameboard INSIDE "Gameboard" object
// STORE players inside objects
// control game flow with object

// Rule of thumb: if you only ever need ONE of something 
// (gameBoard, displayController), use a module. 

// If you need multiples of something (players!), 
// create them with factories.


// Storage of board 
const GameBoard = (() => {
    // There are 9 squares.
    // 0 1 2
    // 3 4 5
    // 6 7 8
    let theBoard = [9];

    function addX(){

    }
    function addO(){

    }
    return { theBoard, addX, addO };
})();

// Control of game
const TicTacToe = (() => {
    function selectBox(){
        console.log(this.id);
    }
    
    return { selectBox };

})();

const displayController = (() => {
    function addEventListeners(){
        let i = 0;
        for (i = 0; i < 9; i++)
        {
            let myButton = document.createElement("button");
            myButton.addEventListener("click", TicTacToe.selectBox);
            myButton.id = i;
    
            document.getElementById("gridContainer").appendChild(myButton);
        }
    }
    return { addEventListeners }
})();




displayController.addEventListeners();