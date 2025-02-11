const mongoose = require('mongoose');
const { Schema } = mongoose;


const jilaSchema = new Schema({
    jila_name: { type: String, required: true },
    vibhag_id : { type: Schema.Types.ObjectId, ref: 'Vibhag', required: true  },
    prant_id: { type: Schema.Types.ObjectId, ref: 'Prant', required: true },
    kshetra_id: { type: Schema.Types.ObjectId, ref: 'Kshetra', required: true },
    kendra_id: { type: Schema.Types.ObjectId, ref: 'Kendra', required: true },
    reportData: { type: Schema.Types.Mixed },
},{
    timestamps :true,
});


const Jila = mongoose.model('Jila', jilaSchema);
module.exports = Jila;