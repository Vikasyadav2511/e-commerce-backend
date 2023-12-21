import express from 'express';
import { addbrand, getbrand, getbrands, hardDeletebrand, softDeleteBrand, updatebrand } from '../controllers/brand.controller';

const router = express.Router();
  console.log(router)

router.post('/add-brand',addbrand);
router.get('/get-brands',getbrands);
router.get('/get-brand/:brandcategory_id',getbrand);
router.put('/update-brand/:brandcategory_id',updatebrand);
router.delete('/soft-brand-delete/:brand_id',softDeleteBrand);
router.delete('/hard-delete-brand/:brand_id',hardDeletebrand)



export default router