import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const { projectId, episodeNumber } = req.body;
    const date = new Date();
    const folderPath = path.join(
      __dirname,
      `../../../uploads/${date.getFullYear()}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${projectId}`
    );
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const { projectId, episodeNumber } = req.body;
    const timestamp = Date.now();
    const imageNumber = req.body.imageNumber || 1;
    cb(null, `${timestamp}_${projectId}_${episodeNumber}_${imageNumber}.webp`);
  },
});

const upload = multer({ storage: storage });

export class EpisodeService {
  static async getAllEpisodes(req: Request, res: Response): Promise<void> {
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
      res.status(200).json({ success: true, data: episodes });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching episodes", error });
    }
  }

  static async getEpisodeById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const episode = await prisma.episode.findUnique({
        where: { id: parseInt(id) },
        include: {
          images: true,
          views: true,
        },
      });
      if (!episode) {
        res.status(404).json({ success: false, message: "Episode not found" });
        return;
      }
      res.status(200).json({ success: true, data: episode });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching episode", error });
    }
  }

  static async createEpisode(req: Request, res: Response): Promise<void> {
    const { projectId, episodeNumber, title, description } = req.body;
    try {
      const newEpisode = await prisma.episode.create({
        data: {
          projectId,
          episodeNumber,
          title,
          description,
        },
      });
      res.status(201).json({ success: true, data: newEpisode });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error creating episode", error });
    }
  }

  static async updateEpisode(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { title, description, episodeNumber } = req.body;
    try {
      const updatedEpisode = await prisma.episode.update({
        where: { id: parseInt(id) },
        data: { title, description, episodeNumber },
      });
      res.status(200).json({ success: true, data: updatedEpisode });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating episode", error });
    }
  }

  static async deleteEpisode(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await prisma.episode.delete({ where: { id: parseInt(id) } });
      res.status(200).json({ success: true, message: "Episode deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error deleting episode", error });
    }
  }

  static async uploadEpisodeImage(req: Request, res: Response): Promise<void> {
    upload.single("image")(req, res, async (err: any) => {
      if (err) {
        res.status(500).json({ success: false, message: "Error uploading image", error: err });
        return;
      }
      //const { projectId, episodeNumber, imageNumber } = req.body;
      const filePath = req.file?.path;
      if (!filePath) {
        res.status(400).json({ success: false, message: "No file uploaded" });
        return;
      }
      res.status(201).json({ success: true, message: "Image uploaded successfully", filePath });
    });
  }
}