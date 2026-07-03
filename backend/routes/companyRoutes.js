import express from "express";
import {
    searchCompanies,
    getAllCompanies,
    updateCompany,
    deleteCompany,
} from "../controllers/companyController.js";

import { protectRoute } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/search", protectRoute, searchCompanies);

router.get("/", protectRoute, checkRole("admin"), getAllCompanies);

router.put("/:id", protectRoute, checkRole("admin"), updateCompany);

router.delete("/:id", protectRoute, checkRole("admin"), deleteCompany);

export default router;