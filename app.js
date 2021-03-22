const csv = require("csv-parser");
const fs = require("fs");

const Shopify = require("shopify-api-node");

const shopify = new Shopify({
  shopName: "finejewelers24",
  apiKey: "096a9e4d44b855b60b1af51018119366",
  password: "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",
});

(async () => {
  const product_created = {
    handle_id: String,
    shopify_id: Number,
  };
  let products_created = [];

  let rows = [];

  let i = 1;
  await parseCSV("mustafa.csv")
    .then(async (rows) => {
      for await (let row of rows) {
        console.log("Starying to process row no :" + i);
        i = i + 1;
        try {
          const result = products_created.find(function (product) {
            return product.handle_id == row.Handle;
          });

          if (result === undefined) {
            let variant = createVariantData(row);

            let options = [{ name: "Ring Size" }];

            let product = {};

            if (row.Option1 != null) {
              product["options"] = options;
            }

            if (row.Title != null) {
              product["title"] = row.Title;
            }

            if (row.body_html != null) {
              product["body_html"] = row.body_html;
            }

            if (row.Vendor != null) {
              product["vendor"] = row.Vendor;
            }

            if (row.Tags != null) {
              let tags = [];
              tags.push(row.Tags);
              product["tags"] = tags;
            }
            let variant_array = [];
            variant_array.push(variant);
            product["variants"] = variant_array;

            const product_1 = await shopify.product.create(product);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            createImage(row, product_1.id);
            await new Promise((resolve) => setTimeout(resolve, 900));
            createInventory(row, product_1.variants[0].inventory_item_id);
            await new Promise((resolve) => setTimeout(resolve, 800));
            const new_product = Object.create(product_created);
            new_product.handle_id = row.Handle;
            new_product.shopify_id = product_1.id;
            products_created.push(new_product);

            // console.log("product created! " + product_1.id);
          } else {
            console.log("Here comes it!!!!");
            const product_id = result.shopify_id;

            if (row.Title == null || row.Title == "") {
              console.log(
                "######################################################################"
              );
              createImage(row, product_id);
            }

            if (row.Option1 != null) {
              let variantData = createVariantData(row);

              const variant = await shopify.productVariant.create(
                product_id,
                variantData
              );
              await new Promise((resolve) => setTimeout(resolve, 1000));
              createInventory(row, variant.inventory_item_id);
              await new Promise((resolve) => setTimeout(resolve, 800));
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    })
    .catch(function (err) {
      console.error(err);
    });

  function createVariantData(row) {
    let variant = {};

    if (row.Option1Value != null) {
      variant["option1"] = row.Option1Value;
    }

    if (row.VariantSKU != null) {
      variant["sku"] = row.VariantSKU;
    }

    if (row.VariantComparePrice != null) {
      variant["compare_at_price"] = row.VariantComparePrice;
    }

    if (row.VariantPolicy != null) {
      variant["inventory_policy"] = row.VariantPolicy;
    }

    variant["inventory_management"] = "shopify";

    if (row.VariantFulfillmentService != null) {
      variant["fulfillment_service"] = row.VariantFulfillmentService;
    }

    if (row.VariantPrice != null) {
      variant["price"] = row.VariantPrice;
    }

    if (row.VariantTaxable != null) {
      variant["taxable"] = true;
    }

    if (row.VariantBarcode != null) {
      variant["barcode"] = row.VariantBarcode;
    }

    if (row.SEOTitle != null) {
      variant["metafields_global_title_tag"] = row.SEOTitle;
    }

    if (row.SEODescription != null) {
      variant["metafields_global_description_tag"] = row.SEODescription;
    }

    //console.log(variant);
    return variant;
  }
})();
async function createInventory(row, inventory_item_id) {
  let inventoryoptions = {};

  let inventory_id_list = [];

  inventoryoptions["inventory_item_ids"] = inventory_item_id;

  const shopify_inventory_itemLevel = await shopify.inventoryLevel.list(
    inventoryoptions
  );

  let inventoryT = {
    available: row.VariantQty,
    location_id: shopify_inventory_itemLevel[0].location_id,
    inventory_item_id: inventory_item_id,
  };

  const inventory = await shopify.inventoryLevel.set(inventoryT);
}

async function createImage(row, product_id) {
  //Create new ImagePosition
  let imageT = {};

  if (row.ImageSrc != null) {
    imageT["src"] = row.ImageSrc;
  }

  if (row.ImagePosition != null) {
    imageT["position"] = row.ImagePosition;
  }

  const image = await shopify.productImage.create(product_id, imageT);
}

async function parseCSV(file) {
  return await new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("error", (e) => {
        reject(e);
      })
      .on("end", () => {
        resolve(data);
      });
  });
}
