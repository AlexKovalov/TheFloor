const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    number: {type: Types.ObjectId, ref: 'User'},
    name: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: String, required: false},
});

module.exports = model('Details', schema);
