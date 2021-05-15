var fs = require('fs');
const { exec } = require("child_process");

console.log("Converting To IP DEVELOPMENT Mode")

fs.readFile('config.env', 'utf-8', function (err, data) {
    console.log("Making changes in Config.env file");
    if (err) throw err;

    var newValue = data.replace('production', "development");

    fs.writeFile('config.env', newValue, 'utf-8', function (err, data) {
        if (err) throw err;
        console.log('Done!');
    })
})

fs.readFile('./public/js/script.js', 'utf-8', function (err, data) {
    console.log("Making changes in /public/js/script.js file");
    if (err) throw err;
    var newValue = data.replace(/http:\/\/localhost:5050/g, "http://139.59.65.243");
    var newValue = data.replace( /https:\/\/saavishkaara\.com/g, "http://139.59.65.243");

    fs.writeFile('./public/js/script.js', newValue, 'utf-8', function (err, data) {
        if (err) throw err;
        console.log('Done!');
    })
})

exec("npm run build.js", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

