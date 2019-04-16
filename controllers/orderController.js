'use strict';

const mysql             = require('anytv-node-mysql');
const util              = require('./../helpers/util');
const uuidv4            = require('uuid/v4');
const jwt               = require('jsonwebtoken');
const nodemailer 		= require('nodemailer');
const err_response      = require('./../libraries/response').err_response;
const tx_code      		= require('./../libraries/code_generator').randomAlphanumeric;
                          require('./../config/err_config');
                          require('./../config/config');

const products = [
	{
		product_name : '',
		product_id : '',
		item_price : 1.0,
		quantity : 1
	}
]

async function check_tx_code(tx_code){

	let query = `SELECT * FROM orders WHERE code = '${tx_code}'`;

	return await (mysql.build(query).promise());

}


async function insert_order(req,items){

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
  		item.total_item = ( item.quantity * item.item_price);
  		item.order_by = req.user.id; 

		(mysql.build(query,item)
		 	.promise()
		 	.then(res =>{
		 	})
		 	.catch(err=>{
		 			err_flag = 1
		 		}

		 	));
	});

	if(err_flag == 1 ){
		return false;
	}

	return true;

	

}

/**
 * @api {post} v1/ordersv1               				Create order v1
 * @apiName Create Order v1
 * @apiGroup Orders v1
 * 
 * @apiParam {Array}         products     				Array of product objects 
 * @apiParam {Object}        products.product_name     	Product content
 * @apiParam {Object}        products.item_price		Product content
 * @apiParam {Object}        products.quantity 			Product content
 */


const addOrder = (req,res,next)=>{
	res.setHeader('Content-Type', 'application/json');
	const data = util._get
    .form_data(products)
    .from(req.body);

    let error,code,order;

    let user = req.user;
	
	async function start(){

		if(!data){
			return err_response(res,INC_DATA,INC_DATA,404);
		}

        [error,order] = await to(insert_order(req,data));

        console.log(order);
        if(!order){

            return err_response(res,NO_RECORD_CREATED,NO_RECORD_CREATED,404);

        }

        

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

/**
 * @api {get} v1/ordersv1               	Fetch orders 
 * @apiName Fetch Order v1
 * @apiGroup Orders v1
 * 
 */




const getAll = (req,res,next)=>{
	res.setHeader('Content-Type', 'application/json');
	let {
		search,
		username,
		first_name,
		last_name,
		product_name,
		sort_id,
		sort_desc
	} = req.query;

	let where = ` WHERE o.deleted is null `;

	if(search){
		where += 
		` 	AND o.code LIKE '%${search}%' \
		  	OR o.product_name LIKE '%${search}%' \
		`;
	}


	if(product_name){
		where +=
		`
			AND o.product_name = '${product_name}'\
		`;
	}

	if(username){
		where +=
		`
			AND user.username = '${username}'\
		`;
	}

	if(first_name){
		where +=
		`
			AND user.first_name = '${first_name}'\
		`;
	}

	if(last_name){
		where +=
		`
			AND user.last_name = '${last_name}'\
		`;
	}
	sort_desc = sort_desc?sort_desc:'ASC';
	sort_id = sort_id?sort_id:'o.product_name';

	if(sort_id == 'product_name'){
		sort_id = 'o.product_name';

	}

	if(sort_id == 'order_by'){
		sort_id = 'o.order_by';

	}



	let query = 
	`	SELECT \ 
		o.*,
		user.username, \
		user.first_name, \
		user.last_name \
		FROM orders o \
		LEFT JOIN users user \
		ON user.id = o.order_by \
		${where}
		ORDER BY ${sort_id} ${sort_desc}
	`;

	function start(){

		mysql.use('master')
			.query(query,send_response)
			.end()

	}

	function send_response(err,result,args,last_query){

		if(err){
			return err_response(res,BAD_REQ,err,500)
		}
		
		if(!result.length){
			return err_response(res,ZERO_RES,ZERO_RES,400);
		}

		return res.json({
			data : result,
			message : 'Successfully fetched orders',
			context : 'Data fetched successfully'
		})
		.status(200)
		.send();

	}

	start();
}


/**
 * @api {get} v1/ordersv1/:id               	Fetch specific order 
 * @apiName Fetch One Order v1
 * @apiGroup Orders v1
 * 
 */




const getOne = (req,res,next)=>{
	res.setHeader('Content-Type', 'application/json');
	const id = req.params.id;

	let where = ` WHERE o.deleted is null AND o.id = '${id}'`;


	let query = 
	`	SELECT \ 
		o.*,
		user.username, \
		user.first_name, \
		user.last_name \
		FROM orders o \
		LEFT JOIN users user \
		ON user.id = o.order_by \
		${where}
	`;

	function start(){

		mysql.use('master')
			.query(query,send_response)
			.end()

	}

	function send_response(err,result,args,last_query){

		if(err){
			return err_response(res,BAD_REQ,BAD_REQ,500)
		}
		
		if(!result.length){
			return err_response(res,ZERO_RES,ZERO_RES,400);
		}

		return res.json({
			data : result[0],
			message : 'Successfully fetched orders',
			context : 'Data fetched successfully'
		})
		.status(200)
		.send();

	}

	start();
}

/**
 * @api {get} v1/ordersv1/customer               	Fetch specific orders for customers
 * @apiName Fetch Customers Order v1
 * @apiGroup Orders v1
 * 
 */



const getOrderByCustomer = (req,res,next)=>{
	res.setHeader('Content-Type', 'application/json');
	const id = req.user.id;

	let where = ` WHERE o.deleted is null AND o.order_by = '${id}'`;


	let query = 
	`	SELECT \ 
		o.*,
		user.username, \
		user.first_name, \
		user.last_name \
		FROM orders o \
		LEFT JOIN users user \
		ON user.id = o.order_by \
		LEFT JOIN products product \
		ON product.id = o.product_id \
		${where}
	`;

	function start(){

		mysql.use('master')
			.query(query,send_response)
			.end()

	}

	function send_response(err,result,args,last_query){

		if(err){
			return err_response(res,BAD_REQ,BAD_REQ,500)
		}
		
		if(!result.length){
			return err_response(res,ZERO_RES,ZERO_RES,400);
		}

		return res.json({
			data : result[0],
			message : 'Successfully fetched orders',
			context : 'Data fetched successfully'
		})
		.status(200)
		.send();

	}

	start();
}



module.exports = {
	addOrder,
	getAll,
	getOne,
	getOrderByCustomer
}