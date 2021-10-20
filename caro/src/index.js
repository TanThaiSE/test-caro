import React from "react";
import ReactDOM from "react-dom";
import './index.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
      return (
        <button className="square" 
        onClick={()=>this.props.onClick()}
        >
            {this.props.value}
        </button>
      );
    }
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return <Square value={this.props.squares[i]} 
        onClick={()=>this.props.onClick(i)}/>;
    }
  
    render() {
        let sizeBoard=5;
        let tableBoard=[];
        for(let i=0;i<sizeBoard;i++)
        {
            let row=[];
            for(let j=0;j<sizeBoard;j++){
                row.push(this.renderSquare(i*sizeBoard+j));
            }
            tableBoard.push(<div className="board-row">{row}</div>)
        }
      return (
        <div>{tableBoard}</div>
      );
    }
  }
  
  class Game extends React.Component {
      constructor(props){
          super(props);
          this.state={
              history:[{
                squares:Array(9).fill(null),
              }],
              stepNumber:0,
              xIsNext:true,
              isAsc:true,
          }
      }


      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]||calculateWinner(squares)===25) {
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
            latetMove: i,
          }]),
          stepNumber:history.length,
          xIsNext: !this.state.xIsNext,
        });
      }

      jumpTo(step){
          this.setState({
              stepNumber:step,
              xIsNext:(step%2)===0,
          })
      }

      handleSort() {
        this.setState({
            isAsc: !this.state.isAsc
        });
      }
    render() {
        const history=this.state.history;
        const current=history[this.state.stepNumber];
        const winner=calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const latetMove=step.latetMove;
            const row=Math.floor(latetMove / 5);
            const col=latetMove%5;
            const desc = move ?
              'Go to move #' + move +'('+col +','+row+')' :
              'Go to game start';
            return (
              <li key={move}>
                <button 
                className={move===this.state.stepNumber? 'item-selected':''}
                onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
            );
          });


        let status;
        if(winner){
            if(winner!==25)
            {
                status='Winner '+winner;
            }
            else{
                status='Draw';
            }
        }
        else{
            status= 'Next player: '+(this.state.xIsNext? 'X':'O');
        }
        const isAsc = this.state.isAsc;
        if (!isAsc) {
            moves.reverse();
          }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i)=>this.handleClick(i)} />
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <button onClick={() => this.handleSort()}>
            {isAsc ? 'descending' : 'ascending'}
          </button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
        [0,1,2,3,4],
        [5,6,7,8,9],
        [10,11,12,13,14],
        [15,16,17,18,19],
        [20,21,22,23,24],
        [0,5,10,15,20],
        [1,6,11,16,21],
        [2,7,12,17,22],
        [3,8,13,18,23],
        [4,9,14,19,24],
        [0,6,12,18,24],
        [4,8,12,16,20],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c,d,e] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]&& squares[a] === squares[d]&& squares[a] === squares[e]) {
        return squares[a];
      }
    }
    for(let i = 0; i < lines.length; i++){
        if(squares[i]==null){
            return null;
        }
    }
    return 25;
  }