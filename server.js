const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const {notFound, errorHandler} = require('./middlewares/errorHandleMiddleware');

const userRouter = require('./routes/userRouter')

dotenv.config();

const app = express();

connectDB();

app.use(morgan('dev'))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Api is running...')
})

app.use('/api/v1/users', userRouter);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
})