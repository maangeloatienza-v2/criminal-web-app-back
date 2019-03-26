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

const order = {
	message : ''
};



/**
 * @api {post} v1/orders               	Create order 
 * @apiName Create Order v2
 * @apiGroup Orders v2
 * 
 * @apiParam {String}         message     	Order content
 */


async function getOrder(res,where){
	let query = 
	`
		SELECT \
		o.id AS id, \
		o.message, \
		user.id, \
		user.first_name, \
		user.last_name, \
		user.email, \
		user.username, \
		o.created \
		FROM order_v2 o \
		LEFT JOIN users user \
		ON user.id = o.customer_id \ 
		${where}
	`;

	let err,order;
	console.log('QUERY **',query);
	[err,order] = await to(mysql.build(query).promise());

	if(err){

		return err_response(res,err,BAD_REQ,500);
	}

	if(!order.length){
		return err_response(err,ZERO_RES,ZERO_RES,404);
	}

	return order;
}


const create = (req,res,next)=>{
	const data = util._get
	.form_data(order)
	.from(req.body);


	function start(){

		if(data instanceof Error){
			return err_response(res,data.message,INC_DATA,500);
		}
		data.id = uuidv4();
		data.created = new Date();
		data.customer_id = req.user.id;
		mysql.use('master')
			.query(`INSERT INTO order_v2 SET ?`,data,send_response)
			.end();
	}

	function send_response(err,result,args,last_query){

		if(err){
			console.log('ORDER CREATION',err);
			return err_response(res,BAD_REQ,BAD_REQ,500);
		}

		if(!result.affectedRows){
			return err_response(res,NO_DATA_CREATED,NO_DATA_CREATED,400);
		}

		return res.send({
			message : 'Order submitted successfully',
			context : 'Data created successfully'
		}).status(200);
	}

	start();

}


/**
 * @api {get} v1/orders               	Get orders
 * @apiName Fetch Order v2
 * @apiGroup Orders v2
 * 
 */


const getAll = (req,res,next)=>{


	async function start(){
		let err,order;

		[err,order] = await to(getOrder(res,''));

		if(err){
			return err_response(res,BAD_REQ,BAD_REQ,500);
		}

		return res.send({
			data : order,
			message : 'Fetched orders successfully',
			context : 'Data fetched successfully'
		}).status(200);
	}

	start();
}


module.exports = {
	create,
	getAll
};

