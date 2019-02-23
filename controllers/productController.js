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


const getProducts =(req,res,next)=>{
	const {
		search
	} = req.query;

	function start(){

	}

	start();
}

module.exports = {
	create,
	getProducts
}
