'use strict';

const mysql             = require('anytv-node-mysql');
const util              = require('./../helpers/util');
const uuidv4            = require('uuid/v4');
const err_response      = require('./../libraries/response').err_response;
const tx_code      		= require('./../libraries/code_generator').randomAlphanumeric;
                          require('./../config/err_config');
                          require('./../config/config');

const reqBody = {
	id : uuidv4(),
	code : '',
	description : '',
	activity_id : ''
}

const itemBody = {
	id : uuidv4(),
	report_id : '',
	fw_test : 0.0,
	bw_test : 0.0
}

async function getReports(res,data){
	let query = `
		SELECT code FROM reports WHERE code = '${data}' 
	`;

	let err,reports;

	[err,reports] = await to(mysql.build(query).promise());

	if(err){
		return err_response(res,BAD_REQ,err,500);
	}

	return reports[0];
}



const createReports = (req,res)=>{
	const data = util._get
	.form_data(reqBody)
	.from(req.body);

	let id = req.params.id;
	let code = tx_code();

	function start(){
		if(data instanceof Error){
			return err_response(res,data.message,INC_DATA,500);
		}

		data.activity_id = id;
		data.code = code;
		data.created = new Date();
		
		mysql.use('master')
			.query(`INSERT INTO reports ?`,data,addToList)
			.end();
	}

	async function addToList(err,result,args,last_query){
		if(err) {
			console.log('CREATE REPORTS',err);
			return err_response(res,BAD_REQ,err,500);
		}

		if(!result.affectedRows){
			return err_response(err,NO_CREATED_DATA,NO_CREATED_DATA,500);
		}

		let err,reports;

		[err,reports] = await to(getReports(res,code));

		if(err) {
			console.log('GET REPORTS',err);
			return err_response(res,BAD_REQ,err,500);
		}

		console.log(reports);

		let createQuery = `
			INSERT INTO reports_item_list SET ?
		`

		mysql.use('master')
			.query(query,send_response)
			.end();

	}

	function send_response(err,result,args,last_query){
		if(err) {
			console.log('CREATE REPORT ITEMS',err);
			return err_response(res,BAD_REQ,err,500);
		}

		if(!result.affectedRows){
			return err_response(err,NO_CREATED_DATA,NO_CREATED_DATA,500);
		}

		return res.send({
			message : 'Test created successfully',
			context: 'Data created successfully'
		}).status(200);
	}

	start();

}


module.exports = {
	createReports
}