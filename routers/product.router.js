import express from 'express'
import { UpdateProduct, addProduct, getProducts, hardDeleteproducts, softDeleteCat } from '../controllers/product.controller';

const router = express.Router();

router.post('/add-product',addProduct);
router.get('/get-products',getProducts);
router.put('/update-products/:product_id',UpdateProduct);
router.delete('/soft-delete/:product_id',softDeleteCat);
router.delete('/hard-delete/:product_id',hardDeleteproducts);


export default router;

