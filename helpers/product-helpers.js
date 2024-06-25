var db=require('../config/connection')
var collection=require('../config/collections')
const { request } = require('express')
var objectId=require('mongodb').ObjectID

module.exports={
    addProduct:(product,callback)=>{
        // console.log(product);
         db.get().collection('product').insertOne(product).then((data)=>{
            // console.log(data)
            callback(data.ops[0]._id)

         }) 

    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)

        })   //prmise return cheyyan koduthuuu

    }, 
    deleteProducts:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductdetails:(proId)=>{
        return new Promise((resolve,request)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(prodId,proDetails)=>{
        return new Promise((resolve,request)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(prodId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Describtion,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
}