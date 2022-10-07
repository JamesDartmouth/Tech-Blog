const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');


// THEN I am taken to the homepage and presented with 
// existing blog posts that include the post title and the date created----------------

router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({

    //   attributes: [
    //     'id',
    //     'title',
    //     'content',
    //     'created_at'
    // ],
    // include: [{
    //         model: Comment,
    //         attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
    //         include: {
    //             model: User,
    //             attributes: ['username']
    //         }
    //     },
    //     {
    //         model: User,
    //         attributes: ['username']
    //     }
    // ]

      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {

      // Post.findOne({
      //   where: {
      //       id: req.params.id
      //   },

      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// THEN I am taken to the dashboard and presented 
// with any blog posts I have already created and the option to add a new blog post


router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

module.exports = router;
