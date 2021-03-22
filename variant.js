const csv = require("csv-parser");
const fs = require("fs");

const Shopify = require("shopify-api-node");

const shopify = new Shopify({
  shopName: "siddique-test-store",
  apiKey: "76aa7b94b91932963a4a41539e9d6410",
  password: "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",
});

let variantData = {
  option1: "4",
  sku: "PC14929RA/W",
  compare_at_price: "$1,523.00 ",
  inventory_policy: "deny",
  inventory_management: "shopify",
  fulfillment_service: "manual",
  price: "$684.00 ",
  taxable: true,
  barcode: "",
  metafields_global_title_tag:
    "14k White Gold Baguette Diamond Fashion Anniversary Ring 1 Cttw",
  metafields_global_description_tag: "",
};

const variant = shopify.productVariant.create(6105576702141, variantData);
