var coords = [{"x":0, "y":0},{"x":5,"y":5},{"x":7,"y":7}];
var arms = [0,Math.sqrt(Math.pow(5,2)+Math.pow(5,2)),Math.sqrt(Math.pow(2,2)+Math.pow(2,2))];
var state = false;
const data = {datasets: [{fill: false,pointRadius:3,backgroundColor:"rgba(0,0,0,1.0",borderColor:"rgba(0,0,255,0.8)",data:coords,showLine:true}]};
const scales = {yAxes: [{ticks:{min:0,max:15}}], xAxes: [{ticks:{min:-5,max:15}}],color:"rgba(0,255,0,1.0)" };
const options = {legend:{display:false},scales,backgroundColor:"rgba(255,255,255,1.0)"};
const config ={type:"scatter",data,options};
let arm = new Chart("armSimulation",config);
const data_window = document.getElementById("data");

function armHipo(coord){
    var hip = Math.sqrt(Math.pow(coord[2]["x"],2)+Math.pow(coord[2]["y"],2));
    var x = coord[2]["x"];
    var y = coord[2]["y"];
    var change_y = y-Math.sqrt(Math.pow(hip,2)-Math.pow(x+1,2)); 
    return change_y
    }

function UP(coord){
    state = false;
    for(let i = 1; i<3;i++){
        var hip = arms[i];
        var arm_x = (coord[i]["x"]-coord[i-1]["x"]);
        var arm_y = (coord[i]["y"]-coord[i-1]["y"]);
        var change_y = Math.sqrt(Math.pow(hip,2)-Math.pow(arm_x-1,2))-arm_y;
        coord[i]["x"]-=1;
        coord[i]["y"]+=change_y;
    }
    arm.update();
    let info = `<span> point1(${coord[0]["x"]}, ${Math.round(coord[0]["y"]*100)/100}) <br> point2(${coord[1]["x"]}, ${Math.round(coord[1]["y"]*100)/(100)}) <br> point3(${coord[2]["x"]}, ${Math.round(coord[2]["y"]*100)/100})</span>`;
    data_window.insertAdjacentHTML('beforeend',info);
}

function DOWN(coord){
    for(let i = 1; i<3;i++){
        var hip = arms[i];
        var arm_x = (coord[i]["x"]-coord[0]["x"]);
        var arm_y = (coord[i]["y"]-coord[0]["y"]);
        var change_y = arm_y-Math.sqrt(Math.pow(hip,2)-Math.pow(arm_x+1,2));
        if(coord[1]["x"]<coord[2]["x"] && coord[1]["y"]<coord[2]["y"]){
            if(coord[2]["y"]-coord[1]["y"]<=3){
                state=true;
            }
            if(state){
                coord[i]["x"]+=1;
                coord[i]["y"]-=armHipo(coord);
            }
            else{
                coord[i]["x"]+=1;
                coord[i]["y"]-=change_y;
            }
        }

    }
    let info = `<span> point1(${coord[0]["x"]}, ${Math.round(coord[0]["y"]*100)/100}) <br> point2(${coord[1]["x"]}, ${Math.round(coord[1]["y"]*100)/(100)}) <br> point3(${coord[2]["x"]}, ${Math.round(coord[2]["y"]*100)/100})</span>`;
    data_window.insertAdjacentHTML('beforeend',info);
    arm.update();
}

document.getElementById("up").onclick= function() {UP(coords)};
document.getElementById("down").onclick= function() {DOWN(coords)};
