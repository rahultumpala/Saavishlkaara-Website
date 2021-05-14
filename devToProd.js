var fs = require('fs');
const { exec } = require("child_process");

console.log("Converting To DEVELOPMENT Mode")

fs.readFile('config.env', 'utf-8', function (err, data) {
    console.log("Making changes in Config.env file");
    if (err) throw err;
    
    var newValue = data.replace("development", 'production');
    
    fs.writeFile('config.env', newValue, 'utf-8', function (err, data) {
        if (err) throw err;
        console.log('Done!');
    })
})

fs.readFile('./public/js/script.js', 'utf-8', function (err, data) {
    console.log("Making changes in /public/js/script.js file");
    if (err) throw err;
    var newValue = data.replace("https://saavishkaara.com", "http://localhost:5050");

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

