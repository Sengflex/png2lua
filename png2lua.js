var fs  = require("fs");
var PNG = require("pngjs").PNG;
var path = require('path');

function png_to_lua(filePath) {
    var fileContent = fs.readFileSync(filePath);
    var png = PNG.sync.read(fileContent);

    var b64 = fileContent.toString('base64');

    return "\n\t['"+filePath+"'] = {\n\t\tw='"+png.width+"px',\n\t\th='"+png.height+"px',\n\t\tbase64='"+b64+"'\n\t}\n"
}

function list_files(ext){
    // get current directory
    var curDir = process.cwd();    

    // var dirPath = path.resolve(__dirname); // path to your directory goes here
    var dirPath = curDir;
    var filesList=[];

    var tmpFilesList = fs.readdirSync(dirPath);

    for(var  i=0; i<tmpFilesList.length; i++) {
        var e = tmpFilesList[i]
        
        // check if filePath is a directory
        if (!fs.lstatSync(e).isDirectory()) {
            if (path.extname(e).toLowerCase()==('.'+ext)) {
                filesList.push(e)
            }
        } else {
            console.log("-- " + e + " is a directory. Skiping...")
        }
    }

    return filesList
}

var filePath=process.argv[2]
if (process.argv.length<3) {
    throw "Mising file param or *"
}

var luaCode="local imageCache={"

if (filePath=="*") {
    var filesList=list_files("png")
    for(var i=0; i<filesList.length; i++) {
        luaCode+=png_to_lua(filesList[i]);
        if((i+1)<filesList.length) {
            luaCode+=",\n";
        }
    }
    // console.log(filesList);
} else {
    luaCode+=png_to_lua(filePath);
}

luaCode+="}\n\nreturn imageCache"

console.log(luaCode)
