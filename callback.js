function employee(id, name, age)
{
    console.log("Hello World");
    console.log(`Employee id : ${id}, Name : ${name}, Age : ${age}`);
}
function details(callback)
{
    console.log("1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM");
    setTimeout(() => {

        
        const id = 2119;
        const name = "sagar";
        const age = 21;

        callback(id,name,age);
        console.log("hello");
        
    }, 3000);
}
details(employee);

console.log("Appinventiv Technologies Pvt Ltd");