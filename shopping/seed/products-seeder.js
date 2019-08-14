var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping',  { useNewUrlParser: true });

var products = [
  new Product({
    imagePath: 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c05962484.png',
    title: 'Dell Laptop',
    description: 'Awesome laptop from Dell',
    price: 200
  })
];

var done = 0;

for(var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if(done === products.length) {
      exit();
    }
  });
}


function exit() {
  mongoose.disconnect();
}
