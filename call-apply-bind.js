let naam = {
    firstName : "Sagar",
    lastName : "Sati",
}

let printName = function (city, state){
    console.log(this.firstName + " " + this.lastName + ", CITY : " + city + "," + state);
}

printName.call(naam,"New Delhi ", "Delhi");

let name2 = {
    firstName : "Shinchan",
    lastName : "Nohara",
}
printName.call(name2, "Kasukabe", "Japan");

printName.apply(name2, ["Kasukabe", "Japan"]);

let printMyName = printName.bind(name2, "Kasukabe", "Japan");
printMyName();