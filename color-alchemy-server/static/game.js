'use strict';

var globalTargetColor = [];
var golbalHighlightedTile = null;
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
  UpdateMovesLeft();

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
     resultRgb[0]= parseFloat(r * f).toFixed(2);
     resultRgb[1]= parseFloat(g * f).toFixed(2);
     resultRgb[2]= parseFloat(g * f).toFixed(2);
     squares[i].style.backgroundColor = "rgb(" +resultRgb[0]+ ","+resultRgb[1]+","+resultRgb[2]+")";
     squares[i].setAttribute('title',resultRgb.toString());
     updateClosestColor(resultRgb[0], resultRgb[1], resultRgb[2], squares[i]);
     
  }
   
}
const ClosestColor = (props)=>{
  const targetColor = props.targetcolor.split(",");
  var delta = (1/255)*(1/Math.sqrt(3))*(Math.sqrt(Math.pow(targetColor[0],2)+Math.pow(targetColor[1],2)+Math.pow(targetColor[2],2)));
  delta = parseFloat(delta*100).toFixed(2);
  return (
  <p className="game-closest-color">Closest color: <span id='closest-color-tile' title="0,0,0" className="square"></span>
  <span className="delta">Δ = <span id='closest-color-delta' delta = {delta}>{delta}</span>%</span></p>)

}
const updateClosestColor = (r, g, b, e)=>{
  var newDelta = (1/255)*(1/Math.sqrt(3))*(Math.sqrt(Math.pow((globalTargetColor[0] - r),2)+Math.pow((globalTargetColor[1] - g),2)+Math.pow((globalTargetColor[2] - b),2)));
  newDelta = parseFloat(newDelta*100).toFixed(2); 
  var deltaElem = document.getElementById('closest-color-delta');
  var tileElem = document.getElementById('closest-color-tile');
  var oldDleta = deltaElem.getAttribute('delta');
  if(newDelta < oldDleta){
    console.log(' ya haramii new deltta = :' + newDelta);
    deltaElem.setAttribute('delta', newDelta.toString());
    deltaElem.innerText = newDelta.toString();
    tileElem.style.backgroundColor = "rgb(" +r+ ","+g+","+b+")";
    tileElem.setAttribute('title', r +',' + g + ',' +b);
    if(golbalHighlightedTile !== null){
      golbalHighlightedTile.classList.remove('highlighted-tile');
    }
    e.classList.add('highlighted-tile');
    golbalHighlightedTile = e;
  }
}
const MoveLefts = (props)=>{
  // update the number of the moves left for the user
  return <p  className="game-moves-left">Moves left: <span id="moves-left-component" movesleft={props.movesleft}>{props.movesleft}</span></p>;

}

const UpdateMovesLeft = () => {
  var e = document.getElementById('moves-left-component');
  var moves = e.getAttribute('movesleft');
  if(parseInt(moves) > 0){
    moves = parseInt(moves) - 1;
    e.setAttribute('movesleft', moves.toString());
    e.innerText = moves.toString();
  }
  else{
    alert('GAME IS OVER');
  }
  
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
class GameData extends React.Component{
  constructor(props) {
    super(props);
  }
  getSquareColor() {
    const targetColor = this.props.targetcolor; 
    var targetArray = [0,0,0];
    if(targetColor !== null){
      targetArray = targetColor.split(",");
    }
    return {
      backgroundColor: "rgb(" +targetArray[0]+ ","+targetArray[1]+","+targetArray[2]+")"
    };
    
  }
  render(){
    return (
      <div className="game-data">
        <p className="game-user-id">User ID: {this.props.userid} </p>
        <MoveLefts movesleft = {this.props.movesleft} />
        <p className="game-target-color">Target color: <span title={this.props.targetcolor} className="square" style={this.getSquareColor()}></span></p>
        <ClosestColor targetcolor={this.props.targetcolor} />
      </div>
    ); 
  }

}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      userid: '123',
      moves: 12,
      targetcolor: "0,0,0",
      width : 5,
      height: 6
    };
  }
  async componentDidMount(){
    const url = "http://localhost:9876/init";
    const res = await fetch(url);
    const data = await res.json();
    globalTargetColor = data.target;
    this.setState({ userid: data.userId, moves: data.maxMoves, targetcolor: data.target.toString(),width: data.width, height: data.height});
  }
  render() {
    console.log("global target color: " + globalTargetColor);
    return (
      <div className="game-root">
        <div className="game-header">
        <h1 className="game-title">RGB Alchemy</h1>
        <GameData 
        userid={this.state.userid}
        movesleft={this.state.moves}
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