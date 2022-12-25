const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: [
        'id',
        'username',
      ],
      // do i need this if i only selectively bring above?---------
      attributes: { exclude: ['[password]'] }
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: Post,
        attributes: [
          'id',
          'title',
          'body',
          'date_created'
        ]
      },
      // {
      //   model: Comment,
      //   attributes: ['id', 'comment_text', 'date_created'],
      //   include: {
      //     model: Post,
      //     attributes: ['title']
      //   }
      // },
      // {
      //   model: Post,
      //   attributes: ['title'],
      // }
    ]

    });

    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body
      // do i need htis ?--------------
    //   {
    //     username: req.body.username,
    //     password: req.body.password
    // }
    );

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});


router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: {  username: req.body.username } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'No matching Username!' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateUser = await User.update({
      // individualHooks: true,?------------------
      username: req.body.username,
      password: req.body.password
    }, {
      where: {
        id: req.params.id
      }
      // ...req.body,
      // user_id: req.session.user_id,
    });

    if (!updateUser) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json(updateUser);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deleteUser = await User.destroy({
      where: {
        id: req.params.id,
        // user_id: req.session.user_id,
      },
    });

    if (!deleteUser) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json(deleteUser);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
