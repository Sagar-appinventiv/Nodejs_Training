const http = require('http');
const hostname = 'localhost';

const port = 3200;

const vanilla = http.createServer((req, res)=>{
    res.end("Hello World");

})

vanilla.listen(port, hostname, ()=>{
    console.log(`PORT : ${port}`);
})