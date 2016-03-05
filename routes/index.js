var express = require('express');
var passport = require('passport');
var router = express.Router();
var formidable = require('formidable'),
    http = require('http'),
    util = require('util');
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Gerador de Curriculo', user: req.user });
});

router.get('/helloworld', ensureAuthenticated
    , function(req, res)
    {
        res.render('helloworld', {title: 'Helloworld'});
    });

router.post('/helloworld', ensureAuthenticated
        ,

        function processFormFieldsIndividual(req, res) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        var fields = [];
        var form = new formidable.IncomingForm();
        //Call back when each field in the form is parsed.
        form.on('field', function (field, value) {
            console.log(field);
            console.log(value);
            fields[field] = value;
        });
        //Call back when each file in the form is parsed.
        form.on('file', function (name, file) {
            console.log(name);
            console.log(file);
            fields[name] = file;
            //Storing the files meta in fields array.
            //Depending on the application you can process it accordingly.
        });

        //Call back for file upload progress.
        form.on('progress', function (bytesReceived, bytesExpected) {
            var progress = {
                type: 'progress',
                bytesReceived: bytesReceived,
                bytesExpected: bytesExpected
            };
            console.log(progress);
            //Logging the progress on console.
            //Depending on your application you can either send the progress to client
            //for some visual feedback or perform some other operation.
        });

        //Call back at the end of the form.
        form.on('end', function () {
            res.writeHead(200, {
                'content-type': 'text/plain'
            });
            res.write('received the data:\n\n');
            res.end(util.inspect({
                fields: fields
            }));
        });
        form.parse(req);
  });


router.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback'
,passport.authenticate('facebook',
{
    successRedirect : '/helloworld',
    failureRedirect: '/login'
}),function(req, res)
{
    res.redirect('/');
});

router.get('/logout'
, function(req, res)
{
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}


module.exports = router;
