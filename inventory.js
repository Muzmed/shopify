const csv = require('csv-parser');
const fs = require('fs');

const Shopify = require('shopify-api-node');
 
const shopify = new Shopify({
  shopName: 'siddique-test-store',
  apiKey: '76aa7b94b91932963a4a41539e9d6410',
  password: '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'
});

(async () => {
    let options = {};

    let inventory_id_list = [];
    inventory_id_list.push(39739987361981);
    options["inventory_item_ids"] = 39739987361981;
    console.log("Hiiii");
    const shopify_inventory_itemLevel = await shopify.inventoryLevel.list(options);

    console.log(shopify_inventory_itemLevel[0].location_id);

    let inventoryT = {"available" : 58 , "location_id" : shopify_inventory_itemLevel[0].location_id , "inventory_item_id" : 39739987361981};

    const inventory = await shopify.inventoryLevel.set(inventoryT);

    console.log(inventory);

})();
  