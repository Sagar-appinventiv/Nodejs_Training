function getCheese()
{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            const cheese = "CHEESE";
            resolve(cheese);
        },2000);
    });
}

function makeDough(cheese)
{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
        const dough = "CHEESE + DOUGH";
        reject("Bad cheese");
        },2000);
    });
}

function makePizza(dough)
{
    return new Promise((resolve, reject)=>{
        setTimeout(() => {
            const pizza = "CHEESE + DOUGH + PIZZA";
            resolve(pizza);
        },2000);
    })
}

getCheese().then((cheese)=>{
    console.log("here is CHEESE", cheese);
    return makeDough(cheese);
}).catch((data)=>{
    console.log("error "+data);
    
}).finally((pizza)=>{
    console.log("I GOT PIZZA");
})