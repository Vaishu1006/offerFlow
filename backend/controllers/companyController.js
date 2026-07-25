import Company from "../models/Company.js";
import asyncHandler from "express-async-handler";

// @desc    Search companies
// @route   GET /api/companies/search
// @access  Private
export const searchCompanies = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.json([]);
    }
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const companies = await Company.find({
        name: { $regex: escapedQuery, $options: "i" },
    }).limit(5);

    res.status(200).json(companies);
});

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private/Admin
export const getAllCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find().sort({ name: 1 });

    res.status(200).json(companies);
});

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/Admin
export const updateCompany = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
        res.status(404);
        throw new Error("Company not found");
    }

    if (req.body.name !== undefined) {
        company.name = req.body.name;
    }

    if (req.body.website !== undefined) {
        company.website = req.body.website;
    }

    if (req.body.location !== undefined) {
        company.location = req.body.location;
    }

    if (req.body.description !== undefined) {
        company.description = req.body.description;
    }

    if (req.body.category !== undefined) {
        company.category = req.body.category;
    }

    const updatedCompany = await company.save();

    res.status(200).json({
        success: true,
        message: "Company updated successfully",
        company: updatedCompany,
    });
});

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/Admin
export const deleteCompany = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
        res.status(404);
        throw new Error("Company not found");
    }

    await company.deleteOne();

    res.status(200).json({
        success: true,
        message: "Company deleted successfully",
    });
});