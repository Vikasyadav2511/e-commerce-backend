import express from 'express'
import { addUser, getUsers,getUser,updateUser, softDelete, hardDelete, signUp, login, otp } from '../controllers/users.controllers';

const router = express.Router();

router.post('/add-user',addUser);

router.get('/get-users',getUsers);

router.get('/get-user/:user_id',getUser);

router.put("/update-User/:user_id", updateUser);

router.delete('/soft-delete/:user_id',softDelete);

router.delete('/hard-delete/:user_id',hardDelete);

router.post('/sign-up',signUp);

router.post('/login',login);

router.post('/otp',otp);


export default router;