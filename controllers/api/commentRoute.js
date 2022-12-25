const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      attributes: [
        'id',
        'user_id',
        'post_id',
        'comment_text',
        'date_created'
      ],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
    // const comments = commentData.map((comment) => comment.get({ plain: true }));
    // res.render('homepage', {
    //   comments,
    //   logged_in: req.session.logged_in
    // });
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// THEN I am able to view comments but I am prompted to log in again 
// before I can add, update, or delete comments-----------------------------

router.get('/:id', async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      where: {
        id: req.params.id
      }
    });

    res.status(200).json(commentData);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      // do i need this to make sure loggin in?--------------------
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      post_id: req.body.post_id,
      comment_text: req.body.comment_text,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});



router.put('/:id', withAuth, async (req, res) => {
  try {
    const updateComment = await Comment.update({
      comment_text: req.body.comment_text
    }, {
      where: {
        id: req.params.id
      }
      // ...req.body,
      // user_id: req.session.user_id,
    });

    if (!updateComment) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(updateComment);
  } catch (err) {
    res.status(400).json(err);
  }
});



router.delete('/:id', withAuth, async (req, res) => {
  try {
    const deleteComment = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!deleteComment) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }

    res.status(200).json(deleteComment);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
