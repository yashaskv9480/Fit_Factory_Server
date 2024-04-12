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

module.exports = {
    upload_image
}