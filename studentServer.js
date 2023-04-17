let express=require('express');
let app=express();
app.use(express.json());
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD'
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
const port= process.env.PORT || 2411;
app.listen(port, ()=>console.log(`Node app listening on port ${port}!`));

let {studentsData}=require('./studentData.js');
let fs=require('fs');
const { json } = require('express');
let fname='students.json';
app.get("/svr/resetData",function(req, res){
    let data=JSON.stringify(studentsData);
    fs.writeFile(fname, data, function(err){
        if(err) res.status(404).send(err);
        else res.send("Data in file is reset");
    });
});

app.get("/svr/students", (req, res)=>{
    fs.readFile(fname, 'utf-8', (err, data)=>{
        if(err) res.status(404).send(err);
        else {
            let studentsArray=JSON.parse(data);
            res.send(studentsArray);
        }
    })
})

app.get("/svr/students/:id", (req, res)=>{
    let id=+req.params.id;
    fs.readFile(fname, "utf-8", (err, data)=>{
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let student=studentsArray.find(st=>st.id===id);
            if(student) res.send(student);
            else res.status(404).send("No student found");
        }
    });
});


app.get("/svr/students/course/:name", (req, res)=>{
    let course=req.params.name;
    fs.readFile(fname, "utf-8", (err, data)=>{
        if(err) res.status(404).send(err);
        else{
            let studentsArray=JSON.parse(data);
            let arr1=studentsArray.filter(st=>st.course==course);
            res.send(arr1);
        }
    });
});

app.post("/svr/students", (req, res)=>{
    let body=req.body;
    fs.readFile(fname, 'utf-8', (err, data)=>{
        if(err) res.status(404).send(err);
        else {
            let studentsArray=JSON.parse(data);
            let maxid=studentsArray.reduce((acc, curr)=>(curr.id>acc?curr.id:acc),0);
            let newid=maxid+1;
            let newStudent={...body, id:newid};
            studentsArray.push(newStudent);
            let data1=JSON.stringify(studentsArray);
            fs.writeFile(fname, data1, (err)=>{
                if(err) res.status(404).send(err);
                else res.send(newStudent);
            });
        }
    });
});

app.put("/svr/students/:id", (req, res)=>{
    let body=req.body;
    let id=+req.params.id;

    fs.readFile(fname, 'utf-8', (err, data)=>{
        if(err) res.status(404).send(err);
        else {
            let studentsArray=JSON.parse(data);
            let index=studentsArray.findIndex(st=>st.id===id);
            if(index>=0){
                let updatedStudent={...studentsArray[index], ...body};
                studentsArray[index]=updatedStudent;
                let data1=JSON.stringify(studentsArray);
                fs.writeFile(fname, data1, (err)=>{
                    if(err) res.status(404).send(err);
                    else res.send(updatedStudent);
                })
            }
            else res.status(404).send("No Student Found")
        }
    });
});

app.delete("/svr/students/:id", (req, res)=>{
    let id=+req.params.id;
    fs.readFile(fname, 'utf-8', (err, data)=>{
        if(err) res.status(404).send(err);
        else {
            let studentsArray=JSON.parse(data);
            let index=studentsArray.findIndex(st=>st.id===id);
            if(index>=0){
                let deleteStudent=studentsArray.splice(index, 1);
                let data1=JSON.stringify(studentsArray);
                fs.writeFile(fname, data1, (err)=>{
                    if(err) res.status(404).send(err);
                    else res.send(deleteStudent);
                })
            }
            else res.status(404).send("No Student Found")
        }
    });
});