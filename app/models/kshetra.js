const mongoose = require('mongoose');
const { Schema } = mongoose;

const kshetraSchema = new Schema({
    kshetra_name: { type: String, required: true },
    kendraId: { type: Schema.Types.ObjectId, ref: 'Kendra', required: true },
},{
    timestamps :true,
});



exports.Kshetra = mongoose.model('Kshetra', kshetraSchema);