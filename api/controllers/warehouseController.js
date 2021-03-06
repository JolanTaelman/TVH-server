'use strict';

var mongoose = require('mongoose'),
    Warehouse = mongoose.model('Warehouse'),
    Item = mongoose.model('Item');
var _ = require('lodash');


var ObjectId = require('mongodb').ObjectID;

/**
 * /warehouses GET
 *  Returns all warehouses
 *  */
exports.getWarehouses = function (req, res) {
    Warehouse.find().populate('items').then(
        function (err, warehouse) {
            if (err) {
                res.send(err);
            }
            res.json(warehouse);
        });
};

/**
 * '/warehouses/:warehouseID' GET
 *  Returns warehouse based on specific 
 *  */
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

/**
 * '/warehouses' POST
 *  Creates a warehouse based on the provided body parameters 
 *  */
exports.createWarehouse = function (req, res) {
    var nWarehouse = new Warehouse(req.body);
    nWarehouse.save(function (err, warehouse) {
        if (err)
            res.send(err);
        res.json(warehouse);
    });
};

/**
 * '/warehouses/:warehouseID' PUT
 * finds and updates a warehouse 
 *  */
exports.updateWarehouse = function (req, res) {
    Warehouse.findOneAndUpdate({ _id: req.params.warehouseID }, req.body, { new: true }, function (err, warehouse) {
        if (err)
            res.send(err);
        res.json(warehouse);
    });
};

/**
 * '/warehouses/:warehouseID' POST
 * 
 *  */
exports.addItemToWarehouse = function (req, res) {
    var item = new Item(req.body);
    item.warehouse = req.params.warehouseID;
    Warehouse.findById(req.params.warehouseID).then(warehouse => {
        if (warehouse.capacity - warehouse.items.length > 0) {
            item.save(function (err, response) {
                warehouse.updateOne({ $push: { items: item._id } }).then(() => {
                    if (err)
                        res.send(err);
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

/**
 * '/warehouses/:warehouseID' DELETE
 * 
 *  */
exports.deleteWarehouse = function (req, res) {
    Warehouse.remove({
        _id: req.params.warehouseID
    }, function (err, warehouse) {
        if (err)
            res.send(err);
        res.json({ message: 'Warehouse successfully deleted' });
    });
};

/**
 * '/warehouses/:warehouseID/:itemID' DELETE
 * 
 *  */
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

/**
 * '/warehouses/:warehouseID/:itemID' POST
 * 
 *  */
exports.moveItemToWarehouse = function (req, res) {
    var itemId = req.params.itemID;
    Item.findById(itemId).then((item) => {
        Warehouse.findById(req.params.warehouseID).then(warehouse => {
            if (warehouse.capacity - warehouse.items.length > 0) {
                Warehouse.findByIdAndUpdate(item.warehouse, { $pull: { items: itemId } }).then(() => {
                    warehouse.updateOne({ $push: { items: itemId } }).then(() => {
                        item.updateOne({ warehouse: req.params.warehouseID }).then(() => res.json(itemId));
                    })
                })
            } else {
                throw new Error('Warehouse at maximum capacity');
            }
        })
    }).catch(err => {
        res.send(`${err}`);
    });
}

/**
 * /warehouses/:warehouseID/items' GET
 * returns a list of all items from the warehouse matching the provided Id.
 *  */
exports.getItemList = function (req, res) {
    let warehouse = req.params.warehouseID;
    Warehouse.findById(warehouse).populate("items").then((response) => {
        res.json(response.items);
    }).catch(err => {
        res.send(`${err}`);
    });
}
/**
 * '/item/:itemID' GET
 * 
 *  */
exports.getItem = function (req, res) {
    var id = ObjectId(req.params.itemID)
    Item.findById(id, function (err, item) {
        if (err) {
            res.send(err);
        }
        res.json(item);
    });
};

/**
 * '/item/:itemID' DELETE
 *  Deletes item from DB based on provided ID
 *  */
exports.deleteItem = function (req, res) {
    Item.remove({
        _id: req.params.itemID
    }).then((response) => {
        res.json({ message: 'Item successfully deleted' });
    });
};

exports.getEmptyCapacity = function (req, res) {
    Warehouse.find().then(
        function (warehouse) {
            let individualCapacity = [];
            let capacity = 0;
            for (let index = 0; index < warehouse.length; index++) {
                const element = warehouse[index];
                const available = element.capacity - element.items.length;
                capacity += available;
                individualCapacity[index] = { space: available, name: element.name };
            }
            res.json({ capacity: capacity, 'warehouses': individualCapacity });
        });
};