'use strict';

const mysql             = require('anytv-node-mysql');
const util              = require('./../helpers/util');
const uuidv4            = require('uuid/v4');
const jwt               = require('jsonwebtoken');
const err_response      = require('./../libraries/response').err_response;
const cloudinary        = require('cloudinary').v2;
const fs                = require('fs');
const tx_code      		= require('./../libraries/code_generator').randomAlphanumeric;
                          require('./../config/err_config');
                          require('./../config/config');


const product = {
	name : '',
	_description : '',
	price : 1.0,
    _file : ''
}


const optProduct = {
	_name : '',
	_description : '',
	_price : 1.0,
    _file : ''
}


cloudinary.config({
    cloud_name  : CLOUD_NAME,
    api_key     : API_KEY,
    api_secret  : API_SECRET
});

/**
 * @api {post} v1/products                  Create Product 
 * @apiName Create Product
 * @apiGroup Products
 * 
 * 
 * @apiParam {String}       name      		Name of the product
 * @apiParam {String}       description     Product description
 * @apiParam {Float}        price           Product's price
 * @apiParam {String}       file			Upload photo for product
 */



const create = (req,res,next)=>{
	const data = util._get
    .form_data(product)
    .from(req.body);

    let file = '';
    let temp_holder;

    async function start(){
		
		if(data instanceof Error){
            return err_response(res,data.message,INC_DATA,500);
        }

        data.id = uuidv4();
        data.created = new Date();
        data.user_id = req.user.id;
        if(req.file){
            file = req.file.path

        temp_holder = await cloudinary.uploader.upload(
                file,
                {
                    public_id : file,
                    tags : 'uploads'
                },
                (err,image)=>{
                    if(err){
                        return err_response(res,err,'ERROR UPLOADING',500);
                    }

                    fs.unlinkSync(file);

                    console.log('image url ****' ,image.url);
                    return image;

                    
                }
            );
        }

        data.file = temp_holder.url;
        console.log('FILE',data.file);

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
 * @api {get} v1/products                   Fetch Product information
 * @apiName Get Products
 * @apiGroup Products
 *
 * @apiParam  {String}     [search]        Search matching name
 */


async function countProducts(res,offset){
        let query = 
        `   SELECT \
            count(*) AS total \
            FROM products \
            WHERE \
            deleted IS null `;
        let err,products;

        [err,products] = await to(mysql.build(query).promise());

        if(err) return err_response(res,BAD_REQ,err,500);

        return products[0].total;
}


const getProducts = async (req,res,next)=>{
	const {
		search
	} = req.query;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = `LIMIT ${(page - 1) * limit}, ${limit}`;

    let err,products,count =0;

	let where = ` WHERE p.deleted IS null `;

	if(search) {
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
        ${offset}
	`;

    [err,products] = await to(countProducts(res,where));

    count = products;
	

	function start(){

		mysql.use('master')
			.query(getAllQuery,send_response)
			.end();

	}

	function send_response(err,result,args,last_query){
        console.log(last_query)
		if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.length){
            return err_response(res,ZERO_RES,ZERO_RES,404);
        }

        return res.send({
            data : result,
            total : count,
            page,
            limit,
            message : 'Successfully fetched products',
        	context : 'Retrieved data successfully'
        })
        .status(200);
	}

	start();
}


/**
 * @api {get} v1/products/:id               Fetch Specific Product information
 * @apiName Get One Product
 * @apiGroup Products
 *
 * @apiParam {String}       id  	     	ID of the product
 */


const getOneProduct =(req,res,next)=>{
    res.setHeader('Content-Type', 'application/json');
	const id = req.params.id;

	let where = ` WHERE p.deleted IS null AND p.id = '${id}'`;

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
		if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.length){
            return err_response(res,ZERO_RES,ZERO_RES,404);
        }

        return res.json({
            data : result[0],
            message : 'Successfully fetched product',
        	context : 'Retrieved data successfully'
        })
        .status(200)
	}

	start();
}


/**
 * @api {put} v1/products/:id               Update Product 
 * @apiName Update Product
 * @apiGroup Products
 * 
 * @apiParam {String}       id 		     	ID of the product
 * @apiParam {String}       [name]      	Name of the product
 * @apiParam {String}       [description]   Product description
 * @apiParam {Float}       	[price]			Product's price
 */


const updateProduct = (req,res,next)=>{
    res.setHeader('Content-Type', 'application/json');
	const id = req.params.id;
    const user_id = req.user.id;

	const data = util._get
    .form_data(optProduct)
    .from(req.body);

    let error,cloud,temp_holder,file;

    function start(){
		
		if(data instanceof Error){
            return err_response(res,data.message,INC_DATA,500);
        }
        
        mysql.use('master')
        	.query(`SELECT \
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
        			WHERE p.id = '${id}' \ 
                    AND p.user_id = '${user_id}' \
                    AND p.deleted IS null`,update_product)
        	.end();
    }

    async function update_product(err,result,args,last_query){
    	if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.length){
            return err_response(res,ZERO_RES,ZERO_RES,404);
        }

        data.updated = new Date();

        if(req.file){
            file = req.file.path

        temp_holder = await cloudinary.uploader.upload(
                file,
                {
                    public_id : file,
                    tags : 'uploads'
                },
                (err,image)=>{
                    if(err){
                        return err_response(res,err,'ERROR UPLOADING',500);
                    }

                    fs.unlinkSync(file);

                    console.log('image url ****' ,image.url);
                    return image;

                    
                }
            );
        }

        data.file = temp_holder.url;


        mysql.use('master')
        	.query(`UPDATE products SET ? WHERE id = '${id}'`,data,send_response)
        	.end();
    }

    function send_response(err,result,args,last_query){
    	if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.affectedRows){
            return err_response(res,NO_RECORD_UPDATED,NO_RECORD_UPDATED,404);
        }

        return res.send({
        	edited_data : data,
        	message : 'Product updated successfully',
        	context : 'Data updated successfully'
        })
        .status(200)

    }

	start();
}

/**
 * @api {post} v1/products/:id              Delete Product 
 * @apiName Delete Product
 * @apiGroup Products
 * 
 * 
 * @apiParam {String}       id      		ID of the product
 */


const deleteProduct = (req,res,next)=>{
    res.setHeader('Content-Type', 'application/json');
	const id = req.params.id;

	let old_data = {};

    function start(){
        
        mysql.use('master')
        	.query(`SELECT \
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
        			WHERE p.id = '${id}' AND p.deleted IS null`,delete_product)
        	.end();
    }

    function delete_product(err,result,args,last_query){
    	if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.length){
            return err_response(res,ZERO_RES,ZERO_RES,404);
        }

		old_data = result[0];        

        mysql.use('master')
        	.query(`UPDATE products SET deleted = NOW() WHERE id = '${id}'`,send_response)
        	.end();
    }

    function send_response(err,result,args,last_query){
    	if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.affectedRows){
            return err_response(res,NO_RECORD_DELETED,NO_RECORD_DELETED,404);
        }

        return res.json({
        	deleted_data : old_data,
        	message : 'Product deleted successfully',
        	context : 'Data deleted successfully'
        })
        .status(200)

    }

	start();
}


module.exports = {
	create,
	getProducts,
	getOneProduct,
	updateProduct,
	deleteProduct
}
