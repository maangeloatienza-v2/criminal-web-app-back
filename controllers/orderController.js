'use strict';

const mysql             = require('anytv-node-mysql');
const util              = require('./../helpers/util');
const uuidv4            = require('uuid/v4');
const jwt               = require('jsonwebtoken');
const err_response      = require('./../libraries/response').err_response;
const tx_code      		= require('./../libraries/code_generator').randomAlphanumeric;
                          require('./../config/err_config');
                          require('./../config/config');

const products = [
	{
		product_name : '',
		item_price : 1.0,
		quantity : 1
	}
]

/**
 * @api {post} v1/add-orders               	Create order 
 * @apiName Create Order
 * @apiGroup Orders
 * 
 * 
 * @apiParam {Array}       products[]      			Array of products 
 * @apiParam {String}      products.product_name  Product name
 * @apiParam {Float}       products.item_price    Product price
 * @apiParam {Int}         products.quantity      Product quantity

 */


async function check_tx_code(tx_code){

	let query = `SELECT * FROM orders WHERE code = '${tx_code}'`;

	return await (mysql.build(query).promise());

}


async function insert_order(items){

	let query = `INSERT INTO orders SET ?`;
	let err_flag = 0;
	let data_holder = {};
	let txCode,code,error;
	

	txCode = tx_code();
    
    [error,code] = await to(check_tx_code(txCode.code));

    if(code.length){
    	return err_response(res,EXISTING,EXISTING,500);
    }



	await items.map(item=>{

		item.code = txCode;
		item.id = uuidv4();
		item.created = new Date();
  		item.total_item = ( item.quantity * item.item_price),

		(mysql.build(query,item)
		 	.promise()
		 	.then(res =>{
		 		console.log(res.affectedRows);
		 	})
		 	.catch(err=>{
		 		console.log(err)
		 			err_flag = 1
		 		}

		 	));
	});

	if(err_flag == 1 ){
		return false;
	}

	return true;

	

}

const addOrder = (req,res,next)=>{
	const data = util._get
    .form_data(products)
    .from(req.body);

	let data_holder = [];
    let error,code,order;
	
	async function start(){

		if(!data){
			return err_response(res,INC_DATA,INC_DATA,404);
		}

        [error,order] = await to(insert_order(data));

        if(!order){

            return err_response(res,NO_RECORD_CREATED,NO_RECORD_CREATED,404);

        }

        console.log(data);

        return res.json({
        	data : data,
        	message : 'Order created successfully',
        	context : 'Data created successfully'
        })
        .status(200)
        .send();

	}

	start();

}


module.exports = {
	addOrder
}