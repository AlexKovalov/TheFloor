const {Router} = require('express');
const router = Router();
const shortId = require('shortid');
const auth = require('../middleware/auth.middleware');
const Details = require('../models/Details');

const BASE_URL = "http://localhost:5000";

router.get('/', auth, async (req, res) => {
    try {
        const details = await Details.find();
        res.json(details);
    } catch (e) {
        res.status(500).json({message: "Something were wrong, try again"});
    }
});

router.post('/create',auth, async (req, res) => {
    try {
        const body = req.body;
        const details = new Details({
            number: shortId.generate(),
            name: body.name,
            address: body.address,
            phone: body.phone,
        })
        const existing = await Details.findOne({number: details.number});
        if (existing) {
            return res.json({details: existing});
        }
        await details.save();
        res.status(201).json({details});
    } catch (e) {
        res.status(500).json({message: "Something were wrong, try again"});
    }
});

router.patch('/update/:id',auth, async (req, res) => {
    try {
        const body = req.body;
        const details = new Details({
            number: req.number,
            name: body.name,
            address: body.address,
            phone: body.phone,
        })
        const updatedDetails = await Details.findOneAndUpdate({number: details.number}, details, {new: true});
        res.status(201).json({updatedDetails});
    } catch (e) {
        res.status(500).json({message: "Something were wrong, try again"});
    }
});

module.exports = router;
