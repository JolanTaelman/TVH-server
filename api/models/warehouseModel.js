'use strict';
var mongoose = require('mongoose');
var ItemSchema = require("./itemModel"); 
const Item = require('./itemModel');
var Schema = mongoose.Schema;

//var ItemSchema = new Schema({ name: 'string' });

var WarehouseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
});


module.exports = mongoose.model('Warehouse', WarehouseSchema);