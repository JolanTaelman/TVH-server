'use strict';

var mongoose = require('mongoose'),
    Warehouse = mongoose.model('Warehouse'),
    Item = mongoose.model('Item');
var _ = require('lodash');


var ObjectId = require('mongodb').ObjectID;

exports.getWarehouses = function (req, res) {
    Warehouse.find().populate('items').then(
        function (err, warehouse) {
            if (err) {
                res.send(err);
            }
            res.json(warehouse);
        });
};

exports.getWarehouse = function (req, res) {
    var id = ObjectId(req.params.warehouseID)
    Warehouse.findById(id).populate('items').then(
        function (err, warehouse) {
            if (err) {
                res.send(err);
            }
            res.json(warehouse);
        })
};

exports.createWarehouse = function (req, res) {
    var nWarehouse = new Warehouse(req.body);
    console.log(nWarehouse);

    nWarehouse.save(function (err, warehouse) {
        if (err)
            res.send(err);
        res.json(warehouse);
    });
};

exports.updateWarehouse = function (req, res) {
    Warehouse.findOneAndUpdate({ _id: req.params.warehouseID }, req.body, { new: true }, function (err, warehouse) {
        if (err)
            res.send(err);
        res.json(warehouse);
    });
};

exports.addItemToWarehouse = function (req, res) {
    var item = new Item(req.body);
    item.warehouse = req.params.warehouseID;
    Warehouse.findById(req.params.warehouseID).then(warehouse => {
        if (warehouse.capacity - warehouse.items.length > 0) {
            item.save(function (err, response) {
                warehouse.updateOne({ $push: { items: item._id } }).then(() => {
                    res.json(item);
                })
            })
        } else {
            throw new Error('Warehouse at maximum capacity');
        }
    }).catch(err => {
        res.send(`${err}`);
    });
};

exports.deleteWarehouse = function (req, res) {
    Warehouse.remove({
        _id: req.params.warehouseID
    }, function (err, warehouse) {
        if (err)
            res.send(err);
        res.json({ message: 'Warehouse successfully deleted' });
    });
};

exports.deleteItemFromWarehouse = function (req, res) {
    var itemId = req.params.itemID;
    var warehouseId = ObjectId(req.params.warehouseID);
    Warehouse.findById(warehouseId).then(warehouse => {
        warehouse.updateOne({ $pull: { items: itemId } }).then(() => {
            res.json({ id: itemId });
        })
    }).then(
        Item.findByIdAndUpdate(itemId, { warehouse: null }).then(() => console.log("finished"))
    ).catch(err => {
        res.send(`${err}`);
    });
}

exports.getItem = function (req, res) {
    var id = ObjectId(req.params.itemID)
    Item.findById(id, function (err, item) {
        if (err) {
            res.send(err);
        }
        res.json(item);
    });
};

exports.deleteItem = function (req, res) {
    Item.remove({
        _id: req.params.itemID
    }).then((response) => {
        res.json({ message: 'Item successfully deleted' });
    });
};
