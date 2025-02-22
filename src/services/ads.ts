import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { Resp } from "@utils/Response";

const prisma = new PrismaClient();

export class AdsService {
    static async getAllAds(req: Request, res: Response) {
        try {
            const ads = await prisma.advertise.findMany();

            if (!ads || ads.length === 0) return res.status(404).json(Resp.error("No ads found", { status: 404, meta: { timestamp: new Date().toISOString() } }));

            res.status(200).json(Resp.success(ads, "Ads retrieved successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
        } catch (error: any) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(Resp.error("An error occurred", errorOptions));
        };
    };

    static async getAdsById(req: Request, res: Response) {
        const { id } = req.params;

        if (isNaN(Number(id))) return res.status(400).json(Resp.error("Invalid id format", { status: 400, meta: { timestamp: new Date().toISOString() } }));

        try {
            if (!id) return res.status(400).json(Resp.error("Id is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));

            if (id.length < 1) return res.status(400).json(Resp.error("Id must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));

            const ads = await prisma.advertise.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            if (!ads) return res.status(404).json(Resp.error(`No ads found by id ${id}`, { status: 404, meta: { timestamp: new Date().toISOString() } }));

            res.status(200).json(Resp.success(ads, "Ad retrieved successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
        } catch (error: any) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString(),
                    id
                }
            };
            res.status(500).json(Resp.error("An error occurred", errorOptions));
        };
    };

    static async createAds(req: Request, res: Response) {
        const { title, description, link, image, backgroundColor } = req.body;

        if (!title) return res.status(400).json(Resp.error("Title is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (!description) return res.status(400).json(Resp.error("Description is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (!link) return res.status(400).json(Resp.error("link is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (!image) return res.status(400).json(Resp.error("image is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (!backgroundColor) return res.status(400).json(Resp.error("background color is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));

        if (title.length < 1) return res.status(400).json(Resp.error("Title must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (description.length < 1) return res.status(400).json(Resp.error("Description must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (link.length < 1) return res.status(400).json(Resp.error("Link must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (image.length < 1) return res.status(400).json(Resp.error("Image must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (backgroundColor.length < 1) return res.status(400).json(Resp.error("Background color must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));

        try {
            const ads = await prisma.advertise.create({
                data: {
                    title,
                    description,
                    link,
                    image,
                    backgroundColor
                }
            });

            res.status(201).json(Resp.success(ads, "Ad created successfully", { status: 201, meta: { timestamp: new Date().toISOString() } }));
        } catch (error: any) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(Resp.error("An error occurred", errorOptions));
        };
    };

    static async updateAds(req: Request, res: Response) {
        const { id } = req.params;
        const { title, description, link, image, backgroundColor } = req.body;

        if (isNaN(Number(id))) return res.status(400).json(Resp.error("Invalid id format", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (!id) return res.status(400).json(Resp.error("Id is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (id.length < 1) return res.status(400).json(Resp.error("Id must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));

        if (!title) return res.status(400).json(Resp.error("Title is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (!description) return res.status(400).json(Resp.error("Description is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (!link) return res.status(400).json(Resp.error("link is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (!image) return res.status(400).json(Resp.error("image is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (!backgroundColor) return res.status(400).json(Resp.error("background color is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));

        if (title.length < 1) return res.status(400).json(Resp.error("Title must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (description.length < 1) return res.status(400).json(Resp.error("Description must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (link.length < 1) return res.status(400).json(Resp.error("Link must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (image.length < 1) return res.status(400).json(Resp.error("Image must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (backgroundColor.length < 1) return res.status(400).json(Resp.error("Background color must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));

        try {
            const ads = await prisma.advertise.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    title,
                    description,
                    link,
                    image,
                    backgroundColor
                }
            });

            if (!ads) return res.status(404).json(Resp.error(`No ads found by id ${id}`, { status: 404, meta: { timestamp: new Date().toISOString() } }));

            res.status(200).json(Resp.success(ads, "Ad updated successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
        } catch (error: any) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(Resp.error("An error occurred", errorOptions));
        };
    };

    static async deleteAds(req: Request, res: Response) {
        const { id } = req.params;

        if (isNaN(Number(id))) return res.status(400).json(Resp.error("Invalid id format", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (!id) return res.status(400).json(Resp.error("Id is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        if (id.length < 1) return res.status(400).json(Resp.error("Id must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));

        try {
            const ads = await prisma.advertise.delete({
                where: {
                    id: parseInt(id)
                }
            });

            if (!ads) return res.status(404).json(Resp.error(`No ads found by id ${id}`, { status: 404, meta: { timestamp: new Date().toISOString() } }));

            res.status(200).json(Resp.success(null, "Ads deleted successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
        } catch (error: any) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(Resp.error("An error occurred", errorOptions));
        };
    };
}