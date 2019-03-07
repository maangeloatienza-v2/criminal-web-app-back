'use strict';

const mysql             = require('anytv-node-mysql');
const util              = require('./../helpers/util');
const uuidv4            = require('uuid/v4');
const jwt               = require('jsonwebtoken');
const err_response      = require('./../libraries/response').err_response;
const tx_code      		= require('./../libraries/code_generator').randomAlphanumeric;
                          require('./../config/err_config');
                          require('./../config/config');

const schedule = {
	scheduled_date : '',
	description : '',
	name : '',
	staff : ''
}

const scheduleOpt = {
	_scheduled_date : '',
	_description : '',
	_name : '',
	_staff : ''
}


const cancelActivity = {
	cancelled : ''
}

const completeActivity = {
	completed : ''
}

async function checkActivity(res,queryString){

	let query = `SELECT * from schedule_activity WHERE ${queryString}`;

	let err,activity;

	[err,activity] = await to(mysql.build(query).promise());

	if(err) return err_response(res,err,BAD_REQ,500);

	if(!activity.length){
		return false;
	}

	return true;

}

async function getActivity(res,queryString){

	let query = `SELECT * from schedule_activity WHERE deleted IS null ${queryString}`;

	let err,activity;

	[err,activity] = await to(mysql.build(query).promise());

	if(err) return err_response(res,err,BAD_REQ,500);

	if(!activity.length) return err_response(res,ZERO_RES,ZERO_RES,400);
	

	return activity[0];

}

/**
 * @api {post} v1/activity                  Create Scheduled Activity 
 * @apiName Create Activity
 * @apiGroup Schedule Activity
 * 
 * @apiParam {String}       scheduled_date  Scheduled date for the activity
 * @apiParam {String}		description		Activity description	
 * @apiParam {String}		name			Activity name	
 * @apiParam {String}		staff			Activity assigned to	
 */


const createSchedule = (req,res,next)=>{
    res.setHeader('Content-Type', 'application/json');

	let data = util._get
    .form_data(schedule)
    .from(req.body);


	function start(){

		if(data instanceof Error){
			return err_response(res,data.message,INC_DATA,500);
		}
		
		data.id = uuidv4();
		data.created = new Date();
		data.scheduled_date = `${data.scheduled_date} 00:00:00`;
		data.user_id = req.user.id;
		
		mysql.use('master')
			.query(`INSERT INTO schedule_activity SET ?`,data,send_response)
			.end();

	}

	async function send_response(err,result,args,last_query){

        if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.affectedRows){
            return err_response(res,ERR_CREATING,NO_RECORD_CREATED,402)
        }

        return res.json({
        	data : data,
        	message : 'Activity successfully scheduled',
        	context : 'Data created successfully'
        })
        .status(200)
        .send();

	}

	start();


}


/**
 * @api {post} v1/activity       			Fetch Scheduled Activity 
 * @apiName Fetch Activities
 * @apiGroup Schedule Activity
 *
 *
 * @apiParam {Boolean}      completed  		Show completed activities (completed=true)
 * @apiParam {Boolean}      cancelled  		Show cancelled activities (cancelled=true)  
 * @apiParam {String}       order  			Order schedules by ASC or DESC (ascending,descending--date)
 */




const showSchedule = (req,res,next)=>{

	const {
		order,
		completed,
		cancelled,
		both
	} = req.query;

	let where = ` WHERE schedule_activity.deleted IS null `;
	
	if(completed==true){
		
		where += 
		`
			AND completed IS NOT null \
		`;
	}

	if(cancelled==true){
		where += 
		`
			AND cancelled IS NOT null \		
		`;
	}

	if(completed==false){
		
		where += 
		`
			AND completed IS null \
		`;
	}

	if(cancelled==false){
		where += 
		`
			AND cancelled IS null \		
		`;
	}

	if(both==true){
		where += 
		`
			AND cancelled IS NOT null \
			AND completed IS NOT null \	
		`;
	}

	if(both==false){
		where += 
		`
			AND cancelled IS null \
			AND completed IS null \	
		`;
	}


	if(order){
		where += 
		`
			ORDER BY DATE(scheduled_date) ${order}
		`;
	}
	let query = 
	`SELECT \
	 schedule_activity.id AS id,  \
	 DATE(schedule_activity.scheduled_date) AS scheduled_date,  \
	 schedule_activity.name AS name,  \
	 schedule_activity.description AS description,  \
	 schedule_activity.completed AS completed,  \
	 schedule_activity.cancelled AS cancelled,  \
	 schedule_activity.staff AS staff,  \
	 user.first_name AS creator_first_name, \
	 user.last_name AS creator_last_name, \
	 user.username AS username \
	 FROM schedule_activity schedule_activity \
	 LEFT JOIN users user \
		ON user.id = schedule_activity.user_id \
	 ${where}
	`;
	console.log(query);

	function start(){

		mysql.use('master')
			.query(query,send_response)
			.end();

	}

	function send_response(err,result,args,last_query){

		if(err){
            return err_response(res,BAD_REQ,err,500);
        }

        if(!result.length){
            return err_response(res,ZERO_RES,ZERO_RES,404)
        }

        return res.json({
        	data : result,
        	message : 'Successfully fetched scheduled activities',
        	context : 'Fetched data successfully'
        })
        .status(200)

	}

	start();
}



/**
 * @api {post} v1/cancel-activity/:id       Mark Activity as cancelled
 * @apiName Cancel Activity
 * @apiGroup Schedule Activity
 * 
 * @apiParam {String}       id  			Id of the activity
 */


const cancel_activity = (req,res,next)=>{
	const id = req.params.id;
	
	let cancelled  = '';

	let err,activity;

	async function start(){

		[err,activity] = await to(checkActivity(res,' cancelled IS null AND completed IS null '));

		if(err) return err_response(res,err,BAD_REQ,500);

		if(!activity){
			return err_response(res,'Cannot cancel activity, check activity status',BAD_REQ,500);
		}
		cancelled = new Date();
		mysql.use('master')
			.query(`UPDATE schedule_activity SET cancelled = ? WHERE id = '${id}'`,cancelled,(err,result,args,last_query)=>{
				if(err){
					return err_response(res,err,BAD_REQ,500);
				}

				if(!result.affectedRows){
					return err_response(res,NO_RECORD_UPDATED,NO_RECORD_UPDATED,400);
				}

				return res.json({
					message : 'Activity marked as cancelled',
					context : 'Data updated successfully'
				})
			})
	} 

	start();

}



/**
 * @api {post} v1/complete-activity/:id     Mark Activity as completed 
 * @apiName Complete Activity
 * @apiGroup Schedule Activity
 * 
 * @apiParam {String}       id  			Id of the activity
 */


const complete_activity = (req,res,next)=>{
	const id = req.params.id;
	
	let completed  = '';

	let err,activity;

	async function start(){

		[err,activity] = await to(checkActivity(res,' cancelled IS null AND completed IS null '));

		if(err) return err_response(res,err,BAD_REQ,500);

		if(!activity){
			return err_response(res,'Cannot cancel activity, check activity status',BAD_REQ,500);
		}
		completed = new Date();
		mysql.use('master')
			.query(`UPDATE schedule_activity SET completed = ? WHERE id = '${id}'`,completed,(err,result,args,last_query)=>{
				if(err){
					return err_response(res,err,BAD_REQ,500);
				}

				if(!result.affectedRows){
					return err_response(res,NO_RECORD_UPDATED,NO_RECORD_UPDATED,400);
				}

				return res.json({
					message : 'Activity marked as completed',
					context : 'Data updated successfully'
				})
			})
	} 

	start();

}

/**
 * @api {put} v1/activity/:id  	             Update Activity 
 * @apiName Update Activity
 * @apiGroup Schedule Activity
 * 
 * @apiParam {String}       id  			 Id of the activity
 *
 * @apiParam {String}       [scheduled_date] Scheduled date for the activity
 * @apiParam {String}		[description]	 Activity description	
 * @apiParam {String}		[name]			 Activity name	
 * @apiParam {String}		[staff]			 Activity assigned to	
 */



const updateActivity = (req,res,next)=>{
	const id = req.params.id;
	const data = util._get
	.form_data(scheduleOpt)
	.from(req.body);

	async function start(){

		let error,activity;

		if(data instanceof Error){
            return err_response(res,data.message,INC_DATA,500);
		}

		[error,activity] = await to(getActivity(res,` AND id = '${id}'`));
		console.log(error);
		if(error) return err_response(res,error,BAD_REQ,500);
		data.updated = new Date();
		mysql.use('master')
			.query(`UPDATE schedule_activity SET ? WHERE id = '${id}' AND deleted IS null`,data,
			async (err,result,args,last_query)=>{
				console.log(err);
				
				if(err) return err_response(res,BAD_REQ,BAD_REQ,500);

				if(!result.affectedRows) return err_response(res,NO_RECORD_UPDATED,NO_RECORD_UPDATED,500);
				
				let updatedActivity;

				[error,updatedActivity] = await to(getActivity(res,` AND id = '${id}'`));
				console.log(error);

				if(error) return err_response(res,error,BAD_REQ,500);

				return res.json({
					data: updatedActivity,
					message : 'Successfully updated scheduled activity',
					context : 'Data updated successfully'
				})
				.status(200)
				.send()

			})
			.end();
	}

	start();

}


module.exports = {
	createSchedule,
	showSchedule,
	cancel_activity,
	complete_activity,
	updateActivity
}