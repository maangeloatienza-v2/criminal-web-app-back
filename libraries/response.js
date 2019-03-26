'use strict';
require('./../config/err_config');



exports.err_response = (res,message,context,status)=>{
    res.status(status).send({
        message : message,
        context : context
    });
}