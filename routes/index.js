var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Contact = require('../models/contact');


const bcrypt = require('bcrypt');

const securePassword = async (password) => {
	try {
		const PasswordHash = await bcrypt.hash(password, 10)

		return PasswordHash;
	}
	catch (error) {
		console.log(error.message);
	}
}




router.get('/', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/', async function (req, res, next) {
	console.log(req.body);
	User.findOne({ email: req.body.email }, async function (err, data) {
		if (data) {

			const passwordMatched = await bcrypt.compare(req.body.password, data.password);

			if (passwordMatched) { 
				req.session.userId = data.unique_id;
				res.redirect('/home'); 

			} else {
				res.send({ "Error": "Wrong password!" });
			}
		} else {
			res.send({ "Error": "This Email Is not regestered!" });
		}
	});
});



router.get('/register', function (req, res, next) {
	return res.render('register.ejs');
});

router.post('/register', function (req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, function (err, data) {
				if (!data) {
					var c;
					User.findOne({}, async function (err, data) {

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						const securePass = await securePassword(personInfo.password);

						var newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							password: securePass
						});

						newPerson.save(function (err, Person) {
							if (err)
								console.log(err);
							else
								console.log('Success'); 
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});




router.get('/home', function (req, res, next) {
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			//console.log("found");
			return res.render('data.ejs', { "name": data.username});
		}
	});
});


router.post('/home', function (req, res, next) {
	var personInfo = req.body;
	if (!personInfo) {
		res.redirect('/home');
	}
	else {
		var newMesage = new Contact({
			name: personInfo.name,
			email: personInfo.email,
			Phone: personInfo.phone, 
			InquiryType: personInfo.InquiryType,
			message: personInfo.message
		}); 
		 

		newMesage.save(function (err, Person) {
			if (err)
				console.log(err);
			else
				console.log('Success');
		});

		res.send({ "Success": "We Will reach you soon." });
	}

});



router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
		// delete session object
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({ email: req.body.email }, async function (err, data) {
		console.log(data);
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
			// res.send({"Success":"Success!"});
			if (req.body.password == req.body.passwordConf) {
				const securePass = await securePassword(req.body.password);
				data.password = securePass;

				data.save(function (err, Person) {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});




module.exports = router;