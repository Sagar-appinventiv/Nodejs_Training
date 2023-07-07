const fs = require("fs");
const express = require("express");;
const multer = require("multer");
const { error } = require("console");
const newfilepath =`./backup/newFile_${Date.now()}.txt`;

const app = express();

const port = 10001;

app.use(express.urlencoded({extended:false}));

const uploading = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'uploads');
        },
        filename: function(req, file, cb){
            cb(null,`file${file.fieldname}.txt`);
        }
    })
}).any();

/***************** DELETE API *****************/
app.delete("/delete/:no1/:no2",(req,res)=>{
    fs.unlink(`./uploads/file${req.params.no1}.txt`,(error)=>{
        console.log("deleted")
    });
    fs.unlink(`./uploads/file${req.params.no2}.txt`,(error)=>{
        console.log("deleted");
    });
    res.send("Deleted successfully !");
})

/***************** DISPLAY API *****************/
app.get("/display",(req,res)=>{
    fs.readFile(newfilepath,(error,data)=>{
        if(error){
            console.log(error);
        }
        else{
            res.send(data);
        }
    })
    
})

/***************** MERGE API *****************/
app.post("/merge/:no1/:no2",(req, res)=>{
       const file1Path = `./uploads/file${req.params.no1}.txt`;
       const file2Path = `./uploads/file${req.params.no2}.txt`;

      
       fs.readFile(file1Path,(error, data)=>{
        if(error){
            console.log(error);
        }
        else{
            fs.writeFile(newfilepath, data, (error) =>{
                if(error){
                    console.log(error);
                }
            });
            fs.readFile(file2Path,(error,data)=>{
                if(error){
                    console.log(error);
                }
                else{
                    fs.appendFile(newfilepath,` ${data}`,(error)=>{
                        if(error){
                            console.log(error);
                        }
                    });
                }
                console.log("new file created");
                res.send("new file created");
               })
            }
       });
});

/***************** UPLOAD API *****************/
app.post("/upload",uploading,(req, res)=>{
   res.send("uploaded");
});

app.listen(port,(error)=>{
    console.log(`Server Listening to PORT : ${port}`);
})



