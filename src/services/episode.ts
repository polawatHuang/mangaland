import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Resp } from "@utils/Response";

const prisma = new PrismaClient();

export class EpisodeService {
  static async getAllEpisodes(req: Request, res: Response) {
    try {
      const episodes = await prisma.episode.findMany({
        include: {
          images: true,
          views: true,
          project: {
            select: {
              title: true,
            },
          },
        },
      });

      if (!episodes || episodes.length === 0) return res.status(404).json(Resp.error("No episodes found", { status: 404, meta: { timestamp: new Date().toISOString() } }));

      res.status(200).json(Resp.success(episodes, "Episodes retrieved successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
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
    }
  }

  static async getEpisodeById(req: Request, res: Response) {
    const { id } = req.params;

    if (isNaN(Number(id))) return res.status(400).json(Resp.error("Invalid id format", { status: 400, meta: { timestamp: new Date().toISOString() } }));

    try {
      if (!id) return res.status(400).json(Resp.error("Id is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));

      if (id.length < 1) return res.status(400).json(Resp.error("Id must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));

      const episode = await prisma.episode.findUnique({
        where: { id: parseInt(id) },
        include: {
          images: true,
          views: true,
        },
      });

      if (!episode) return res.status(404).json(Resp.error(`No episode found by id ${id}`, { status: 404, meta: { timestamp: new Date().toISOString() } }));

      res.status(200).json({ success: true, data: episode });
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
    }
  }

  static async createEpisode(req: Request, res: Response) {
    const { projectId, episodeNumber, title, description } = req.body;

    if (!projectId) return res.status(400).json(Resp.error("Project id is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (!episodeNumber) return res.status(400).json(Resp.error("Episode number is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (!title) return res.status(400).json(Resp.error("Title is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (!description) return res.status(400).json(Resp.error("Description is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));

    if (projectId.length < 1) return res.status(400).json(Resp.error("Project Id must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (episodeNumber.length < 1) return res.status(400).json(Resp.error("Episode Number must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (title.length < 1) return res.status(400).json(Resp.error("Title must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (description.length < 1) return res.status(400).json(Resp.error("Description must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));

    try {
      const newEpisode = await prisma.episode.create({
        data: {
          project: { connect: { id: projectId } },
          episodeNumber,
          title,
          description
        },
      });

      res.status(201).json(Resp.success(newEpisode, "Episode created successfully", { status: 201, meta: { timestamp: new Date().toISOString() } }));
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
    }
  }

  static async updateEpisode(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, episodeNumber } = req.body;

    if (!id) return res.status(400).json(Resp.error("Id is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (!episodeNumber) return res.status(400).json(Resp.error("Episode number is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (!title) return res.status(400).json(Resp.error("Title is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (!description) return res.status(400).json(Resp.error("Description is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));

    if (id.length < 1) return res.status(400).json(Resp.error("Id must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (episodeNumber.length < 1) return res.status(400).json(Resp.error("Episode Number must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (title.length < 1) return res.status(400).json(Resp.error("Title must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (description.length < 1) return res.status(400).json(Resp.error("Description must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));

    try {
      const updatedEpisode = await prisma.episode.update({
        where: { id: parseInt(id) },
        data: { title, description, episodeNumber },
      });

      if (!updatedEpisode) return res.status(404).json(Resp.error(`No episode found by id ${id}`, { status: 404, meta: { timestamp: new Date().toISOString() } }));

      res.status(201).json(Resp.success(updatedEpisode, "Episode update successfully", { status: 201, meta: { timestamp: new Date().toISOString() } }));
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
    }
  }

  static async deleteEpisode(req: Request, res: Response) {
    const { id } = req.params;

    if (isNaN(Number(id))) return res.status(400).json(Resp.error("Invalid id format", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (!id) return res.status(400).json(Resp.error("Id is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));
    if (id.length < 1) return res.status(400).json(Resp.error("Id must be at least 1 character", { status: 400, meta: { timestamp: new Date().toISOString() } }));

    try {
      const episode = await prisma.episode.delete({ where: { id: parseInt(id) } });

      if (!episode) return res.status(404).json(Resp.error(`No episode found by id ${id}`, { status: 404, meta: { timestamp: new Date().toISOString() } }));

      res.status(200).json(Resp.success(null, "Episode deleted successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
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
    }
  }
}