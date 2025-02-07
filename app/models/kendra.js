const mongoose = require('mongoose');
const { Schema } = mongoose;

const kendraSchema = new Schema({
    kendra_name: { type: String, required: true },
},{
    timestamps :true,
});

// Create and export models from schemas
exports.Kendra = mongoose.model('Kendra', kendraSchema);


