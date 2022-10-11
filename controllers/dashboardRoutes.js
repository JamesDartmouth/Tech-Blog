const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');


// WHEN I click on the dashboard option in the navigation
// THEN I am taken to the dashboard and presented with any blog posts 
// I have already created and the option to add a new blog post


router.get('/', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id
      },
      attributes: [
        'id',
        'title',
        'body',
        'date_created'
      ],
      include: [{
        model: User,
        attributes: ['username']
      }
      ]
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('dashboard', {
      // when do we use ...?
      ...posts,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      // Post.findOne({
      //   where: {
      //       id: req.params.id
      //   },

      attributes: [
        'id',
        'title',
        'body',
        'date_created'
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        },

        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'date_created'],
          include: {
            model: User,
            attributes: ['username']
          }
        }]
    });

    const post = postData.get({ plain: true });

    res.render('post', {
// when do i need ...?
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/new', (req, res) => {
  res.render('new-post');
});



// router.get('/login', (req, res) => {
//   // If the user is already logged in, redirect the request to another route
//   if (req.session.logged_in) {
//     res.redirect('/');
//     return;
//   }
//   res.render('login');
// });

// router.get('/signup', (req, res) => {
//   res.render('signup');
// });



module.exports = router;
