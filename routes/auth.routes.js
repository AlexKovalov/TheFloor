const {Router} = require('express');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const router = Router();

const JWT_SECRET = "the floor";


router.post(
    '/register',
    [
        check('email', 'Invalid Email').isEmail(),
        check('password', 'Minimum length of password 6 symbols').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array(), message: 'Invalid data'});
            }

            const {email, password} = req.body;

            const candidate = await User.findOne({email});

            if (candidate) {
                return res.status(400).json({message: 'This user already exists'})
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email: email, password: hashedPassword});

            await user.save();

            res.status(201).json({message: 'User was created'});

        } catch (e) {
            res.status(500).json({message: "Something were wrong, try again"});
        }
    });

router.post(
    '/login',
    [
        check('email', 'Enter Email').normalizeEmail().isEmail(),
        check('password', 'Enter Password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Invalid User'});
            }

            const {email, password} = req.body;

            const user = await User.findOne({email: email});

            if (!user) {
                res.status(400).json({message: 'User was not find'})
            }

            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({message: 'Invalid password'});
            }

            const token = jwt.sign(
                {userId: user.id},
                JWT_SECRET,
                {expiresIn: '1h'}
            );

            res.json({token: token, userId: user.id});

        } catch (e) {
            res.status(500).json({message: "Something were wrong, try again"});
        }
    });

module.exports = router;
