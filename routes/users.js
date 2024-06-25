var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');

const verifylogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res .redirect('/login')
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {

  let user=req.session.user
  console.log(user)
  productHelpers.getAllProducts().then((products)=>{
    //console.log(products)
    res.render('user/view-products',{admin:false,products,user})

  })

  //res.render('index', { products,admin:false });
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
  res.render('user/login',{loginErr:req.session.logInErr})}
  req.session.logInErr=false
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    req.session.loggedIn=true;
    req.session.user=response;
    res.redirect('/');
  })
})

router.post('/login',(req,res)=>{
  userHelpers.dologin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/') //no need of render to go to home page  since we done it in top get('/')
    }else{
      req.session.logInErr="invalid username or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',verifylogin,async(req,res)=>{
  let products=await userHelpers.getCartProducts(req.session.user._id)
  console.log(products)
  res.render('user/cart',{products,user:req.session.user})
})

router.get('/add-to-cart/:id',verifylogin,(req,res)=>{
  //console.log("api call");
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })
})


module.exports = router;
