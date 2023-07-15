var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(Comments === sequelize.models.Comments); // true

(async() =>{
  await Comments.sync({ });
  console.log("The table for the Comments model was just (re)created!");

})();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) {

  const comments = await Comments.findAll();
  res.render('index', {comments : comments});
});

// // about page
// app.get('/create', function(req, res) {
//     let {fname, lname} = req.query
//     console.log(req.query)
//     res.send(fname + " " + lname)
  
// });

// 생성 DB
app.post('/create', async function(req, res) {
    let {fname, lname} = req.body
    console.log(req.body)
    // Create a new user
    const jane = await Comments.create({ content: fname });
    res.redirect('/')
});

// 업데이트 DB
app.post('/update/:id', async function(req, res) {
  let { id } = req.params
  let {fname, lname} = req.body
  console.log(id)

  await Comments.update({ content: fname }, {
    where: {
      id: id
    }
  });

  res.redirect('/')
});

// 삭제하기 DB
app.post('/delete/:id', async function(req, res) {
  let { id } = req.params
  let {fname, lname} = req.body
  console.log(id)

  await Comments.destroy({
    where: {
      id: id
    }
  });

  res.redirect('/')
});


app.listen(3000);
console.log('Server is listening on port 3000');