const express = require('express');

const calc = express();
const port = 5000;

calc.use(express.json());

const add = (a, b)=>{
    return a+b;
}

const sub = (a, b)=>{
    return a-b;
}

const mul = (a, b)=>{
    return a*b;
}

const div = (a, b)=>{
    return a/b;
}

const mod = (a, b)=>{
    return a%b;
}

const pow = (a, b)=>{
    return Math.pow(a, b);
}

const sqrt = (a)=>{
    return Math.sqrt(a);
}


calc.get("/",(req, res)=>{
    res.send("You can perform several operations such as : (addition, Subtraction, Multiplication, Division, Modulo, Power, squareRoot)");
})

calc.post("/add",(req,res)=>{
    console.log(req.body, 'req');
    let ans = add(req.body.a,req.body.b);
    res.send(`sum of ${req.body.a} and ${req.body.b} is : ${ans}`);
})
calc.post("/sub",(req,res)=>{
    let ans = sub(req.body.a,req.body.b);
    res.send(`subtraction of ${req.body.a} and ${req.body.b} is : ${ans}`);
})
calc.post("/mul",(req,res)=>{
    let ans = mul(req.body.a,req.body.b);
    res.send(`multiplication of ${req.body.a} and ${req.body.b} is : ${ans}`);
})
calc.post("/div",(req,res)=>{
    let ans = div(req.body.a,req.body.b);
    res.send(`Division of ${req.body.a} and ${req.body.b} is : ${ans}`);
})
calc.post("/mod",(req,res)=>{
    let ans = mod(req.body.a, req.body.b);
    res.send(`Modulo of ${req.body.a}, and ${req.body.b} is : ${ans}`);
})
calc.post("/pow",(req,res)=>{
    let ans = pow(req.body.a, req.body.b);
    res.send(`${req.body.a} of power ${req.body.b} is : ${ans}`);
})
calc.post("/sqrt",(req,res)=>{
    let ans = sqrt(req.body.a);
    res.send(`squareRoot of ${req.body.a} is : ${ans}`);
})
calc.listen(port,(error)=>{
    console.log(`i m listening at port ${port}`);
})

