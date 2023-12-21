import express from 'express'
import { addCategory, getCategories, getCategory, hardDeletecat, softDeleteCat, updateCategory } from '../controllers/category.controller';
const router =express.Router();


router.post('/add-category',addCategory);

router.get('/get-categories',getCategories);

router.get('/get-category/:category_id',getCategory);

router.put('/update-categories/:category_id',updateCategory);

router.delete('/cat-softdelete/:category_id',softDeleteCat);

router.delete('/hard-cat-delete/:category_id',hardDeletecat);


export default router