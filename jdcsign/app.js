var fs = require('fs');


// include the node module
var wkhtmltox = require("wkhtmltox");
// instantiate a new converter.
var converter = new wkhtmltox();
// Convert to image.
// Function takes (inputStream, optionsObject), returns outputStream.
converter.image(fs.createReadStream('foo.html'), { format: "jpg" })
    .pipe(fs.createWriteStream("foo.jpg"))
    .on("finish", done);

function done(){
    console.log('ok');
}