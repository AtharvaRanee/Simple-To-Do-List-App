const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override')
const { v4: uuidv4 } = require('uuid');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'todo_list',
    password: 'Atharva@2004',
});

app.get("/", (req, res) => {
    console.log("Request Working");
    res.render("home.ejs");
});

app.get("/home", (req, res) => {
    let q = 'SELECT * FROM todos ';
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let todo = result;
            res.render("home.ejs", { todo });
        });
    } catch (err) {
        console.log("Erorr Found: ", err)
    }
});

app.get("/home/:id", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM todos WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let todo = result[0];
            res.render("show.ejs", { todo });
        });
    } catch (err) {
        console.log("Erorr Found: ", err)
    }
});

app.get("/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/home", (req, res) => {
    let { title, content } = req.body;
    let id = uuidv4();

    let q = `INSERT INTO todos (id, title, content) VALUES (?, ?, ?)`;
    let data = [id, title, content];

    try {
        connection.query(q, data, (err, result) => {
            if(err) throw err;
            res.redirect("/home");
        })
    }catch(err){
        console.log("Error Found: ",err);
    }
});

app.get("/show/:id/edit", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM todos WHERE id='${id}'`;
    
    try{
        connection.query(q, (err,result) => {
        if(err) throw err;
        let todo = result[0];
        res.render("edit.ejs",{todo});
    })
    }catch(err){
        console.log(err);
    }
});

app.patch("/home/:id", (req,res) => {
    let {id} = req.params;
    let {title, content} = req.body;
    let q = `UPDATE todos SET title='${title}', content='${content}' WHERE id='${id}'`;
    try{
        connection.query(q, (err,result) => {
        if(err) throw err;
        res.redirect("/home");
    })
    }catch(err){
        console.log(err);
    }
});

app.delete("/delete/:id", (req,res) => {
    let {id} = req.params;
    let q = `DELETE FROM todos WHERE id='${id}'`;
    try{
        connection.query(q, (err,result) => {
        if(err) throw err;
        res.redirect("/home");
    })
    }catch(err){
        console.log(err);
    }
})

app.listen(port, () => {
    console.log("App running on port 8080.")
});