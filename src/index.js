const { app } = require('./app');
const connectDB  = require('./db/dbConnection');
require('dotenv').config();


connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log('Server is running on port', process.env.PORT || 5000);
    })
}
).catch((err) => {
    console.log("Failed to connect", err);
});