const mongoose = require('mongoose');
const { Snowflake } = require('@theinternetfolks/snowflake');

const CommunitySchema = new mongoose.Schema({
    id: { type: String, default: () => Snowflake.generate(), unique: true },
    name: { type: String, required: true, maxlength: 128 },
    slug: { type: String, required: true, unique: true, maxlength: 255 },
    owner: { type: String, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Community', CommunitySchema);
