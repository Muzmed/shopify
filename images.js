const csv = require("csv-parser");
const fs = require("fs");

const Shopify = require("shopify-api-node");

const shopify = new Shopify({
  shopName: "siddique-test-store",
  apiKey: "76aa7b94b91932963a4a41539e9d6410",
  password: "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",
});

(async () => {
  let imageT = {};

  imageT["src"] =
    "https://www.gndatlanta.com/product/image/large/c0180453_3.jpg";

  const image = await shopify.productImage.create(6106422411453, imageT);
})();
