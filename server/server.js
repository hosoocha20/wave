

const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require('uuid');
const app = express();
const cors = require("cors");
const pool = require('./db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// app.get('/', (req,res) => {
//     res.send('hello world!')
// })

//middlewares
app.use(cors());
app.use(express.json());

//Sign up
app.post('/signup', async(req, res)=>{
    const {email, pw, firstName, lastName} = req.body

    const salt = bcrypt.genSaltSync(10)
    const hashed_password = bcrypt.hashSync(pw, salt)
    try{
        const signUp = await pool.query('INSERT INTO users(email, first_name, last_name, hashed_password) VALUES($1, $2, $3, $4)', [email, firstName, lastName, hashed_password])
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})
        res.json({email, token})
    }catch(err){
        console.error(err)
        if (err) {
            res.json({ detail: 'An account with this email already exists.'})
          }
    }
})

//Log in
app.post('/login', async(req, res)=>{
    const {email, pw} = req.body
    try{
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        //if this does not exist
        if (!users.rows.length)
            return res.json({ detail: 'This account does not exist. Please try again.'})
        const success = await bcrypt.compare(pw, users.rows[0].hashed_password)
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})
        if (success){
            res.json({'email' : users.rows[0].email, token})
        } else{
            res.json({detail: 'Your account or password is incorrect. Please try again.'})
        }
        
    }catch(err){
        console.error(err)
    }
})

//get User Details
app.get('/userDetails/:userEmail', async (req,res)=> {
    const { userEmail }= req.params;
    try{
        const userDetails = await pool.query('SELECT * FROM users WHERE email = $1', [userEmail])
        res.json({firstName: userDetails.rows[0].first_name, lastName: userDetails.rows[0].last_name})
    } catch (err) {
        console.error(err)
    }
})

//TodoList CRUD

//get Todo Lists
app.get('/todolists/:userEmail', async (req,res)=> {
    const { userEmail }= req.params;
    try{
        const todoList = await pool.query('SELECT * FROM todolists WHERE user_email = $1 ORDER BY date ASC', [userEmail])
        res.json(todoList.rows)
    } catch (err) {
        console.error(err)
    }
})
//create Todo list
app.post('/todoLists' , async (req, res)=>{
    const {list_title, user_email, date, bg} = req.body
    const list_id = uuidv4()
    try{
        const newList = await pool.query('INSERT INTO todolists(list_id, list_title, user_email, date, bg) VALUES($1, $2, $3, $4, $5)', [list_id, list_title, user_email, date, bg])
        res.json(newList)
    }catch(err){
        console.error(err)
    }
})
///Delete Todo List
app.delete('/todoLists/:list_id', async(req, res)=>{
    const {list_id} = req.params;
    try{
        const deleteList = await pool.query('DELETE FROM todolists WHERE list_id = $1', [list_id])
        res.json(deleteList)
    }catch(err){
        console.error(err)
    }
})
//Update Todo List
app.put('/todoLists/:list_id', async(req,res)=>{
    const {list_id} = req.params
    const {list_title} = req.body
    try{
        const editList = await pool.query('UPDATE todolists SET list_title = $1 WHERE list_id = $2', [list_title, list_id])
        res.json(editList)
    }catch(err){
        console.error(err)
    }
})
//change todolist bg
app.put('/todoLists/bg/:list_id', async(req,res)=>{
    const {list_id} = req.params
    const {bg} = req.body
    try{
        const editListBg = await pool.query('UPDATE todolists SET bg = $1 WHERE list_id = $2', [bg, list_id])
        res.json(editListBg)
    }catch(err){
        console.error(err)
    }
})

//Todos CRUD
//get todos
app.get('/todos/:list_id/all', async (req,res)=> {
    const { list_id }= req.params;
    try{
        const todos = await pool.query('SELECT * FROM todos WHERE list_id= $1', [list_id])
        res.json(todos.rows)
    } catch (err) {
        console.error(err)
    }
})

//get todo based on completed state & sort option
app.get('/todos/:list_id/:taskState/:sortOption', async (req,res)=> {
    const { list_id, taskState, sortOption }= req.params;
    if(sortOption === "Recently Added"){
        try{
            const todos = await pool.query('SELECT * FROM todos WHERE (list_id = $1 AND completed = $2) ORDER BY date DESC', [list_id, taskState])
            res.json(todos.rows)
        } catch (err) {
            console.error(err)
        }
    }
    else{
        try{
            const todos = await pool.query('SELECT * FROM todos WHERE (list_id = $1 AND completed = $2) ORDER BY title ASC', [list_id, taskState])
            res.json(todos.rows)
        } catch (err) {
            console.error(err)
        }
    }

})
//get todo based on important state & sort Option
app.get('/todos/:list_id/:sortOption/tasks/starred', async (req,res)=> {
    const { list_id, sortOption }= req.params;
    if (sortOption === "Recently Added"){
        try{
            const todos = await pool.query('SELECT * FROM todos WHERE (list_id = $1 AND important = TRUE) ORDER BY date DESC', [list_id])
            res.json(todos.rows)
        } catch (err) {
            console.error(err)
        }
    }
    else{
        try{
            const todos = await pool.query('SELECT * FROM todos WHERE (list_id = $1 AND important = TRUE AND completed = FALSE) ORDER BY title ASC', [list_id])
            res.json(todos.rows)
        } catch (err) {
            console.error(err)
        }
    }

})

//create todo
app.post('/todos', async (req,res) =>{
    const { list_id, user_email, title, date, completed, important, myDay } = req.body;
    const todo_id = uuidv4()
    try{
        const newTask = await pool.query('INSERT INTO todos(todo_id, list_id, user_email, title, date, completed, important, myDay) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [todo_id, list_id, user_email, title, date, completed, important, myDay])
        res.json(newTask)
    } catch (err){
        console.error(err);
    }
})

//edit todo
app.put('/todos/:todo_id', async(req, res) =>{
    const { todo_id } = req.params;
    const { title } = req.body
    try{
        const editTodo = await pool.query('UPDATE todos SET title = $1 WHERE todo_id = $2', [title, todo_id])
        res.json(editTodo);
    } catch(err) {
        console.error(err)
    }
})
//mark/remove Task as Important
app.put('/todos/:todo_id/important', async(req, res) => {
    const { todo_id } = req.params;
    const { important } = req.body;
    try{
        const importantTodo = await pool.query('UPDATE todos SET important = $1 WHERE todo_id = $2', [important, todo_id])
        res.json(importantTodo)
    }catch(err){
        console.error(err)
    }
})
//mark/remove Task as Complete
app.put('/todos/:todo_id/complete', async(req, res) => {
    const { todo_id } = req.params;
    const { complete } = req.body;
    try{
        const completeTodo = await pool.query('UPDATE todos SET completed = $1 WHERE todo_id = $2', [complete, todo_id])
        res.json(completeTodo)
    }catch(err){
        console.error(err)
    }
})
//Add Task to MyDay by making myDay = truee
app.put('/todos/:todo_id/myDay', async(req,res) =>{
    const {todo_id} = req.params
    const {myDay} = req.body
    try{
        const editMyday = await pool.query('UPDATE todos SET myday = $1 WHERE todo_id = $2', [myDay, todo_id])
        res.json(editMyday)
    }catch(err){
        console.error(err)
    }
})

//delete todo
app.delete('/todos/:todo_id', async(req, res) => {
    const { todo_id } = req.params;
    try{
        const deleteTodo = await pool.query('DELETE FROM todos WHERE todo_id = $1', [todo_id])
        res.json(deleteTodo);
    } catch (err) {
        console.error(err);
    }
})


//MyDay Rest API
//get all tasks that are added to My Day
app.get('/myDay/:userEmail', async(req, res) =>{
    const {userEmail} = req.params
    try{
        const getAllMyDay = await pool.query(`SELECT todo_id, todos.list_id, todos.user_email, title, todos.date, completed, myday, list_title
                                            FROM todos
                                            INNER JOIN todolists
                                            on todolists.list_id = todos.list_id
                                            WHERE (todos.user_email = $1 AND myday=TRUE)
                                            UNION ALL
                                            SELECT todo_id, list_id, user_email, title, date, completed, myday, list_title
                                            FROM task
                                            WHERE (user_email = $1 AND myday=TRUE)
                                            ORDER BY completed ASC, date DESC`, [userEmail])
        res.json(getAllMyDay.rows)
    }catch(err){
        console.error(err)
    }
})

//Create task from MyDay into Task
app.post('/myDay', async(req,res)=>{
    const {userEmail, title, date, completed, myDay} = req.body
    const todo_id = uuidv4()
    try{
        const postMyDay = await pool.query("INSERT INTO task(todo_id, user_email, title, date, completed, list_title, myday, list_id) VALUES($1, $2, $3, $4, $5, 'Task', $6, 'Task')", 
        [todo_id, userEmail, title, date, completed, myDay])
        res.json(postMyDay)
    }catch(err){
        console.error(err)
    }
})

//Remove My List tasks from myDay
app.put('/myDay/myLists/:todo_id', async(req, res) =>{
    const {todo_id} = req.params;
    const {myDay} = req.body
    try{
        const removeMyday = await pool.query('UPDATE todos SET myday = $1 WHERE todo_id = $2', [myDay, todo_id])
        res.json(removeMyday)
    }catch(err){
        console.error(err)
    }
})
//Remove Tasks tasks from MyDay
app.put('/myDay/tasks/:todo_id', async(req, res) =>{
    const {todo_id} = req.params;
    const {myDay} = req.body
    try{
        const removeMyday = await pool.query('UPDATE task SET myday = $1 WHERE todo_id = $2', [myDay, todo_id])
        res.json(removeMyday)
    }catch(err){
        console.error(err)
    }
})
//Check a myDay Task
app.put('/myDay/completed/myLists/:todo_id', async(req, res) =>{
    const {todo_id} = req.params;
    const {completed} = req.body
    try{
        const completeMyday = await pool.query('UPDATE todos SET completed = $1 WHERE todo_id = $2', [completed, todo_id])
        res.json(completeMyday)
    }catch(err){
        console.error(err)
    }
})
app.put('/myDay/completed/tasks/:todo_id', async(req, res) =>{
    const {todo_id} = req.params;
    const {completed} = req.body
    try{
        const completeMyday = await pool.query('UPDATE task SET completed = $1 WHERE todo_id = $2', [completed, todo_id])
        res.json(completeMyday)
    }catch(err){
        console.error(err)
    }
})

app.listen(PORT, () =>{
    console.log(`listening to PORT ${PORT}`)
})