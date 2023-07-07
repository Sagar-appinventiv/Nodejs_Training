const express = require('express');
const app = express();

app.use(express.json());
app.get('/',(req, res)=> {

res.send("You can perform multiple operations : ADD, SUB, MUL, DIV, POW, SQRT");
})

app.post('/calculate', (req, res)=>{
    const {typeOfOperation, a, b} = req.body;

    let ans;
    switch (typeOfOperation)
    {
        case 'add':
            ans = Number(a) + Number(b);
            break;

        case 'sub':
            ans = Number(a) - Number(b);
            break;

        case 'mul':
            ans = Number(a) * Number(b);
            break;

        case 'div':
            ans = Number(a) / Number(b);
            break;

        case 'pow':
            ans = Math.pow(a, b);
            break;

        case 'mod':
            ans = Number(a) % Number(b);
            break;

        case 'sqrt':
            ans = Math.sqrt(a);
            break;

        default:
            ans = "Invalid";
    }
    res.json(`ANS : ${ans}`);
});

app.listen(80, () =>{
    console.log('Port : 8080 ');
});