'use strict';

const express           = require('express');
const router            = express.Router();
const multer  			= require('multer');
const checkAuthorization= require('./../middleware/checkauth');
const passport          = require('passport');
                          require('./../middleware/passport')(passport);
/* ROUTES */
const userController    = require('./../controllers/userController');
const roleController    = require('./../controllers/roleController');
const productController = require('./../controllers/productController');
const orderController 	= require('./../controllers/orderController');
const orderControllerv2 = require('./../controllers/orderController_v2');
const feedbackController= require('./../controllers/feedbackController');
const scheduleController= require('./../controllers/scheduleTestController');
const reportController  = require('./../controllers/reportController');


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')	
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })

// const upload 			= multer({ storage: storage });

const upload 			= multer({ dest: 'uploads/' });






router.get  ('/users',                                  userController.getUsers);
router.get  ('/users/:id',                              userController.getUserById);
router.post ('/users',                                  userController.createUser);
router.put  ('/users/:id',			checkAuthorization, userController.updateUser);
router.put  ('/delete-user/:id',    checkAuthorization, userController.deleteUser);
router.post ('/users/login',                            userController.login);
router.post ('/users/logout',       checkAuthorization, userController.logout);
router.put  ('/update-password/:id',checkAuthorization, userController.updatePassword);

router.post ('/roles',              checkAuthorization, roleController.createRole);
router.get  ('/roles',                                  roleController.getRole);
router.get  ('/roles/:id',                              roleController.getOneRole);


router.post ('/products', checkAuthorization, upload.single('file'), productController.create);
router.get  ('/products',       		 				productController.getProducts);
router.get  ('/products/:id',       		 			productController.getOneProduct);
router.put  ('/products/:id', checkAuthorization, upload.single('file'), 		checkAuthorization,	productController.updateProduct);
router.put  ('/delete-product/:id', checkAuthorization,	productController.deleteProduct);

// router.post ('/add-orders', 		checkAuthorization, orderController.addOrder);
// router.get  ('/orders', 			checkAuthorization, orderController.getAll);
// router.get  ('/orders/:id',			checkAuthorization, orderController.getOne);

router.post ('/orders', 			checkAuthorization, orderControllerv2.create);
router.get  ('/orders', 			checkAuthorization, orderControllerv2.getAll);
router.get  ('/orders/:id',			checkAuthorization, orderControllerv2.getOne);
router.put  ('/orders/:id',			checkAuthorization, orderControllerv2.markComplete);
router.get  ('/orders/customer',    checkAuthorization, orderControllerv2.getPerStaff);



router.post ('/add-feedbacks', 		checkAuthorization, feedbackController.createFeedback);
router.get  ('/feedbacks/:id',		checkAuthorization, feedbackController.showProductFeedback);
router.put  ('/feedbacks/:id',		checkAuthorization, feedbackController.updateFeedback);
router.put  ('/delete-feedbacks/:id',checkAuthorization, feedbackController.deleteFeedback);

router.post ('/activity',			checkAuthorization, scheduleController.createSchedule);
router.get  ('/activity', 			checkAuthorization, scheduleController.showSchedule);
router.put  ('/activity/:id', 		checkAuthorization, scheduleController.updateActivity);
router.post ('/cancel-activity/:id',checkAuthorization, scheduleController.cancel_activity);
router.post ('/complete-activity/:id',checkAuthorization, scheduleController.complete_activity);

router.post ('/reports/:id', 		checkAuthorization, reportController.create_reports);
router.get  ('/reports/:id', 	     reportController.show_reports);
router.get  ('/reports', 	     	 reportController.retrieve_all);
router.get  ('/average/reports', 	 reportController.monthly_reports);
router.get  ('/annual/reports', 	 reportController.annual_reports);






module.exports = router;