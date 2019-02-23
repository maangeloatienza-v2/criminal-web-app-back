'use strict';

const mysql             = require('anytv-node-mysql');
const util              = require('./../helpers/util');
const uuidv4            = require('uuid/v4');
const jwt               = require('jsonwebtoken');
const err_response      = require('./../libraries/response').err_response;
                          require('./../config/err_config');
                          require('./../config/config');

const product = {
	name : '',
	_description : '',
	user_id : '',
	quantity : 1,
	price : 1.0,
}

/**
 * @api {post} v1/products                  Create Product 
 * @apiName Create Product
 * @apiGroup Products
 * 
 * 
 * @apiParam {String}       name      		Name of the product
 * @apiParam {String}       description     Product description
 * @apiParam {String}       user_id        	Id of the user who created the product
 * @apiParam {Int}       	quantity        Product quantity
 * @apiParam {Float}       	price			Product's price
 */



const create = (req,res,next)=>{
	const data = util._get
    .form_data(product)
    .from(req.body);

    function start(){
		
		if(data instanceof Error){
            return err_response(res,data.message,INC_DATA,500);
        }

        data.id = uuidv4();
        data.created = new Date();
        
        mysql.use('master')
        	.query(`INSERT INTO products SET ?`,data,send_response)
        	.end();
    }

    function send_response(err,result,args,last_query){

    	if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.affectedRows){
            return err_response(res,ERR_CREATING,NO_RECORD_CREATED,402)
        }

        return res.json({
        	data : data,
        	message : 'Product created successfully',
        	context : 'Data created successfully'
        })

    }

    start();
}

/**
 * @api {get} v1/users                      Request Product information
 * @apiName Get Product
 * @apiGroup Products
 *
 * @apiParams  {String}     [search]        Search matching name
 */



const getProducts =(req,res,next)=>{
	const {
		search
	} = req.query;

	let where = ` WHERE p.deleted IS null `;

	if(search) {
		console.log(search);
		where += ` AND p.name LIKE '%${search}%'`;
	}

	let getAllQuery = `
		SELECT \
		p.*, \
		u.first_name, \
		u.last_name, \
		u.username, \
		u.email, \
		u.phone_number, \
		u.address \
		FROM products p \
		LEFT JOIN users u \
		ON p.user_id = u.id \ 
		${where} \
	`;
	

	function start(){

		mysql.use('master')
			.query(getAllQuery,send_response)
			.end();

	}

	function send_response(err,result,args,last_query){
		console.log(last_query);
		if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.length){
            return err_response(res,ZERO_RES,ZERO_RES,404);
        }

        return res.json({
            data : result,
            message : 'Successfully fetched products',
        	context : 'Retrieved data successfully'
        })
        .send();
	}

	start();
}

module.exports = {
	create,
	getProducts
}
