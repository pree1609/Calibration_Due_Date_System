const mongoose = require('mongoose');
const mongooseDateFormat = require('mongoose-date-format');
const Schema = mongoose.Schema;
const inputSchema = new Schema({
    plant: {
        type: String,
        required: true,
        maxlength: 4,
        trim: true
    },
    section: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    equip_no: {
        type: String,
        required: true,
        maxlength: 18
    },
    equip_des: {
        type: String,
        maxlength: 40
    },
    equip_type: {
        type: String,
        required: true,
        maxlength: 18
    },
    range: {
        type: String,
        // required: true,
        maxlength: 20
    },
    accuracy: {
        type: String,
        // required: true,
        maxlength: 10
    },
    frequency: {
        type: String,
        maxlength: 20
    },
    lastdate: {
        type: Date,
         default: new Date()
    },
    duedate: {
        type: Date,
        default: new Date()
    },
    intidays: {
        type: Number
    },
    status: {
        type: String,
        maxlength: 1
    },
    remarks: {
        type: String,
        maxlength: 400
    }  
}, { timestamps: true });
inputSchema.plugin(mongooseDateFormat);
module.exports = mongoose.model('input',  inputSchema );

 