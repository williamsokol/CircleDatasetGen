var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ox = canvas.width / 2;
var oy = canvas.height / 2;
ctx.font = "42px serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillStyle = "#800";

var arr = new Array();

class CircleModel {
    distortion = 0;
    vertex = {
        x: {min: 0, max: 240},
        y: {min: 0, max: 240},
        z: {min: 2, max: 240},  //z is size in the case
    };
    //scale = {min: , max: };
    color = {
        r: {min: 0, max: 255},
        g: {min: 0, max: 255},
        b: {min: 0, max: 255},
        //a: {min: , max: },    //too confusing rn
    };
    // multi = {};
}
async function Circle_Generator(){
    o = new CircleModel();
    o.vertex.z = getRndInteger(2,ox);
    o.vertex.x = getRndInteger(ox-(ox-o.vertex.z), ox+(ox-o.vertex.z));
    o.vertex.y = getRndInteger(oy-(oy-o.vertex.z), oy+(oy-o.vertex.z));
    
    let randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
    o.color = randomColor;                //`rgb(${getRndInteger(0,255)},${color.g},${color.b})`

    drawCircle(o.vertex.x, o.vertex.y, o.vertex.z, o.color);       //draw the circle

    o.imageBlob = await new Promise(resolve => canvas.toBlob(resolve));

    return o;    
};

class SquareModel{
    distortion = 0;
    vertex = {
        x: {min: 0, max: 240},
        y: {min: 0, max: 240},
        z: {min: 2, max: 240},  //z is size in the case
    };
    //scale = {min: , max: };
    color = {
        r: {min: 0, max: 255},
        g: {min: 0, max: 255},
        b: {min: 0, max: 255},
        //a: {min: , max: },    //too confusing rn
    };
}
async function SquareGenerator(){
    o = new SquareModel();
    o.vertex.z = getRndInteger(2,canvas.width);
    o.vertex.x = getRndInteger(0, ox+(ox-o.vertex.z));
    o.vertex.y = getRndInteger(0, oy+(oy-o.vertex.z));
    
    let randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
    o.color = randomColor;                //`rgb(${getRndInteger(0,255)},${color.g},${color.b})`

    console.log("hi");
    drawRect(o.vertex.x, o.vertex.y, o.vertex.z, o.vertex.z, o.color);       //draw the square

    o.imageBlob = await new Promise(resolve => canvas.toBlob(resolve));
    return o;    
}

async function ProduceIterations(generators){
    console.log(generators);

    for(var i=0;i<10; i++){
        let generator = generators[getRndInteger(0,generators.length-1)]
        clearCanvas();
        let object = await generator();
        //console.log(imageBlob)
        arr.push(object);
    }
}
async function DownloadDataset() {
    var zip = new JSZip();

    // make the folder
    for (var i=0; i<arr.length; i++){
       
        zip.file(`image/image${i}.png`, arr[i].imageBlob);
        zip.file(`label/label${i}.txt`, arr[i].constructor.name);
    }

    //saving the file
    zip.generateAsync({ type: 'blob'})
    .then(function(content){
        saveAs(content,"dataset.zip");
    })
}

setUp();
async function setUp()
{
    await ProduceIterations([Circle_Generator,SquareGenerator])
    await DownloadDataset();

   // SquareGenerator();
}

