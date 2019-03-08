define({ "api": [
  {
    "type": "post",
    "url": "v1/add-feedback",
    "title": "Add feedback",
    "name": "Add_feedback",
    "group": "Feedbacks",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Feedback description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "product_id",
            "description": "<p>Product's id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/feedbackController.js",
    "groupTitle": "Feedbacks"
  },
  {
    "type": "put",
    "url": "v1/delete-feedbacks/:id",
    "title": "Delete feedbacks",
    "name": "Delete_feedback",
    "group": "Feedbacks",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the feedback</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/feedbackController.js",
    "groupTitle": "Feedbacks"
  },
  {
    "type": "get",
    "url": "v1/show-feedbacks/:id",
    "title": "Fetch feedbacks",
    "name": "Fetch_feedback",
    "group": "Feedbacks",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the product</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/feedbackController.js",
    "groupTitle": "Feedbacks"
  },
  {
    "type": "put",
    "url": "v1/feedbacks/:id",
    "title": "Update feedbacks",
    "name": "Update_feedback",
    "group": "Feedbacks",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the feedback</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/feedbackController.js",
    "groupTitle": "Feedbacks"
  },
  {
    "type": "post",
    "url": "v1/add-orders",
    "title": "Create order",
    "name": "Create_Order",
    "group": "Orders",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "products[]",
            "description": "<p>Array of products</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "products.product_name",
            "description": "<p>Product name</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "products.item_price",
            "description": "<p>Product price</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "products.quantity",
            "description": "<p>Product quantity</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/orderController.js",
    "groupTitle": "Orders"
  },
  {
    "type": "get",
    "url": "v1/orders/:id",
    "title": "Fetch specific order",
    "name": "Get_Order",
    "group": "Orders",
    "version": "0.0.0",
    "filename": "controllers/orderController.js",
    "groupTitle": "Orders"
  },
  {
    "type": "get",
    "url": "v1/orders",
    "title": "Fetch orders",
    "name": "Get_Orders",
    "group": "Orders",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>Search order by first_name,last_name,username.code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "product_name",
            "description": "<p>Filter matching Product name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Filter by username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "first_name",
            "description": "<p>Filter by first_name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "last_name",
            "description": "<p>Filter by last_name</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/orderController.js",
    "groupTitle": "Orders"
  },
  {
    "type": "post",
    "url": "v1/products",
    "title": "Create Product",
    "name": "Create_Product",
    "group": "Products",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the product</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Product description</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "price",
            "description": "<p>Product's price</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/productController.js",
    "groupTitle": "Products"
  },
  {
    "type": "post",
    "url": "v1/products/:id",
    "title": "Delete Product",
    "name": "Delete_Product",
    "group": "Products",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the product</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/productController.js",
    "groupTitle": "Products"
  },
  {
    "type": "get",
    "url": "v1/products/:id",
    "title": "Fetch Specific Product information",
    "name": "Get_One_Product",
    "group": "Products",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the product</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/productController.js",
    "groupTitle": "Products"
  },
  {
    "type": "get",
    "url": "v1/products",
    "title": "Fetch Product information",
    "name": "Get_Products",
    "group": "Products",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>Search matching name</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/productController.js",
    "groupTitle": "Products"
  },
  {
    "type": "put",
    "url": "v1/products/:id",
    "title": "Update Product",
    "name": "Update_Product",
    "group": "Products",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the product</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Name of the product</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>Product description</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": true,
            "field": "price",
            "description": "<p>Product's price</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/productController.js",
    "groupTitle": "Products"
  },
  {
    "type": "POST",
    "url": "v1/reports/:id",
    "title": "Create reports",
    "name": "Create_Report",
    "group": "Reports",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Activity id</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "fw_test[]",
            "description": "<p>Array of fw test result</p>"
          },
          {
            "group": "Parameter",
            "type": "Float",
            "optional": false,
            "field": "bw_test[]",
            "description": "<p>Array of bw test result</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/reportController.js",
    "groupTitle": "Reports"
  },
  {
    "type": "get",
    "url": "v1/reports/:id",
    "title": "Fetch One report",
    "name": "Fetch_Reports",
    "group": "Reports",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Activity id</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/reportController.js",
    "groupTitle": "Reports"
  },
  {
    "type": "get",
    "url": "v1/reports",
    "title": "Fetch Monthly report",
    "name": "Fetch_Reports",
    "group": "Reports",
    "version": "0.0.0",
    "filename": "controllers/reportController.js",
    "groupTitle": "Reports"
  },
  {
    "type": "post",
    "url": "v1/roles",
    "title": "Create Roles",
    "name": "Create_Role",
    "group": "Roles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the role</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/roleController.js",
    "groupTitle": "Roles"
  },
  {
    "type": "get",
    "url": "v1/roles",
    "title": "Fetch Roles",
    "name": "Fetch_Role",
    "group": "Roles",
    "version": "0.0.0",
    "filename": "controllers/roleController.js",
    "groupTitle": "Roles"
  },
  {
    "type": "get",
    "url": "v1/roles/:id",
    "title": "Fetch One Role",
    "name": "Fetch_Role",
    "group": "Roles",
    "version": "0.0.0",
    "filename": "controllers/roleController.js",
    "groupTitle": "Roles"
  },
  {
    "type": "post",
    "url": "v1/cancel-activity/:id",
    "title": "Mark Activity as cancelled",
    "name": "Cancel_Activity",
    "group": "Schedule_Activity",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the activity</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/scheduleTestController.js",
    "groupTitle": "Schedule_Activity"
  },
  {
    "type": "post",
    "url": "v1/complete-activity/:id",
    "title": "Mark Activity as completed",
    "name": "Complete_Activity",
    "group": "Schedule_Activity",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the activity</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/scheduleTestController.js",
    "groupTitle": "Schedule_Activity"
  },
  {
    "type": "post",
    "url": "v1/activity",
    "title": "Create Scheduled Activity",
    "name": "Create_Activity",
    "group": "Schedule_Activity",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "scheduled_date",
            "description": "<p>Scheduled date for the activity</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Activity description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Activity name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "staff",
            "description": "<p>Activity assigned to</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/scheduleTestController.js",
    "groupTitle": "Schedule_Activity"
  },
  {
    "type": "post",
    "url": "v1/activity",
    "title": "Fetch Scheduled Activity",
    "name": "Fetch_Activities",
    "group": "Schedule_Activity",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "completed",
            "description": "<p>Show completed activities (completed=true)</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "cancelled",
            "description": "<p>Show cancelled activities (cancelled=true)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "order",
            "description": "<p>Order schedules by ASC or DESC (ascending,descending--date)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/scheduleTestController.js",
    "groupTitle": "Schedule_Activity"
  },
  {
    "type": "put",
    "url": "v1/activity/:id",
    "title": "Update Activity",
    "name": "Update_Activity",
    "group": "Schedule_Activity",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the activity</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "scheduled_date",
            "description": "<p>Scheduled date for the activity</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "description",
            "description": "<p>Activity description</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Activity name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "staff",
            "description": "<p>Activity assigned to</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/scheduleTestController.js",
    "groupTitle": "Schedule_Activity"
  },
  {
    "type": "post",
    "url": "v1/users",
    "title": "Create User",
    "name": "Create_User",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>First name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>Last name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirm_password",
            "description": "<p>Confirm user's Password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone_number",
            "description": "<p>Phone number of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role_id",
            "description": "<p>Role id of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/userController.js",
    "groupTitle": "Users"
  },
  {
    "type": "put",
    "url": "v1/delete-user/:id",
    "title": "Delete User",
    "name": "Delete_User",
    "group": "Users",
    "version": "0.0.0",
    "filename": "controllers/userController.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "v1/users/:id",
    "title": "Request Specific User information",
    "name": "Get_User_By_Id",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>First name of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>Last name of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone_number",
            "description": "<p>Phone number of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role_id",
            "description": "<p>Role id of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/userController.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "v1/users",
    "title": "Request User information",
    "name": "Get_Users",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "search",
            "description": "<p>Search matching first name,last name,username</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>First name of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>Last name of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email address of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phone_number",
            "description": "<p>Phone number of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role_id",
            "description": "<p>Role id of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>Address of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/userController.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "v1/users/login",
    "title": "Login User information",
    "name": "Login_User",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Username of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>Password of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/userController.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "v1/users/logout",
    "title": "Logout User",
    "name": "Logout_User",
    "group": "Users",
    "version": "0.0.0",
    "filename": "controllers/userController.js",
    "groupTitle": "Users"
  },
  {
    "type": "put",
    "url": "v1/users/:id",
    "title": "Update User information",
    "name": "Update_User",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "first_name",
            "description": "<p>First name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "last_name",
            "description": "<p>Last name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>Username of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>Password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Email address of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone_number",
            "description": "<p>Phone number of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "role_id",
            "description": "<p>Role id of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "address",
            "description": "<p>Address of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/userController.js",
    "groupTitle": "Users"
  }
] });
