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
        const dough = "CHEESE+ DOUGH";
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

async function orderPizza(){
    try{
    const cheese = await getCheese();
    console.log("Here is cheese, ", cheese);
    const dough = await makeDough(cheese);
    console.log("Here is the dough, ", dough);
    const pizza = await makePizza(dough);
    console.log("here is the pizza, ",pizza);
    } catch (err){
        console.log("error, ",err); 
    }
}
orderPizza();