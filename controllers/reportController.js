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
	description : '',

}

const itemBody = {
	fw_test : [0.0],
	bw_test : [0.0]
}


/**
 * @api {POST} v1/reports/:id                      Create reports 
 * @apiName Create Report
 * @apiGroup Reports
 * 
 * @apiParam 	{String}	id					Activity id
 * @apiParam	{Float}		fw_test[]			Array of fw test result	
 * @apiParam	{Float}		bw_test[]			Array of bw test result	
 */



async function getReports(res,data){
	let query = `
		SELECT id,code FROM reports WHERE code = '${data}' 
	`;

	let err,reports;

	[err,reports] = await to(mysql.build(query).promise());

	if(err){
		return err_response(res,BAD_REQ,err,500);
	}
	console.log(reports);
	return reports[0];
}

async function createItemReport(res,id,rid,code,fw,bw){
	let query = `
		INSERT INTO  \
		reports_item_list \ 
		SET \ 
		id='${id}', \
		report_id='${rid}', \
		code = '${code}', \
		fw_test = ${fw}, \
		bw_test=${bw},\
		created = NOW()	`;

	let err,item;
	console.log(query)
	[err,item] = await to(mysql.build(query).promise());

	if(err){
		console.log('CREATE ITEM REPORT',err);
		return err_response(res,err,BAD_REQ,500);
	}
	
	if(!item.affectedRows){
		return err_response(err,NO_CREATED_DATA,NO_CREATED_DATA,500);
	}
	
	return item;
} 



const create_reports = (req,res)=>{
	const reportsData = util._get
	.form_data(reqBody)
	.from(req.body);

	const reportsItemData = util._get
	.form_data(itemBody)
	.from(req.body);

	let id = req.params.id;
	let code = tx_code();

	function start(){
		if(reportsData instanceof Error){
			return err_response(res,reportsData.message,INC_DATA,500);
		}

		reportsData.activity_id = id;
		reportsData.code = code;
		reportsData.created = new Date();
		
		mysql.use('master')
			.query(`INSERT INTO reports SET ?`,reportsData,addToList)
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

		let error,reports,itemReport;

		[error,reports] = await to(getReports(res,code));

		if(error) {
			console.log('GET REPORTS',error);
			return err_response(res,BAD_REQ,error,500);
		}

		console.log(reports);


		for(let i =0;i<8;i++){
			reportsItemData.id = uuidv4();
			[error,itemReport] = await to(createItemReport(
				res,
				reportsItemData.id,
				reports.id,
				code,
				reportsItemData.fw_test[i],
				reportsItemData.bw_test[i]));
			
		}


		return res.send({
			message : 'Test created successfully',
			context: 'Data created successfully'
		}).status(200);

	}

	start();

}


/**
 * @api {get} v1/reporta/:id                 Fetch One report 
 * @apiName Fetch Reports
 * @apiGroup Reports
 * 
 * @apiParam 		{String}				Activity id
 */


const show_reports = (req,res,next)=>{
	let id = req.params.id;

	function start(){
		mysql.use('master')
		.query(`SELECT * FROM reports WHERE activity_id = '${id}'`,showList)
		.end();
	}

	function showList(err,result,args,last_query){
		if(err){
			console.log('SHOW REPORTS', err);
			return err_response(res,err,BAD_REQ,500);
		}

		if(!result.length){
			return err_response(res,ZERO_RES,ZERO_RES,400);
		}

		let query = 
		`
			SELECT \
			report.id AS id,
			report.code, \
			report.description, \
			report.activity_id, \
			activity.description AS activity_description, \
			report.created, \
			reports_item_list.fw_test, \
			reports_item_list.bw_test \
			FROM reports report \
			LEFT JOIN reports_item_list reports_item_list\
			ON report.id = reports_item_list.report_id \
			LEFT JOIN schedule_activity activity \
			ON report.activity_id = activity.id
			WHERE report.activity_id = '${id}'
		`;

		mysql.use('master')
			.query(query,send_response)
			.end();
	}

	function send_response(err,result,args,last_query){
		if(err){
			console.log('SHOW ITEM REPORT', err);
			return err_response(res,err,BAD_REQ,500);
		}

		if(!result.length){
			return err_response(res,ZERO_RES,ZERO_RES,400);
		}

		let fw_holder = [];
		let bw_holder = [];

		result.map(item=>{
			fw_holder.push(item.fw_test);
			bw_holder.push(item.bw_test);
		})

		console.log(result);
		return res.send({
			data : {
				id : result[0].id,
				description : result[0].activity_description,
				fw_test : fw_holder,
				bw_test : bw_holder,
				created : result[0].created
			},
			message : 'Report fetched successfully',
			context : 'Data fetched successfully'
		}).status(200);
	}

	start();
}


module.exports = {
	create_reports,
	show_reports
}