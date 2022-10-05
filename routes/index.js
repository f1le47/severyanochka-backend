const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const ratingRouter = require('./ratingRouter');
const brandRouter = require('./brandRouter');
const categoryRouter = require('./categoryRouter');
const articleRouter = require('./articleRouter');
const discountRouter = require('./discountRouter');
const favoriteRouter = require('./favoriteRouter');
const basketRouter = require('./basketRouter');
const savingsCardRouter = require('./savingsCardRouter');
const jobRouter = require('./jobRouter');

router.use('/user', userRouter);
router.use('/products', productRouter);
router.use('/rating', ratingRouter);
router.use('/brand', brandRouter);
router.use('/category', categoryRouter);
router.use('/articles', articleRouter);
router.use('/discount', discountRouter);
router.use('/favorite', favoriteRouter);
router.use('/basket', basketRouter);
router.use('/savings-card', savingsCardRouter);
router.use('/job', jobRouter);

module.exports = router;
