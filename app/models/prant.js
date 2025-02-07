const mongoose = require('mongoose');
const { Schema } = mongoose;

const prantSchema = new Schema({
    prant_name: { type: String, required: true },
    kendra_id: { type: Schema.Types.ObjectId, ref: 'Kendra', required: true },
    kshetra_id: { type: Schema.Types.ObjectId, ref: 'Kshetra', required: true },
},{
    timestamps :true,
});

exports.Prant = mongoose.model('Prant', prantSchema);