'use strict';

const mysql             = require('anytv-node-mysql');
const util              = require('./../helpers/util');
const uuidv4            = require('uuid/v4');
const jwt               = require('jsonwebtoken');
const err_response      = require('./../libraries/response').err_response;
const tx_code      		= require('./../libraries/code_generator').randomAlphanumeric;
                          require('./../config/err_config');
                          require('./../config/config');

const order = {
	ids : [""]
};



async function check_tx_code(tx_code){

	let query = `SELECT * FROM orders WHERE code = '${tx_code}'`;

	return await (mysql.build(query).promise());

}


async function insertOrder(items){

	let query = `INSERT INTO orders SET ?`;

	items.map(item=>{
		await (mysql.build(query,item).promise());
	});

	

}

const addOrder = (req,res,next)=>{
	const data = util._get
    .form_data(order)
    .from(req.body);

	let data_holder = [];
	function start(){

		if(!data){
			return err_response(res,INC_DATA,INC_DATA,404);
		}

		mysql.use('master')
			.query(`SELECT * FROM products WHERE id in (?)`,[data.ids],check_quantity)
			.end();

	}

	async function check_quantity(err,result,args,last_query){

		if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.length){
            return err_response(res,ZERO_RES,ZERO_RES,404);
        }

    
        let error,txCode,code,order;
		
		txCode = tx_code();
        
        [error,code] = await to(check_tx_code(txCode.code));

        if(code.length){
        	return err_response(res,EXISTING,EXISTING,500);
        }

        result.map(rslt=>{
        	data_holder.push({
        		id : uuidv4(),
        		code : txCode,
        		created : new Date(),
        		product_name : rslt.name,
        		quantity : rslt.quantity,
        		item_price : rslt.price,
        		total_item : ( rslt.quantity * rslt.price)
        	});
        });

        [error,order] = await to(insertOrder(data_holder));

        console.log(order);

        // console.log(data_holder);
        // mysql.use('master')
        // 	.query(`INSERT INTO orders SET ?`,data_holder,send_response)
        // 	.end();

	}


	function send_response(err,result,args,last_query){

		if(err){
         
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.affectedRows){
         
            return err_response(res,NO_RECORD_CREATED,NO_RECORD_CREATED,404);
        }

        return res.json({
        	data : data_holder,
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