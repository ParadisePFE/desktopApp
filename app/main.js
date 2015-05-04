var express = require('express');
var app = express();
var fs = require('fs');
var xml2js = require('xml2js');

app.use(express.static('bower_components'));
app.use(express.static('content'));

// never repeat yourself
var parser = new xml2js.Parser();

// models
var catalogue = {};
var produits = [];
var categories = [];
var theData = null;

var buildCommandList = function ( data ) {
	var list = [];
	for (var i = 0; i < data.length; i++) {
    	var tmp = data[i];
    	var cmd = {
    		date: tmp.$.date,
    		numero: tmp.$.numero,
    		entries: []
    	};

    	for (var j = 0; j < tmp.entree.length; j++) {
    		var entry = tmp.entree[j];
    		cmd.entries.push({ ref: entry.$.ref, prix: entry.$.prix, quantite: entry.$.quantite });
    	};
    	list.push( cmd );
    }
	return list;
};

var buildProductList = function ( data ) {
	var list = [];
	for (var i = 0; i < data.length; i++) {
    	var tmp = data[i];
    	list.push({
    		reference: tmp.reference[0], 
		    designation: tmp.designation[0], 
		    image: tmp.image[0], 
		    category_id: tmp.$.category_id, 
		    promo: tmp.$.promo, 
		    prixNormal: tmp.prixNormal[0], 
		    prixPromo: tmp.prixPromo[0],
		    stock: tmp.stock[0] 
    	});
    }
	return list;
};

fs.readFile('./content/catalogue.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
    	theData = result;
        catalogue = {
        	name      : result.catalogue.name[0],
        	phone     : result.catalogue.phone[0],
        	address   : result.catalogue.address[0],
        	commandes : buildCommandList( result.catalogue.commandes[0].commande ),
        	produits  : buildProductList( result.catalogue.produits[0].produit )
        };
    });
});

fs.readFile('./content/produits.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        for ( i = 0; i < result.produits.produit.length; i++ ){
		   var tmp = result.produits.produit[i];
		   produits.push({
		     reference: tmp.reference[0], 
		     designation: tmp.designation[0], 
		     image: tmp.image, 
		     category_id: tmp.$.category_id, 
		     promo: tmp.$.promo, 
		     prixNormal: tmp.prixNormal[0], 
		     prixPromo: tmp.prixPromo[0]
		   });
		}
    });
});

fs.readFile('./content/categories.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        for ( i = 0; i < result.categories.categorie.length; i++ ){
		   var tmp = result.categories.categorie[i];
		   categories.push({
		     id: tmp.id[0], 
		     name: tmp.name[0], 
		     slug: tmp.slug[0], 
		   });
		}
    });
});

// API
app.get('/products', function(req, res){
	res.json(produits);
});

app.get('/categories', function(req, res){
	res.json(categories);
});

app.get('/categories/:category_id', function(req, res){
	var handled = null;
	for (var i = 0; i < categories.length; i++) {
		if ( categories[i].id == req.params.category_id ) {
			handled = categories[i];
			break;
		}
	}
	res.json(handled);
});

app.get('/categories/:category_id/products', function(req, res){
	var handled = [];
	var catId = req.params.category_id;
	for (var i = 0; i < produits.length; i++) {
		if ( produits[i].category_id == catId ) {
			handled.push( produits[i] );
		}
	}
	res.json(handled);
});

app.get('/catalogue', function(req, res){
	res.json(catalogue);
});

app.listen(8080);