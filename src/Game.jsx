import React from 'react';
import Board from './Board.jsx';

export default class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      moveOrder: true, // true = asc, false = desc
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
        history: history.concat([{squares: squares, position: i}]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
    });
  }

  handleRestart(){
    this.setState({
      history: [{
          squares: Array(9).fill(null),
          positon: null
        }],
      xIsNext: true,
      stepNumber: 0,
      moveOrder: true
    });
  }

  toggleSort(){
    this.setState({moveOrder:!this.state.moveOrder});
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history.slice();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const style = {"fontWeight" : "bold"};

    if(!this.state.moveOrder){
        history.reverse();
    }
    const moves = history.map((step, move) => {
        const  realMove= this.state.moveOrder ? move: history.length - 1 - move;
        const desc = realMove?
          'Go to move #' + realMove +" (" + parseInt(history[move].position/3) + "," + history[move].position%3 + ")":
          'Go to game start';
        return (
          <li key = {move}>
            <button  style = {realMove == this.state.stepNumber ? style : {}} onClick={() => this.jumpTo(realMove)}>{desc}</button>
          </li>
        );
      });

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick={(i)=>this.handleClick(i)}
            winner = {winner}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>Show in {this.state.moveOrder?"Asc":"Desc"}</div>
          <button onClick ={()=>this.handleRestart()}>New Game</button>
          <button onClick ={()=>this.toggleSort()}>Toggle Sort</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}
