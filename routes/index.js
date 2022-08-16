const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const ratingRouter = require('./ratingRouter');
const brandRouter = require('./brandRouter');
const categoryRouter = require('./categoryRouter');

router.use('/user', userRouter);
router.use('/products', productRouter);
router.use('/rating', ratingRouter);
router.use('/brand', brandRouter);
router.use('/category', categoryRouter);

module.exports = router;
