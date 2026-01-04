import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FIGMA_API_BASE = 'https://api.figma.com/v1';

class FigmaClient {
    constructor() {
        this.token = process.env.FIGMA_TOKEN;
        if (!this.token) {
            console.warn('WARNING: FIGMA_TOKEN is not set in .env. Tools requiring Figma API will fail.');
        }
        this.client = axios.create({
            baseURL: FIGMA_API_BASE,
            headers: {
                'X-Figma-Token': this.token,
            },
        });
    }

    async getFile(fileKey) {
        const response = await this.client.get(`/files/${fileKey}`);
        return response.data;
    }

    async getNode(fileKey, nodeId) {
        const response = await this.client.get(`/files/${fileKey}/nodes`, {
            params: { ids: nodeId },
        });
        return response.data;
    }

    async getImage(fileKey, nodeId) {
        const response = await this.client.get(`/images/${fileKey}`, {
            params: { ids: nodeId, format: 'png', scale: 2 },
        });
        return response.data;
    }

    /**
     * Helper to parse Figma URL and extract fileKey and nodeId
     */
    parseUrl(url) {
        try {
            const u = new URL(url);
            const pathParts = u.pathname.split('/');
            const fileKey = pathParts[2];
            const nodeId = u.searchParams.get('node-id')?.replace('-', ':');
            return { fileKey, nodeId };
        } catch (e) {
            return null;
        }
    }
}

export const figma = new FigmaClient();
