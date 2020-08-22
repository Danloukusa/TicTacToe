// STORE ttt gameboard INSIDE "Gameboard" object
// STORE players inside objects
// control game flow with object

// Rule of thumb: if you only ever need ONE of something 
// (gameBoard, displayController), use a module. 

// If you need multiples of something (players!), 
// create them with factories.

// make a player
const personFactory = (name) => {
    const showName = () => console.log(name);
    return { name, showName }
}


// Storage of board 
const GameBoard = (() => {
    // There are 9 squares.
    // 0 1 2
    // 3 4 5
    // 6 7 8
    let theBoard = [];

    function validIndex(val){
        return theBoard[val] == " ";
    }

    function generateBoard(){
        let i = 0;

        if(theBoard.length == 9)
            for(i = 0; i < 9; i++)
                theBoard[i]= " ";
        else
            for(i = 0; i < 9; i++)
                theBoard.push(" ");
    }

    function threeInARow(){
        // 8 possibilities.
    
        // ANY ROW OF 3
        // r1
        checkThree(0, 1, 2);
        // r2
        checkThree(3, 4, 5);
        // r3
        checkThree(6, 7, 8);

        // ANY COLUMN OF 3
        // c1
        checkThree(0, 3, 6);
        // c2
        checkThree(1, 4, 7);
        // c3
        checkThree(2, 5, 8);

        // DIAGONAL
        // leftSlash
        checkThree(0, 4, 8);
        // rightSlash
        checkThree(2, 4, 6);

        if(boardFull()){
            TicTacToe.gameOver("full");
        }
    }

    function boardFull(){
        let isFull = false;
        let count = 0;
        for(index in theBoard)
        {
            if(theBoard[index] != " ")
                count += 1;
        }
        
        if(count == 9)
            isFull = true;

        return isFull;
    }

    function checkThree(a, b, c){
        if((theBoard[a] !== " ") && (theBoard[a] == theBoard[b]) && (theBoard[a] == theBoard[c]))
        {
            TicTacToe.gameOver(GameBoard.theBoard[a]);
        }
    }

    function addX(id){
        theBoard[id] = "X";
    }
    function addO(id){
        theBoard[id] = "O";
    }
    return { theBoard, generateBoard, addX, addO, threeInARow, validIndex, boardFull };
})();

// Control of game
const TicTacToe = (() => {
    let player1 = " ";
    let player2 = " ";
    let p2Bot = false;
    let turn = true;
    let winner = " ";
    let gg = false;

    function setNames(p1, p2, isBot){
        player1 = personFactory(p1);
        player2 = personFactory(p2);
        p2Bot = isBot;
    }

    function resetVal(){
        player1 = " ";
        player2 = " ";
        turn = true;
        winner = " ";
        gg = false;
        p2Bot = false;
    }

    function selectBox(){
        let index;
        // If box already occupied, return!
        if (arguments.length == 1)
            index = this.id;
        if(arguments.length == 2)
            index = arguments[0];

        let gameTile = GameBoard.theBoard[index];
        if(GameBoard.validIndex[index] || gg)
        {
            if(gg)
                alert("GG");
            return false;
        }

        // IF player 1, push x
        if(turn)
        {
            GameBoard.addX(index);
        }
        else
        {
            // IF player 2, push O
            GameBoard.addO(index);
        }
        displayController.updateTile(index, GameBoard.theBoard[index]);
        console.log(GameBoard.theBoard);
        GameBoard.threeInARow();
        switchTurn();
    }

    function switchTurn(){

        turn = !turn;

        // BOT turn
        if(p2Bot && !turn)
        {
            //botTurn();
            if(GameBoard.boardFull())
                return;
            if(gg)
                return;
            let val;
            let move;
            do{
                val = Math.floor(Math.random() * 9);
             //   alert(val);
                move = GameBoard.validIndex(val); 
             //   alert(move);
             //   alert("Boogaloo");
            }while(!move)
            selectBox(val, 0);
        }

    }

    function gameOver(arg){
        gg = true;
        if(arg == "X")
        {
            console.log(player1.name);
            winner = player1.name;
            displayController.displayResults(player1.name);
        }

        if(arg == "O")
        {
            winner = player2.name;
            displayController.displayResults(player2.name);
        }

        if(arg == "full" && winner == " ")
        {
            displayController.displayResults(" ");
        }

    }
    
    return { selectBox, player1, player2, gameOver, winner, setNames, resetVal };

})();

const displayController = (() => {
    function addEventListeners(){
        if(document.getElementById("player1").value == false
        || document.getElementById("player2").value == false
        ||
        (document.getElementById("bot").checked == false && document.getElementById("notBot").checked == false)
            )    return;
        let i = 0;
        GameBoard.generateBoard();
        for (i = 0; i < 9; i++)
        {
            let myButton = document.createElement("button");
            myButton.addEventListener("click", TicTacToe.selectBox);
            myButton.id = i;

            myButton.innerText = GameBoard.theBoard[i];
    
            document.getElementById("gridContainer").appendChild(myButton);
        }
        pullNames();
        document.getElementById("reset").addEventListener("click", reset);
    }

    function updateTile(id, value){
        document.getElementById(id).innerText = value;
    }

    function displayResults(champ){
        let newBox = document.createElement("div");
        if(champ == " ")
            newBox.innerText = "TIE!";
        else
            newBox.innerText = champ + " wins!";
        newBox.id = "results";

        document.getElementById("gridContainer").appendChild(newBox);
    }

    function pullNames(){
        let name1 = document.getElementById("player1").value;
        let name2 = document.getElementById("player2").value;
        let isBot = document.getElementById("bot").checked;
        TicTacToe.setNames(name1, name2, isBot);
        document.getElementById("player1").value = "";
        document.getElementById("player2").value = "";
        document.getElementById("bot").checked = false;
        document.getElementById("notBot").checked = false;
        displayNameForm(false);
    }

    function displayNameForm(arg){
        if(arg)
        {
            document.getElementById("names").style.display = "block";
            document.getElementById("reset").style.display = "none";
        }

        else
        {
            document.getElementById("names").style.display = "none";
            document.getElementById("reset").style.display = "block";
        }

    }

    function reset(){
        displayNameForm(true);
        GameBoard.generateBoard();
        let i = 0;
        for(i = 0; i < 9; i++)
        {
            document.getElementById(i).remove();
        }
        TicTacToe.resetVal();
        if(document.getElementById("results") != null)
            document.getElementById("results").remove();
    }

    return { addEventListeners, updateTile, displayResults, pullNames }
})();


// displayController.addEventListeners();


