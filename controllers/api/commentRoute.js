const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

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
        comments, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.get('/', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const commentData = await User.findAll(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Post }],
      });
  
      const comment = commentData.get({ plain: true });
  
      res.status(200).json(commentData);
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
