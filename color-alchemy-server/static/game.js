'use strict';

const Square = (props) => {
  return <td className="square" column ={props.column} row={props.row} title="0,0,0"></td>;
}
const Circle = (props) => {
  const [clicked, setClicked] = React.useState(false);
  return <td className="circle" column={props.column} row={props.row}  title="0,0,0" onClick = {(evt) => handelClick(evt, props.column, props.row, props.width, props.height)}></td>;
}
var clickNumber= 0;
const handelClick = (evt, column, row, width, height)=>{
  var rgb = [];
  if(clickNumber == 0){
    evt.target.style.backgroundColor = "rgb(255, 0, 0)";
    evt.target.setAttribute("title", "255, 0, 0");
    rgb = [255, 0, 0];
  }
  if(clickNumber == 1){
    evt.target.style.backgroundColor = "rgb(0, 255, 0)";
    evt.target.setAttribute("title", "0, 255, 0");
    rgb = [0, 255, 0];
  }
  if(clickNumber == 2){
    evt.target.style.backgroundColor = "rgb(0, 0, 255)";
    evt.target.setAttribute("title", "0, 0, 255");
    rgb = [0, 0, 255];
  }
  if(clickNumber > 2){
    alert(' You finished your 3 clicks, now you can drag the shining tiles on the sources to have more colors!!')
  }
  clickNumber ++;
  generateTilesColors(column, row, rgb, width, height);
  UpdateMoveLefts();

};
const generateTilesColors = (column , row, rgb, width, height)=>{
   // add colors here for tiles
   if(column == 0 || column == -1){
     var squares = document.querySelectorAll(".square[row='"+row+"']");
   }
   else{
    var squares = document.querySelectorAll(".square[column='"+column+"']");
   }

   for (let i = 0; i < squares.length; ++i) {
     var squareActualRgb = [];
     var squareRgb = [];
     var resultRgb = [];
     var factor = (width + 1 - (i+1))/ (width + 1);
     var r,g,b,f;
     squareRgb[0]= rgb[0] * factor;
     squareRgb[1]= rgb[1] * factor;
     squareRgb[2]= rgb[2] * factor;
     squareActualRgb = squares[i].getAttribute('title').split(',');
     r = squareActualRgb[0] + squareRgb[0];
     g = squareActualRgb[1] + squareRgb[1];
     b = squareActualRgb[2] + squareRgb[2];
     f = 255 / Math.max(r, g, b, 255);
     resultRgb[0]= r * f;
     resultRgb[1]= g * f;
     resultRgb[2]= g * f;
     squares[i].style.backgroundColor = "rgb(" +resultRgb[0]+ ","+resultRgb[1]+","+resultRgb[2]+")";
     squares[i].setAttribute('title',resultRgb.toString());
     
  }
   
}
const UpdateMoveLefts = ()=>{
  // update the number of the moves left for the user
   
}

const GameData = (props) => {
  
  const targetColor = props.targetcolor;
  if(targetColor){
     var targetColorArray = targetColor.split(",");
     var squareColor = {
       backgroundColor: "rgb(" +targetColorArray[0]+ ","+targetColorArray[1]+","+targetColorArray[2]+")"
     };
  }
 
  return (
    <div className="game-data">
      <p className="game-user-id">User ID: {props.userid} </p>
      <p className="game-moves-left">Moves left: <span>{props.movesleft}</span></p>
      <p className="game-target-color">Target color: <span title={props.targetcolor} className="square" style={squareColor}></span></p>
      <p className="game-closest-color">Closest color: <span title="0,0,0" className="square"></span><span className="delta">Δ = 12%</span></p>
    </div>
  );  
}

const TabletrCircle = (props) => {
  const list = [];
  list.push(<td key={0}></td>);
  for(let j = 0; j < props.width; j++){
    list.push(<Circle key={j+1} column={j+1} row={props.row} width={props.width} height={props.height}/>);
  }
    list.push(<td key={-1}></td>);
  return (
    <tr>
     {list}
    </tr>  
  );
}
const TabletrSquare = (props) => {
  const list = [];
  list.push(<Circle key={0} column={0} row={props.row} width={props.width} height={props.height} />);
  for(let j = 0; j < props.width; j++){
    list.push(<Square key={j+1} column={j+1} row={props.row}/>);
  }
  list.push(<Circle key={-1} column={-1} row={props.row} width={props.width} height={props.height} />);
  return (
    <tr>
     {list}
    </tr>  
  );
}
const Tablebody = (props) =>{
  const list = [];
  list.push(<TabletrCircle key={0} width={props.width} height={props.height} row={0}/>)
  for(let i = 0; i < props.height; i++){
      list.push(<TabletrSquare key={i+1} width={props.width} height={props.height} row={i+1} />)
  }
  list.push(<TabletrCircle key={-1} width={props.width} height={props.height} row={-1}/>)
  return (
    <tbody>
      {list}
    </tbody>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      userid: null,
      movesleft: null,
      targetcolor: null,
      width:10,
      height:4
    };
  }
  async componentDidMount(){
    const url = "http://localhost:9876/init";
    const res = await fetch(url);
    const data = await res.json();
    this.setState({ userid: data.userId, movesleft: data.maxMoves, targetcolor: data.target.toString(),
      width: data.width, height: data.height,});
  }
  render() {
    return (
      <div className="game-root">
        <div className="game-header">
        <h1 className="game-title">RGB Alchemy</h1>
        <GameData 
        userid={this.state.userid}
        movesleft={this.state.movesleft}
        targetcolor={this.state.targetcolor}
        />
        </div>
      <div className="game-wrapper">
        <table>
        <Tablebody width={this.state.width} height={this.state.height}/>
        </table>
      </div>
      </div>
      );
  }
}
const domContainer = document.querySelector('#game--root');
const root = ReactDOM.createRoot(domContainer);
root.render(<Game/>);