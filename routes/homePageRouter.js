const express = require("express") ; 
const router = express.Router(); 
const homeController = require("../controllers/homePageController") ; 

// If the user is already logged in then below three controller function take care that user
// can not access the requested links.
router.get("/" , homeController.renderHomePage) ; 
router.get("/sign-in" , homeController.renderSigninPage) ;
router.get("/sign-up", homeController.renderSignUpPage ) ;

// below two is used to redirect request to desired path
router.use("/users" , require("./userPagesRouter")) ; 


module.exports = router ; 
