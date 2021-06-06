const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    details: [{type: Types.ObjectId, ref: 'Details'}]
});

module.exports = model('User', schema);
