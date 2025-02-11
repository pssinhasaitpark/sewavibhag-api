const mongoose = require('mongoose');
const { Schema } = mongoose;

const kshetraSchema = new Schema({
    kshetra_name: { type: String, required: true },
    kendra_id: { type: Schema.Types.ObjectId, ref: 'Kendra', required: true },
},{
    timestamps :true,
});


const Kshetra = mongoose.model('Kshetra', kshetraSchema);

module.exports = Kshetra;  // Export the model as 'User'