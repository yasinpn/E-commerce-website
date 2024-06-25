var express = require('express');
//const { render } = require('../app');
var productHelper=require('../helpers/product-helpers');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');


/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products)
    res.render('admin/view-products',{admin:true,products})

  })


});

router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})

router.post('/add-product',(req,res)=>{
  // console.log(req.body);
  //console.log(req.file.Image);
  productHelpers.addProduct(req.body,(id)=>{ 
    let image=req.files.Image
    console.log(id)
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-product")
      }
      else console.log(err)
    })
  })
}) 

router.get('/delete-product',(req,res)=>{
  let proId=req.query.id;
  console.log(proId);
  productHelper.deleteProducts(proId).then((response)=>{
    res.redirect('/admin/')
  })
})

router.get('/edit-product/:id',async (req,res)=>{
  let product=await productHelpers.getProductdetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.id) 
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      image=req.files.Image
      image.mv('./public/product-images/'+req.params.id+'.jpg')

    }
  })

})
module.exports = router;
