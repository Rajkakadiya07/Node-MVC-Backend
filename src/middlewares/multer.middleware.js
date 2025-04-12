const multer = require('multer');
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, '../public/temp/');
    },
    filename:(req, file, cb)=>{
        const unique = Date.now()+'-'+Math.round(Math.random()*1E9);
        cb(null, file.fieldname+'-'+ unique);
    }

})
const upload = multer({storage})
module.exports={upload}