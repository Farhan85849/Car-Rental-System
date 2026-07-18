import { Request, Response } from 'express';
import { aiService } from '../services/aiService';

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    const response = await aiService.processChat(message, history);
    res.status(200).json({ success: true, data: response });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const handleSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    const response = await aiService.processSearch(query);
    res.status(200).json({ success: true, data: response });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const handleRecommendation = async (req: Request, res: Response) => {
  try {
    const { preferences } = req.body;
    const response = await aiService.processRecommendation(preferences);
    res.status(200).json({ success: true, data: response });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const handleAnalytics = async (req: Request, res: Response) => {
  try {
    const response = await aiService.generateAdminAnalytics();
    res.status(200).json({ success: true, data: response });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
