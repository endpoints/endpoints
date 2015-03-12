const fs = require('fs');
const markdown = require('markdown').markdown;
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/guides', function(req, res){
  res.render('guides/index');
});

app.get('/guides/:topic', function(req, res){
  try {
    var topic_doc = fs.readFileSync(__dirname + '/data/guides/' + req.params.topic + '.md', 'utf8');
    var topic_data = markdown.toHTML(topic_doc);
  } catch(e) {
    console.log(e);
  }
  res.render('guides/topic', { topic_data: topic_data });
});

app.get('/tutorial', function(req, res){
  res.render('tutorial/index');
});

app.get('/tutorial/:step', function(req, res){
  try {
    var step_doc = fs.readFileSync(__dirname + '/data/tutorial/' + req.params.step + '.md', 'utf8');
    var step_data = markdown.toHTML(step_doc);
  } catch(e) {
    console.log(e);
  }
  res.render('tutorial/step', { step_data: step_data });
});

app.get('/about', function(req, res){
  res.render('about');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

module.exports = app;
