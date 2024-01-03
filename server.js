var express = require('express');
var env = require('dotenv').config()
var ejs = require('ejs');
var path = require('path'); 
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session'); 
var MongoStore = require('connect-mongo')(session);

// q1OmCaOrMz1wsyzd
// mongodb+srv://mohitbagdi280:q1OmCaOrMz1wsyzd@cluster0.f4nbmgb.mongodb.net/?retryWrites=true&w=majority

mongoose.connect('mongodb+srv://mohitbagdi280:q1OmCaOrMz1wsyzd@cluster0.f4nbmgb.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => { 
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection');
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); 
db.once('open', function () {
}); 
 
app.use(session({
  secret: '123mohit',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

var index = require('./routes/index');
app.use('/', index);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Server is started at port no. - ' + PORT);
});
