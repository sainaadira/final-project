// route js spits out a function

module.exports = function(app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('login.ejs', {

    });
  });

  // to get the main page

  app.get('/mainpage', isLoggedIn, function(req, res) {
    db.collection('feedback').find().toArray((err, result) => {
      console.log('main page feedback', result)
      if (err) return console.log(err)
      res.render('mainpage.ejs', {
        feedback: result,
        user: req.user
        // user: req.user,

      })
    })
  });



  // PORTFOLIO SECTION =========================
  app.get('/portfolio', isLoggedIn, function(req, res) {
    db.collection('posts').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('portfolio.ejs', {
        user: req.user,
        photo: req.photo

      })
    })
  });


  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });



  // MAIN  PAGE GET REQUEST =========================

  // POST REQUESTS=========================================

  // add any info from the signup page that i want to pull from database
  // name and photos



  // app.post('/signup', (req, res) => {
  //   db.collection('users').save({
  //     firstname: req.body.firstname,
  //     lastname: req.body.lastname,
  //     pronouns: req.body.pronouns,
  //     email: req.body.email
  //     // experience: req.body.experience,
  //     // gain: req.body.gain,
  //     // photo1: req.body.photo1,
  //     // photo2: req.body.photo2
  //
  //   }, (err, result) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //     res.redirect('/profile')
  //   })
  // })


  // MAIN PAGE POST COMMENTS==================

  app.post('/mainpage', (req, res) => {
    db.collection('feedback').save({
      comments: req.body.comments,
      author: req.user.firstname +  ' ' + req.user.lastname
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database ******************', result)

      res.json({
        comments: req.body.comments,
        author: req.body.author
      })
    })
  })

  // save document to feedback collection and document had property called comments
  // getting comments from request using reqb.body .comments
  // author is received from users logged in sessiion


  // MAIN PAGE UPDATE COMMENTS===================

  app.put('/mainpage', (req, res) => {
    db.collection('feedback')
      .findOneAndUpdate({
        comments: req.body.comments,
      }, {
        sort: {
          _id: -1
        },
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
  })


  // MAIN PAGE DELETE COMMENTS =====================
  app.delete('/mainpage', (req, res) => {
    db.collection('feedback').findOneAndDelete({
      comments: req.body.comments,
      author: req.body.comments,
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/portfolio', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });
  const multer = require('multer')
  const upload = multer({
    dest: 'public/portfolio-img/'
  });


  const maxUpload = 2
  const cpUpload = upload.array('portfolio', maxUpload)

   app.post('/signup', function(req,res){
     var newUserSchema = new Schema();
     newUserSchema.img.data= fs.readFileSync(req.files.userPhoto.path)
     newUserSchema.img.contentType= 'image/png';
     newUserSchema.save()
   })



//
//   app.use(multer({ dest: ‘./uploads/’,
//  rename: function (fieldname, filename) {
//    return filename;
//  },
// }));


  // process the signup form
  app.post('/signup', [cpUpload, passport.authenticate('local-signup', {
    successRedirect: '/mainpage', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  })], (req, res) => {

    // console.log('uploaded files', req.files);
    // res.redirect('/mainpage')
  })
  // ,/* cpUpload,*/ function(req, res) {
  //   console.log('these are port files', req.files)
  // });
  //

  //
  // app.post('/signup', (req, res) => {
  //     console.log('muli-part body', req.body);
  //     res.send("thanks")
  // })





  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  console.log('running isloggedin');

  if (req.isAuthenticated()) {

    console.log('log in succeeded');
    return next();

  }
  console.log('log in failed');
  res.redirect('/');
}
