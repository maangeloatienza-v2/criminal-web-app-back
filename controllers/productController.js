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


module.exports = {
	create,
}
