const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Todo = require('./models/todo');

const app = express();

console.log('Starting server setup...');

mongoose.connect('mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
  console.log('GET / request received');
  const todos = await Todo.find();
  res.render('index', { todos });
});

app.post('/add', async (req, res) => {
  console.log('POST /add request received');
  const newTodo = new Todo({
    task: req.body.task,
    deadline: req.body.deadline
  });
  await newTodo.save();
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  console.log('POST /delete/:id request received');
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log('Server setup complete');
