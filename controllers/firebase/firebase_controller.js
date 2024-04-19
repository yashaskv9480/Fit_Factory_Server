const admin = require('firebase-admin');
const dotenv = require('dotenv')
dotenv.config()
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG || {})
const { getStorage, getDownloadURL } = require('firebase-admin/storage');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});


async function upload_image(imageBuffer,imageName) {
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(imageName);
        const result = await file.save(imageBuffer, { contentType: 'image/jpeg' });
        console.log('Image uploaded successfully:', result);
        return result;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Error uploading image.');
    }
}

async function downlaod_image(imageName){
        try {
          const bucket = admin.storage().bucket();
          const fileRef = bucket.file(imageName);
          const downloadURL= await getDownloadURL(fileRef);
    
          return downloadURL;
        } catch (error) {
          console.error('Error fetching images:', error);
          return null
        }
}

module.exports = {
    upload_image,
    downlaod_image
}