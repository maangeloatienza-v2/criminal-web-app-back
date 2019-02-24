'use strict';

const express           = require('express');
const router            = express.Router();
const checkAuthorization= require('./../middleware/checkauth');
const passport          = require('passport');
                          require('./../middleware/passport')(passport);
/* ROUTES */
const userController    = require('./../controllers/userController');
const roleController    = require('./../controllers/roleController');
const productController = require('./../controllers/productController');
const orderController 	= require('./../controllers/orderController');
const feedbackController= require('./../controllers/feedbackController');




router.get  ('/users',                                  userController.getUsers);
router.get  ('/users/:id',                              userController.getUserById);
router.post ('/users',                                  userController.createUser);
router.put  ('/users/:id',          checkAuthorization, userController.updateUser);
router.put  ('/delete-user/:id',    checkAuthorization, userController.deleteUser);
router.post ('/users/login',                            userController.login);
router.post ('/users/logout',       checkAuthorization, userController.logout);

router.post ('/roles',              checkAuthorization, roleController.createRole);
router.get  ('/roles',                                  roleController.getRole);

router.post ('/products',       	checkAuthorization, productController.create);
router.get  ('/products',       		 				productController.getProducts);
router.get  ('/products/:id',       		 			productController.getOneProduct);
router.put  ('/products/:id', 		checkAuthorization,	productController.updateProduct);
router.put  ('/delete-product/:id', checkAuthorization,	productController.deleteProduct);

router.post  ('/add-orders', 		checkAuthorization, orderController.addOrder);
router.get   ('/orders', 			checkAuthorization, orderController.getAll);
router.get   ('/orders/:id',		checkAuthorization, orderController.getOne);

router.post  ('/add-feedbacks', 		checkAuthorization, feedbackController.createFeedback);
router.get   ('/feedbacks/:id',		checkAuthorization, feedbackController.showProductFeedback);
router.put   ('/feedbacks/:id',		checkAuthorization, feedbackController.updateFeedback);
router.put   ('/delete-feedbacks/:id',checkAuthorization, feedbackController.deleteFeedback);





module.exports = router;