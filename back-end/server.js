const express = require('express');
const bodyParser = require('body-parser');
const argon2 = require("argon2");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/newSocial', {
  useNewUrlParser: true,
});

const multer = require('multer')
const upload = multer({
  dest: '../front-end/new-social/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

const postSchema = new mongoose.Schema({
  userName: String,
  country: String,
  path: String,
  tags: [],
  description: String,
  color: String,
  heart: String,
});

const Post = mongoose.model('Post', postSchema);

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
  username: String,
  following: [],
  bio: String,
});





userSchema.pre('save', async function(next) {
  if (!this.isModified('password'))
    return next();

  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await argon2.verify(this.password, password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = mongoose.model('User', userSchema);

const validUser = async (req, res, next) => {
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in"
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID
    });
    if (!user) {
      return res.status(403).send({
        message: "not logged in"
      });
    }

    req.user = user;
  } catch (error) {
    return res.status(403).send({
      message: "not logged in"
    });
  }

  next();
};


app.post('/api/users', async (req, res) => {

  if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password)
    return res.status(400).send({
      message: "first name, last name, username and password are required"
    });

  try {

    const existingUser = await User.findOne({
      username: req.body.username
    });
    if (existingUser)
      return res.status(403).send({
        message: "username already exists"
      });

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      following: [],
      bio: "No Bio Yet",
    });
    await user.save();

    req.session.userID = user._id;

    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});



app.post('/api/users/login', async (req, res) => {

  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  try {
    const user = await User.findOne({
      username: req.body.username
    });
    if (!user)
      return res.status(403).send({
        message: "username or password is wrong"
      });

    if (!await user.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });

    req.session.userID = user._id;

    return res.send({
      user: user
    });

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


app.get('/api/users', validUser, async (req, res) => {
  try {
    res.send({
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


app.delete("/api/users", validUser, async (req, res) => {
  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});




// app.post('/api/users', async (req, res) => {
//     const user = new User({
//       user: req.body.user,
//       following: [],
//       bio: req.body.bio,
//   });
//   try {
//     await user.save();
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

app.post('/api/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }
  var newPath = "/images/" + req.file.filename;
  res.send({
    path: newPath
  });
});

app.put('/api/posts/:id', async (req, res) => {
  try {
      var post = await Post.findOne({
        _id: req.params.id,
      });
      if(req.body.heart == true) {
        post.heart = "colorHeart.png";
      }
      else {
        post.heart = "noColorHeart.png";
      }
      post.save();
      res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/posts', async (req, res) => {
    const post = new Post({
      userName: req.body.userName,
      country: req.body.country,
      path: req.body.path,
      tags: req.body.tags,
      description: req.body.description,
      color: req.body.color,
      heart: req.body.heart,
  });
  try {
    await post.save();
    res.send({post:post});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    let posts = await Post.find();
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});



app.put('/api/users/:id', async (req, res) => {
  try {
    if(req.body.follow == "bio") {
      var user = await User.findOne({
        _id: req.params.id
      });
      user.bio = req.body.bio;
      user.save();
      res.sendStatus(200);
    }
    else {
      if(req.body.follow == true) {
        var user = await User.findOne({
           _id: req.params.id
        });
        user.following.push(req.body.userName);
        user.save();
        res.sendStatus(200);
      }
      else {
        var user = await User.findOne({
          _id: req.params.id
        });
        for(var i = 0; i < user.following.length; i++) {
          if(user.following[i] == req.body.userName) {
            user.following.splice(i, 1);
            break;
          }
        }
        user.save();
        res.sendStatus(200);
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.get('/api/users/:id', async (req, res) => {
  try {
    var user = await User.findOne({
      _id: req.params.id
    });
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.listen(3005, () => console.log('Server listening on port 3005!'));
