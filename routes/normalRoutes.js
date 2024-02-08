const express = require('express');
const normalRouter = express.Router();
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images'); // Adjust the destination folder as needed
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter });
  //Middleware
  const {verifyToken} = require('../middleware');
  //controllers
  const authController = require('../controllers/authController');
  const userController = require('../controllers/userController');
  const riderController = require('../controllers/riderController');
  const adminController = require('../controllers/adminController');
  const chatController = require('../controllers/chatController')
  
  //Auth Routes
  normalRouter.get('/getAllInformation',verifyToken,authController.getAllInformation);
  normalRouter.post('/login',authController.login);
  normalRouter.post('/userRegistration',upload.fields([{name:'image',maxCount:1}]),authController.userRegistration);
  normalRouter.post('/Token',authController.Token);
  normalRouter.post('/logout',verifyToken,authController.logout);
  normalRouter.post('/riderRegistration',upload.fields([{name:'image',maxCount:1}]),authController.riderRegistration);
  normalRouter.post('/riderSendApplication',upload.fields([{name:'file',maxCount:1}]),authController.riderSendApplication);


  //User Routes
  normalRouter.get('/puchaseHistory',verifyToken,userController.puchaseHistory);
  normalRouter.get('/getAllProduct',verifyToken,userController.getAllProduct);
  normalRouter.get('/trackMyorder',verifyToken,userController.trackMyorder)
  normalRouter.get('/featuredProducts',verifyToken,userController.featuredProducts)
  normalRouter.get('/getMyProductCart',verifyToken,userController.getMyProductCart);
  normalRouter.post('/getUsersInfo',verifyToken,userController.getUsersInfo);
  normalRouter.post('/UpdateQuantity',verifyToken,userController.UpdateQuantity);
  normalRouter.post('/viewProduct',verifyToken,userController.viewProduct);
  normalRouter.post('/viewProductCart',verifyToken,userController.viewProductCart);
  normalRouter.post('/addToCart',verifyToken,userController.addToCart);
  normalRouter.post('/checkout',verifyToken,userController.checkout);
  normalRouter.post('/changePassword',verifyToken,userController.changePassword);
  normalRouter.post('/changeAddress',verifyToken,userController.changeAddress);
  normalRouter.post('/changeInfo',verifyToken,userController.changeInfo)
  normalRouter.post('/changeProfilePic',upload.fields([{name:'image',maxCount:1}]),verifyToken,userController.changeProfilePic);
  normalRouter.post('/Rateproduct',verifyToken,userController.Rateproduct);
  normalRouter.post('/removeFromCart',verifyToken,userController.removeFromCart);
  normalRouter.post('/editCart',verifyToken,userController.editCart);
  normalRouter.post('/confirmDelivery',verifyToken,userController.confirmDelivery);
  normalRouter.post('/buyNow',verifyToken,userController.buyNow);

  

  //Admin Routes
  normalRouter.get('/getAllRiders',verifyToken,adminController.getAllRiders);
  normalRouter.get('/allSales',verifyToken,adminController.allSales);
  normalRouter.get('/deliveringItem',verifyToken,adminController.deliveringItem);
  normalRouter.get('/ProductSoldHistory',verifyToken,adminController.ProductSoldHistory)
  normalRouter.get('/getAllRidersApplicant',verifyToken,adminController.getAllRidersApplicant);
  normalRouter.get('/getAllItemsShipped',verifyToken,adminController.getAllItemsShipped);
  normalRouter.get('/getAllItemsProccessed',verifyToken,adminController.getAllItemsProccessed);
  normalRouter.get('/pendingOrders',verifyToken,adminController.pendingOrders);
  normalRouter.get('/getAllProductInserted',verifyToken,adminController.getAllProductInserted);
  normalRouter.post('/editproduct',upload.fields([{name:'image',maxCount:1}]),verifyToken,adminController.editProduct);
  normalRouter.post('/insertProduct',upload.fields([{name:'image',maxCount:1}]),verifyToken,adminController.insertProduct);
  normalRouter.post('/updateProof',verifyToken,adminController.updateProof);
  normalRouter.post('/itemProcess',verifyToken,adminController.itemProcess);
  normalRouter.post('/itemShipped',verifyToken,adminController.itemShipped);
  normalRouter.post('/addNewStocks',verifyToken,adminController.addNewStocks);
  normalRouter.post('/riderRegistration',verifyToken,adminController.riderRegistration);
  normalRouter.post('/acceptRiderApplicant',verifyToken,adminController.acceptRiderApplicant);
  normalRouter.post('/denyRiderApplicant',verifyToken,adminController.denyRiderApplicant);
  normalRouter.post('/unavailableStock',verifyToken,adminController.unavailableStock);
  normalRouter.post('/availableStock',verifyToken,adminController.availableStock);
  normalRouter.post('/deliver',verifyToken,adminController.deliver);



  //Rider Routes
  normalRouter.get('/getAllItemDelivered',verifyToken,riderController.getAllItemDelivered);
  normalRouter.get('/getDeliverItem',verifyToken,riderController.getDeliverItem);
  normalRouter.get('/getAllItemNeedtoDeliver',verifyToken,riderController.getAllItemNeedtoDeliver);
  normalRouter.post('/addTodeliver',verifyToken,riderController.addTodelivery);
  normalRouter.post('/deliveredItem',upload.fields([{name:'image',maxCount:1}]),verifyToken,riderController.deliveredItem);



  //chat routes
  normalRouter.get('/getMyRoom',verifyToken,chatController.getMyRoom);
  normalRouter.get('/getAllRooms',verifyToken,chatController.getAllRooms);
  normalRouter.post('/getConvo',verifyToken,chatController.getConvo);
  
  module.exports = normalRouter;