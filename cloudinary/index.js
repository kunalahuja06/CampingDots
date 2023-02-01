const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name:'dgpmf9k5q',
    api_key:'639354477653516',
    api_secret:'5cQUESC5ay5uIHsvvWH3d8JUeWM'
})

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'yelpCamp',
        allowedFormats:['jpeg','png','jpg','mp4']
    }
})

module.exports={
    cloudinary,
    storage
}