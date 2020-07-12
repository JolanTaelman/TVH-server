'use strict';
module.exports = function (app) {
    var warehouseList = require('../controllers/warehouseController');

    app.route('/warehouses')
        .get(warehouseList.getWarehouses)
        .post(warehouseList.createWarehouse);

    app.route('/warehouses/:warehouseID')
        .get(warehouseList.getWarehouse)
        .put(warehouseList.updateWarehouse)
        .post(warehouseList.addItemToWarehouse)
        .delete(warehouseList.deleteWarehouse);

        app.route('/warehouses/:warehouseID/:itemID')
        .delete(warehouseList.deleteItemFromWarehouse);

        app.route('/item/:itemID')
        .get(warehouseList.getItem)
        .delete(warehouseList.deleteItem);
};