'use strict';

const mysql             = require('anytv-node-mysql');
const util              = require('./../helpers/util');
const uuidv4            = require('uuid/v4');
const err_response      = require('./../libraries/response').err_response;
const moment 			= require('moment');
const tx_code      		= require('./../libraries/code_generator').randomAlphanumeric;
                          require('./../config/err_config');
                          require('./../config/config');

const reqBody = {
	_description : '',
	created : ''

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
 * @apiParam 	{String}	created				Created date and time of report
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

	return reports[0];
}

async function getActivity(res,data){
	let query = `
		SELECT * FROM schedule_activity WHERE id = '${data}' 
	`;

	let err,activity;

	[err,activity] = await to(mysql.build(query).promise());

	if(err){
		return err_response(res,BAD_REQ,err,500);
	}

	return activity;
}

async function createItemReport(res,data){
	let query = `
		INSERT INTO  \
		reports_item_list \ 
		SET ?`;

	let err,item;


	mysql.use('master')
		.query(query,data,(err,result,args,last_query)=>{

		if(err){
			console.log('CREATE ITEM REPORT',err);
			return err_response(res,err,BAD_REQ,500);
		}
	
		if(!result.affectedRows){
			return err_response(err,NO_CREATED_DATA,NO_CREATED_DATA,500);
		}
			return result;
	});
	
}

async function updateActivity(res,data){
	let query = `
		UPDATE schedule_activity SET completed = NOW() WHERE id = '${data}'
	`;

	let err,activity;

	[err,activity] = await to(mysql.build(query).promise());

	if(err){

		return err_response(res,err,NO_RECORD_UPDATED);
	}

	return true;
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
	
	async function start(){
		if(reportsData instanceof Error){
			return err_response(res,reportsData.message,INC_DATA,500);
		}
		
		let err,activity;

		[err,activity] = await to(getActivity(res,id));
		if(!activity.length){
			return err_response(res,ZERO_RES,ZERO_RES,400);
		}

		reportsData.id = uuidv4();
		reportsData.activity_id = id;
		reportsData.code = code;
		
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
			return err_response(err,NO_RECORD_CREATED,NO_RECORD_CREATED,500);
		}

		let error,reports,itemReport,activity;

		[error,reports] = await to(getReports(res,code));

		if(error) {
			console.log('GET REPORTS',error);
			return err_response(res,BAD_REQ,error,500);
		}

		let tempHolder = {};

		tempHolder.fw1 = reportsItemData.fw_test[0];
		tempHolder.fw2 = reportsItemData.fw_test[1];
		tempHolder.fw3 = reportsItemData.fw_test[2];
		tempHolder.fw4 = reportsItemData.fw_test[3];
		tempHolder.fw5 = reportsItemData.fw_test[4];
		tempHolder.fw6 = reportsItemData.fw_test[5];
		tempHolder.fw7 = reportsItemData.fw_test[6];
		tempHolder.fw8 = reportsItemData.fw_test[7];

		tempHolder.bw1 = reportsItemData.bw_test[0];
		tempHolder.bw2 = reportsItemData.bw_test[1];
		tempHolder.bw3 = reportsItemData.bw_test[2];
		tempHolder.bw4 = reportsItemData.bw_test[3];
		tempHolder.bw5 = reportsItemData.bw_test[4];
		tempHolder.bw6 = reportsItemData.bw_test[5];
		tempHolder.bw7 = reportsItemData.bw_test[6];
		tempHolder.bw8 = reportsItemData.bw_test[7];

		tempHolder.code = code;
		tempHolder.id = uuidv4();
		tempHolder.report_id = reports.id;
		tempHolder.created = new Date();

		[error,itemReport] = await to(createItemReport(
			res,
			tempHolder));

		if(error){
			console.log('CREATE ITEM REPORTS',err);
			return err_response(err,BAD_REQ,BAD_REQ,500);
		}

		[err,activity] = await to(updateActivity(res,id));

		
		if(error){
			console.log('UPDATE ACTIVITY',err);
			return err_response(err,BAD_REQ,BAD_REQ,500);
		}

		tempHolder.id = null;

		return res.send({
			message : 'Test created successfully',
			context: 'Data created successfully'
		}).status(200);

	}

	start();

}


/**
 * @api {get} v1/reports/:id                 Fetch One report 
 * @apiName Fetch Reports
 * @apiGroup Reports
 * 
 * @apiParam 		{String}       id		 Activity id
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
			report.id, \
			activity.name, \
			activity.description AS activity, \
			activity.staff, \
			activity.staff_id, \
			report.id AS activity_id, \
			item.code, \
			item.fw1, \
			item.fw2, \
			item.fw3, \
			item.fw4, \
			item.fw5, \
			item.fw6, \
			item.fw7, \
			item.fw8, \
			item.bw1, \
			item.bw2, \
			item.bw3, \
			item.bw4, \
			item.bw5, \
			item.bw6, \
			item.bw7, \
			item.bw8, \
			report.created \
			FROM \
			reports report \
			INNER JOIN reports_item_list item \
			ON report.id = item.report_id \
			INNER JOIN schedule_activity activity \
			ON report.activity_id = activity.id \
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

		return res.send({
			data : result,
			message : 'Report fetched successfully',
			context : 'Data fetched successfully'
		}).status(200);
	}

	start();
}


/**
 * @api {get} v1/average/reports            Fetch Report with average 
 * @apiName Fetch Average
 * @apiGroup Reports
 */


const monthly_reports = (req,res,next)=>{
	let {
		start_date,
		end_date
	} = req.query;

	let date_now = moment().format('YYYY-MM-DD'); 

	start_date = start_date? start_date : date_now;
	end_date = end_date? end_date : date_now;

	let query = `
			SELECT \
			AVG(item.fw1) AS avg_fw1, \
			AVG(item.fw2) AS avg_fw2, \
			AVG(item.fw3) AS avg_fw3, \
			AVG(item.fw4) AS avg_fw4, \
			AVG(item.fw5) AS avg_fw5, \
			AVG(item.fw6) AS avg_fw6, \
			AVG(item.fw7) AS avg_fw7, \
			AVG(item.fw8) AS avg_fw8, \
			AVG(item.bw1) AS avg_bw1, \
			AVG(item.bw2) AS avg_bw2, \
			AVG(item.bw3) AS avg_bw3, \
			AVG(item.bw4) AS avg_bw4, \
			AVG(item.bw5) AS avg_bw5, \
			AVG(item.bw6) AS avg_bw6, \
			AVG(item.bw7) AS avg_bw7, \
			AVG(item.bw8) AS avg_bw8 \
			FROM \
			reports report \
			LEFT JOIN reports_item_list item \
			ON report.id = item.report_id \
			WHERE DATE(report.created) >= '${start_date}' \
			AND DATE(report.created) <= '${end_date}'
			`;

	function start(){
		mysql.use('master')
		.query(query,send_response);
	}

	function send_response(err,result,args,last_query){
		if(err){
			console.log('REPORTS **',err);

			return err_response(res,err,BAD_REQ,500);
		
		}

		if(!result.length || result[0].avg_fw1 == null){

			return err_response(res,ZERO_RES,ZERO_RES,400);

		}

		let test = [
			(result[0].avg_fw1 + result[0].avg_bw1)/2,
			(result[0].avg_fw2 + result[0].avg_bw2)/2,
			(result[0].avg_fw3 + result[0].avg_bw3)/2,
			(result[0].avg_fw4 + result[0].avg_bw4)/2,
			(result[0].avg_fw5 + result[0].avg_bw5)/2,
			(result[0].avg_fw6 + result[0].avg_bw6)/2,
			(result[0].avg_fw7 + result[0].avg_bw7)/2,
			(result[0].avg_fw8 + result[0].avg_bw8)/2,
		];

		

		return res.send({
			data : result[0],
			message : 'Fetched reports successfully',
			context : 'Data fetched successfully'
		}).status(200);
	}

	start();
}




/**
 * @api {get} v1/reports               		Fetch Reports 
 * @apiName Fetch Reports
 * @apiGroup Reports
 * 
 */


const retrieve_all = (req,res,next)=>{
	let {
		start_date,
		end_date
	} = req.query;

	let date_now = moment().format('YYYY-MM-DD'); 
	let WHERE = ` WHERE report.deleted IS NULL `;

	// start_date = start_date? start_date : date_now;
	// end_date = end_date? end_date : date_now;

	// 	WHERE += `
	// 		AND DATE(report.created) \
	// 		BETWEEN '${start_date}' \
	// 		AND '${end_date}' \
	// 	`;
	

	let query = `
			SELECT \
			report.id, \
			activity.id AS activity_id, \
			activity.name, \
			activity.staff, \
			item.fw1, \
			item.fw2, \
			item.fw3, \
			item.fw4, \
			item.fw5, \
			item.fw6, \
			item.fw7, \
			item.fw8, \
			item.bw1, \
			item.bw2, \
			item.bw3, \
			item.bw4, \
			item.bw5, \
			item.bw6, \
			item.bw7, \
			item.bw8,
			report.created  \
			FROM \
			reports report \
			INNER JOIN reports_item_list item \
			ON report.id = item.report_id \
			INNER JOIN schedule_activity activity \
			ON report.activity_id = activity.id \
			${WHERE}
			`;

	function start(){
		mysql.use('master')
		.query(query,send_response);
	}

	function send_response(err,result,args,last_query){
		if(err){
			console.log('REPORT **',err);

			return err_response(res,err,BAD_REQ,500);
		
		}

		if(!result.length){

			return err_response(res,ZERO_RES,ZERO_RES,400);

		}


		return res.send({
			data : result,
			message : 'Fetched reports successfully',
			context : 'Data fetched successfully'
		}).status(200);
	}

	start();
}


/**
 * @api {get} v1/annual/reports               		Fetch Annual Reports 
 * @apiName Fetch Annual Reports
 * @apiGroup Reports
 * 
 */



const annual_reports = (req,res,next)=>{


	async function start(){
		let query = `
			SELECT \
			AVG((item.fw1+item.fw2+item.fw3+item.fw4+item.fw5+item.fw6+item.fw7+item.fw8))/8 AS avg_fw, \
			AVG((item.bw1+item.bw2+item.bw3+item.bw4+item.bw5+item.bw6+item.bw7+item.bw8))/8 AS avg_bw, \
			MONTH(report.created) AS Month \
			FROM \
			reports report \ 
			LEFT JOIN reports_item_list item \
			ON report.id = item.report_id \
			WHERE report.deleted IS null \
			GROUP BY YEAR(report.created), \
			MONTH(report.created) \
		`;

		let err,report;

		[err,report]= await to(mysql.build(query).promise());

		if(err){
			return err_response(res,BAD_REQ,err,500);
		}

		if(!report.length){
			return err_response(res,ZERO_RES,ZERO_RES,400);
		}

		return res.send({
			data : report,
			message : 'Annual report fetched successfully',
			context : 'Data fetched successfully'
		}).status(200);
	}

	start();
}



module.exports = {
	create_reports,
	show_reports,
	monthly_reports,
	annual_reports,
	retrieve_all
}