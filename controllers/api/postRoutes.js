const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');



router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      attributes: [
        'id',
        'title',
        'body',
        'date_created'
      ],
      // order: [
      //   ['created_at', 'DESC']
      // ],
      include: [{
        model: User,
        attributes: ['username']
      },
        // {
        //   model: Comment,
        //   attributes: ['id', 'comment_text', 'post_id', 'user_id', 'date_created'],
        //   include: {
        //     model: User,
        //     attributes: ['username']
        //   }
        // }
      ]
    });

    // const posts = postData.map((post) => post.get({ plain: true }));
    // Pass serialized data and session flag into template
    // res.render('homepage', {
    //   posts,
    //   logged_in: req.session.logged_in
    // });

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      // do i need this to make sure loggin in?--------------------
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      title: req.body.title,
      body: req.body.body,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.put('/:id', withAuth, async (req, res) => {
  try {
    const updatePost = await Post.update({
      title: req.body.title,
      body: req.body.body
    }, {
      where: {
        id: req.params.id
      }
      // ...req.body,
      // user_id: req.session.user_id,
    });

    if (!updatePost) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(updatePost);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deletePost = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletePost) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(deletePost);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;


