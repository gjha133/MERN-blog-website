const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const colors = require('colors')
const User = require('./models/User')
const Post = require('./models/Post')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/connectDB.js')
const multer = require('multer');

connectDB()
const uploadMiddleware = multer({ dest: 'uploads/' });

const app = express()
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://blog-app-sooty-chi.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(cors({ credentials: true, origin: "https://blog-app-sooty-chi.vercel.app" }))

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'));

const salt = bcrypt.genSaltSync(10)
const secret = process.env.SECRET

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });

    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      return res.status(400).json('User not found');
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (!passOk) {
      return res.status(400).json('Wrong password');
    }

    const token = jwt.sign({ username, id: userDoc._id }, secret);
    res.cookie('token', token).json({
      id: userDoc._id,
      username,
    });

  } catch (err) {
    res.status(500).json('Server error');
  }
});


app.get('/profile', (req, res) => {
  const { token } = req.cookies
  try {
    const info = jwt.verify(token, secret);
    res.json(info)
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('token').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    const info = await jwt.verify(token, secret);

    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id
    });

    res.json(postDoc);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    const info = jwt.verify(token, secret);

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      return res.status(400).json('You are not the author');
    }

    const updatedPost = {
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    };

    const updatedPostDoc = await Post.findByIdAndUpdate(id, updatedPost, { new: true });
    res.json(updatedPostDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal server error');
  }
});



app.get('/post', async (req, res) => {
  const posts = await Post.find()
    .populate('author', ['username'])
    .sort({ createdAt: -1 })
    .limit(20)
  res.json(posts)
})

app.get('/post/:id', async (req, res) => {
  try {
    const { id } = req.params
    const postDoc = await Post.findById(id).populate('author', ['username'])
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' })
    }
    res.json(postDoc)
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' })
  }
})



const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgBlue.white)
})
