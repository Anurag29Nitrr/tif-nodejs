const mongoose = require('mongoose');
const { Snowflake } = require('@theinternetfolks/snowflake');

const MemberSchema = new mongoose.Schema({
    id: { type: String, default: () => Snowflake.generate(), unique: true },
    community: { type: String, ref: 'Community', required: true },
    user: { type: String, ref: 'User', required: true },
    role: { type: String, ref: 'Role', required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', MemberSchema);
