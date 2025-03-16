const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const cookieParser = require('cookie-parser');

dotenv.config(); 

connectDB();

const app = express();

// body parser middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID }); 
});

// const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(process.cwd(), '/frontend/build')));
  app.get('*', (req, res) => res.sendFile
  (path.resolve(process.cwd(), 'frontend', 'build', 'index.html')));
}
else{
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
