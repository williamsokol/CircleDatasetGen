const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// customize able dimensions
ctx.canvas.width  = 500;
ctx.canvas.height = 500;

var datasetLength = 10;
var datasetDownloadType = "zip"

var ox = canvas.width / 2;
var oy = canvas.height / 2;
ctx.font = "42px serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillStyle = "#800";

var arr = new Array();
var csv = "";



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

    //console.log("hi");
    drawRect(o.vertex.x, o.vertex.y, o.vertex.z, o.vertex.z, o.color);       //draw the square

    o.imageBlob = await new Promise(resolve => canvas.toBlob(resolve));
    return o;    
}

async function ProduceIterations(generators){
    console.log(generators);

    for(var i=0;i<datasetLength; i++){
        let generator = generators[getRndInteger(0,generators.length-1)]
        clearCanvas();
        let object = await generator();
        object.RGBAdata = ctx.getImageData(0,0,canvas.width,canvas.height);
        //console.log(imageBlob)
        arr.push(object);
    }
}
async function DownloadDataset() {

    type = datasetDownloadType;
    switch (type){
        
        case "zip":
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
            break;

        case "csv":
            console.log("hi");
            

            //csv labels
            let rgb = ["r","g","b","a"]
            for (var i=0; i<canvas.width*4*canvas.height; i++){

                //garbage to make labels look nice over here
                let a = Math.floor(i/(canvas.width*4))
                csv += rgb[i%4] + " " + Math.floor(i/4)%(canvas.width) + "x"+ a + ", "
            }
            csv += '\n'

            //csv content
            for (var i=0; i<arr.length; i++){

                //one shape img
                for (var j=0; j<arr[i].RGBAdata.data.length; j++){
                    csv += arr[i].RGBAdata.data[j] + ", "
                   
                }
                csv += '\n';
            }
            // var fileReader = new FileReader();
            // fileReader.onload = function(event) {
            //     arrayBuffer = event.target.result;
            // };
            // fileReader.readAsArrayBuffer(arr[0].imageBlob);
            download("dataset.csv",csv);
            console.log(csv)
        }
}

function ChangeDownloadType()
{
    switch (mylist.selectedIndex)
    {
        case 0:
            console.log("csv")
            datasetDownloadType = "csv"
            break;
        case 1:
            console.log("zip")
            datasetDownloadType = "zip"
            break;
    }
}
function ChangeDatasetLength(event)
{
    console.log(event.srcElement.value);
    datasetLength = event.srcElement.value;
}

function ChangeDatasetSize(event)
{
    console.log(event.srcElement.value);
    ctx.canvas.width = event.srcElement.value;
    ctx.canvas.height = event.srcElement.value;
}


SetUp()
async function SetUp()
{  

    ox = canvas.width / 2;
    oy = canvas.height / 2;


    arr = new Array();
    csv = "";



    await ProduceIterations([Circle_Generator,SquareGenerator])
    //await DownloadDataset();
    console.log("done generating")
   // SquareGenerator();
}

