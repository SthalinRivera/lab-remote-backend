// users.routes.js

import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import isAdmin from "../middlewares/isAdmin.js"; // ajusta ruta si es necesario

const router = Router();



router.get("/", UsersController.getUsers);
router.get("/:id", UsersController.getUser);
router.put("/:id/role", UsersController.updateRole);
router.delete("/:id", UsersController.deleteUser);


// Nuevas rutas
router.post("/", UsersController.createUser);          // crear individual
router.put("/:id", UsersController.updateUser);        // actualizar datos
router.post("/bulk", UsersController.createUsersBulk); // creación masiva


export default router;