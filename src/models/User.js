const mongoose = require('mongoose');
const { Snowflake } = require('@theinternetfolks/snowflake');

const UserSchema = new mongoose.Schema({
    id: { type: String, default: () => Snowflake.generate(), unique: true },
    name: { type: String, required: true, maxlength: 64 },
    email: { type: String, required: true, unique: true, maxlength: 128 },
    password: { type: String, required: true, maxlength: 64 },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
