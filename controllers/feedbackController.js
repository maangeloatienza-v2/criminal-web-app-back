'use strict';

const mysql             = require('anytv-node-mysql');
const util              = require('./../helpers/util');
const uuidv4            = require('uuid/v4');
const jwt               = require('jsonwebtoken');
const err_response      = require('./../libraries/response').err_response;
const tx_code      		= require('./../libraries/code_generator').randomAlphanumeric;
                          require('./../config/err_config');
                          require('./../config/config');


const feedbacks = {
	description : '',
	product_id : ''
}

const optFeedbacks = {
	_description : '',
}


/**
 * @api {post} v1/add-feedback               		Add feedback 
 * @apiName Add feedback 
 * @apiGroup Feedbacks
 * 
 * 
 * @apiParam {String}      description      		Feedback description 
 * @apiParam {String}      product_id  				Product's id
 */


const createFeedback = (req,res,next)=>{
	res.setHeader('Content-Type', 'application/json');
	const data = util._get
	.form_data(feedbacks)
	.from(req.body);

	const id = req.params.id;


	function start(){
		if(data instanceof Error){

			return err_response(res,INC_DATA,INC_DATA,500);
		
		}

		data.id = uuidv4();
		data.user_id = req.user.id;
		data.created = new Date();

		mysql.use('master')
			.query(`INSERT INTO feedbacks SET ?`,data,send_response)
			.end();

	}

	function send_response(err,result,args,last_query){
		console.log(err);
		if(err){
			return err_response(res,BAD_REQ,BAD_REQ,500);
		}

		if(!result.affectedRows){
			return err_response(res,NO_CREATED_DATA,NO_CREATED_DATA,500);

		}

		return res.json({
			data : data,
			message : 'Feedback added successfully',
			context : 'Data created successfully'
		})
		.status(200)
		.send();
	}

	start();
}

/**
 * @api {get} v1/show-feedbacks/:id           		Fetch feedbacks 
 * @apiName Fetch feedback 
 * @apiGroup Feedbacks
 * 
 * @apiParam {String}			id 					ID of the product
 */




const showProductFeedback = (req,res,next)=>{
	res.setHeader('Content-Type', 'application/json');
	const id = req.params.id;

	let query = 
	`
		SELECT \
		feedback.id , \
		feedback.description AS comment,\
		product.id AS product_id, \
		product.name AS product_name, \
		product.description AS product_description, \
		product.price AS product_price, \
		user.id AS user_id, \
		user.username , \
		user.first_name, \
		user.last_name
		FROM feedbacks feedback \
		LEFT JOIN products product \
		ON feedback.product_id = product.id \
		LEFT JOIN users user \
		ON feedback.user_id = user.id \
		WHERE feedback.deleted IS null \
		AND feedback.product_id = '${id}'
	`;

	function start(){
		mysql.use('master')
			.query(query,send_response)
			.end();

	}

	function send_response(err,result,args,last_query){
		console.log(last_query);
		if(err){
			return err_response(res,BAD_REQ,BAD_REQ,500);
		}

		if(!result.length){
			return err_response(res,ZERO_RES,ZERO_RES,400);

		}

		return res.json({
			data : result[0],
			message : 'Retrieved feedbacks',
			context : 'Data retrieved successfully'
		})
		.status(200)
		.send()

	}

	start();
}


/**
 * @api {put} v1/feedbacks/:id            			Update feedbacks 
 * @apiName Update feedback 
 * @apiGroup Feedbacks
 * 
 * @apiParam {String}			id 					ID of the feedback
 */




const updateFeedback = (req,res,next) =>{
	res.setHeader('Content-Type', 'application/json');
	const data = util._get
	.form_data(optFeedbacks)
	.from(req.body);

	const id = req.params.id;
	const user_id = req.user.id;

	function start(req,res,next){

		if(data instanceof Error){
			return err_response(res,INC_DATA,INC_DATA,500);
		}
	
		mysql.use('master')
			.query(`SELECT * FROM feedbacks WHERE id = '${id}' AND user_id = '${user_id}' AND deleted IS null`,update_feedback)
			.end()
	}

	function update_feedback(err,result,args,last_query){

		if(err){
			return err_response(res,BAD_REQ,BAD_REQ,500);
		}

		if(!result.length){
			return err_response(res,ZERO_RES,ZERO_RES,400);

		}

		data.updated = new Date();

		mysql.use('master')
			.query(`UPDATE feedbacks SET ?`,data,send_response)
			.end();

	}

	function send_response(err,result,args,last_query){
		if(err){

			return err_response(res,BAD_REQ,BAD_REQ,500);
		
		}

		if(!result.affectedRows){

			return err_response(res,NO_DATA_UPDATED,NO_DATA_UPDATED,400);

		}

		return res.json({
			data : data,
			message : 'Feedback updated successfully',
			context : 'Data updated successfully'
		})
		.status(200)
		.send();

	}

	start();
}


/**
 * @api {put} v1/delete-feedbacks/:id            	Delete feedbacks 
 * @apiName Delete feedback 
 * @apiGroup Feedbacks
 * 
 * @apiParam {String}			id 					ID of the feedback
 */



const deleteFeedback = (req,res,next) =>{
	res.setHeader('Content-Type', 'application/json');
	const id = req.params.id;
	const user_id = req.user.id;

	let old_data = {};

	function start(req,res,next){
	
		mysql.use('master')
			.query(`SELECT \
					feedback.id , \
					feedback.description AS comment,\
					product.id AS product_id, \
					product.name AS product_name, \
					product.description AS product_description, \
					product.price AS product_price, \
					user.id AS user_id, \
					user.username , \
					user.first_name, \
					user.last_name
					FROM feedbacks feedback \
					LEFT JOIN products product \
					ON feedback.product_id = product.id \
					LEFT JOIN users user \
					ON feedback.user_id = user.id \
					WHERE feedback.id = '${id}' AND feedback.user_id = '${user_id}'`,delete_feedback)
			.end()
	}

	function delete_feedback(err,result,args,last_query){
		console.log(err);
		if(err){
			return err_response(res,BAD_REQ,BAD_REQ,500);
		}

		if(!result.length){
			return err_response(res,ZERO_RES,ZERO_RES,400);

		}
		old_data = result[0];

		mysql.use('master')
			.query(`UPDATE feedbacks SET deleted = NOW()`,send_response)
			.end();

	}

	function send_response(err,result,args,last_query){
		if(err){

			return err_response(res,BAD_REQ,BAD_REQ,500);
		
		}

		if(!result.affectedRows){

			return err_response(res,NO_DATA_UPDATED,NO_DATA_UPDATED,400);

		}

		return res.json({
			deleted_data : old_data,
			message : 'Feedback deleted successfully',
			context : 'Data deleted successfully'
		})
		.status(200)
		.send();

	}

	start();
}



module.exports = {
	createFeedback,
	showProductFeedback,
	updateFeedback,
	deleteFeedback
}