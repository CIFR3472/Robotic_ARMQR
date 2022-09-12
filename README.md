# Robotic_ARMQR
Código del reto de brazo robótico para el reclutamiento de Quantum Robotics 2022

# Documentación JS Control del brazo

--> Delcarando variables:
var coords = [{"x":0, "y":0},{"x":5,"y":5},{"x":7,"y":7}]; # coordenadas de cada eje 
var arms = [0,Math.sqrt(Math.pow(5,2)+Math.pow(5,2)),Math.sqrt(Math.pow(2,2)+Math.pow(2,2))]; #hipotenusas, es decir tamaño de cada apéndice
var state = false; #variable de contrl
const data = {datasets: [{fill: false,pointRadius:3,backgroundColor:"rgba(0,0,0,1.0",borderColor:"rgba(0,0,255,0.8)",data:coords,showLine:true}]};
const scales = {yAxes: [{ticks:{min:0,max:15}}], xAxes: [{ticks:{min:-5,max:15}}],color:"rgba(0,255,0,1.0)" };
const options = {legend:{display:false},scales,backgroundColor:"rgba(255,255,255,1.0)"};
const config ={type:"scatter",data,options};
let arm = new Chart("armSimulation",config); #gráfica
const data_window = document.getElementById("data"); #guardar información. 

# para casos especiales a la hora de bajar el brazo, en los que la distancia entre los dos puntos (1,2) sean menores a 3, se considera que, al tener una pendiente similar, puede disminuir en un ritmo similar. Así se evita que se muevan a diferentes ritmos. 
function armHipo(coord){
    var hip = Math.sqrt(Math.pow(coord[2]["x"],2)+Math.pow(coord[2]["y"],2));
    var x = coord[2]["x"];
    var y = coord[2]["y"];
    var change_y = y-Math.sqrt(Math.pow(hip,2)-Math.pow(x+1,2)); 
    return change_y
    }
# Permite subir los brazos. Tomando a la hipotenusa como constante, altera los valores de x arbitrariamente (x-=1) y calcula el valor de y correspondiente para ese punto, viendo al segmento como un tríangulo. Posteriormente actualiza en el div #data la información para los tres puntos. 
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
# Permite bajar el brazo del robot.  En este caso, con base en lo observado, se determinaron momentos en los que empezaba a desfasarse el movimiento. 
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

# Se relacionan los botones del html con las funciones: 
document.getElementById("up").onclick= function() {UP(coords)};
document.getElementById("down").onclick= function() {DOWN(coords)};

# Documentación HTML

<!DOCTYPE html>
<html>
    <head>
        <title>Quantum Robotics</title>
        <meta charset="UTF-8"> #Encoding de la página
        <link rel="stylesheet" href="control.css"> #liga al css
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script> # Conexión a Chart.js
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.1.0/math.js"></script> #Conexión a Math.js
    </head>
    <body>
        <h1 class="Title" >Robotic Arm Simulator
            <image src="QRLOGO.png" class ="logo"></image> # logo
        </h1>
        
        <div class="container">
            <div class="MENU">
                <button id ="up", class="button">UP</button> # botón para subir 
                <button id ="down", class="button">Down</button> # botón para bajar
                <canvas id="armSimulation" style="width:100%;max-width:600px"></canvas> #Chart.js
            </div>
        </div>
        <div id="data"></div> #Div para la información
        <script src="control8.js"></script> # Archivo java script
    </body>
</html>

# Documentación CSS

*{
    background-color:black;
    color:white;
    
}
.logo{
    display:inline-block;
    margin-top:1px;
    width:40px;
    height:40px;
}
.container{
    background-color:white;
}
.button{
    
    position:relative;
    display:inline-block;
    color:black;
    background-color:white;
}
.Title{
    display:inline-block;
    color:blue;
    outline: 3px solid white;
    margin-left:460px;

}
.MENU{
    background-color:blue;
    position:fixed;
    width:800px;
    height:400px;
    margin-left:250px;
    outline: 3px solid white;
}
#data{
    display:inline-block;
    outline: 3px solid white;
    color:red;
    height:800px;
    width:150px;
}

#armSimulation{
    display:inline-block;
    outline: 3px solid white;
    background-image: url("mars.jpg"); #Fondo de la gráfica
}
#up{
    margin-left:680px;
}
#down{
    margin-left:10px;
}
#armSimulation{
    margin-left:40px;
    margin-top:30px;
}
