const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mM70197019',
  database: 'habit'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get('/new', (req, res) => {
	res.render('new.ejs');
});

app.get('/list', (req, res) => {
	connection.query(
		'SELECT * FROM habit_list',
		(error, results) => {
			res.render('list.ejs', {habit_list: results});
		}
	);
});

app.post('/create', (req, res) => {

	connection.query(
		'INSERT INTO habit_list(name, content) VALUES(?, ?)',
		[req.body.habitListName, req.body.habitListContent],
		(error, results) => {
			res.redirect('/list');
		}
	);
});

app.post('/delete/:id', (req, res) => {
	connection.query(
		'DELETE FROM habit_list WHERE id= ?',
		[req.params.id],
		(error, results) => {
			res.redirect('/list');
		});
});



app.post('/judge/:id', (req, res) => {
	connection.query(
		'UPDATE habit_list SET judge = (CASE WHEN judge = 0 THEN 1 WHEN judge = 1 THEN 0 ELSE NULL END) WHERE id = ?',
		[req.params.id],
		(error, results) => {
			res.redirect('/list');
		});
		
	}
);



app.get('/edit/:id', (req, res) => {
	connection.query(
		'SELECT * FROM habit_list WHERE id = ?',
		[req.params.id],
		(error, results) => {
			res.render('edit.ejs', {habit_list: results[0]});
		}
	);
});


app.post('/update/:id', (req, res) => {
	connection.query(
		'UPDATE habit_list SET name = ?, content = ? WHERE id = ?',
		[req.body.habitListName, req.body.habitListContent, req.params.id],
		(error, results) => {
			res.redirect('/list');
		});
});


app.listen(8888);