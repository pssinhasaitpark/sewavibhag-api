const mongoose = require('mongoose');
const { Schema } = mongoose;


const vibhagSchema = new Schema({
    vibhag_name: { type: String, required: true },
    prant_id: { type: Schema.Types.ObjectId, ref: 'Prant', required: true },
    kshetra_id: { type: Schema.Types.ObjectId, ref: 'Kshetra', required: true },
    kendra_id: { type: Schema.Types.ObjectId, ref: 'Kendra', required: true },
}, {
    timestamps: true,
});

const Vibhag = mongoose.model('Vibhag', vibhagSchema);

module.exports = Vibhag