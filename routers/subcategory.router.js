import express from 'express'
import { addSubcategory, getSubCategories, getSubCategory, hardDeletesubcat, softDeletesubCat, updateSubCategory } from '../controllers/subcategory.controller';

const router = express.Router();

router.post('/add-subcategory',addSubcategory);

router.get('/get-Subcategories',getSubCategories);

router.get('/get-Subcategory/:subcategory_id',getSubCategory);

router.put('/update-Subcategory/:subcategory_id',updateSubCategory);

router.delete('/soft-delete-subcat/:subcategory_id',softDeletesubCat);

router.delete('/hard-delete-subcat/:subcategory_id',hardDeletesubcat);

export default router