'use strict';
var mongoose = require('mongoose');
var WarehouseSchema = require("./warehouseModel"); 
const Warehouse = require('./warehouseModel');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    warehouse: {type: Schema.Types.ObjectId, ref: 'Warehouse'},
});

module.exports = mongoose.model('Item', ItemSchema);