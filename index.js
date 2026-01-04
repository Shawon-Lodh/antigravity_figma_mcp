import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { figma } from './figma.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = new Server(
    {
        name: 'antigravity-figma-mcp',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'get_figma_design',
            description: 'Get Figma design data (JSON) for a specific URL or file/node. This data can be used to generate Flutter UI code.',
            inputSchema: {
                type: 'object',
                properties: {
                    url: { type: 'string', description: 'The full Figma URL' },
                    fileKey: { type: 'string', description: 'The Figma File Key (optional if URL provided)' },
                    nodeId: { type: 'string', description: 'The Figma Node ID (optional if URL provided)' },
                },
            },
        },
        {
            name: 'get_figma_image_url',
            description: 'Get the rendered image URL for a Figma node.',
            inputSchema: {
                type: 'object',
                properties: {
                    url: { type: 'string', description: 'The full Figma URL' },
                    fileKey: { type: 'string', description: 'The Figma File Key' },
                    nodeId: { type: 'string', description: 'The Figma Node ID' },
                },
                required: ['fileKey', 'nodeId'],
            },
        },
        {
            name: 'ping',
            description: 'Test the connection to the MCP server.',
            inputSchema: {
                type: 'object',
                properties: {},
            },
        }
    ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    console.log(`Tool call received: ${name}`, args);

    try {
        if (name === 'ping') {
            return {
                content: [{ type: 'text', text: 'pong' }],
            };
        }

        if (name === 'get_figma_design') {
            let { fileKey, nodeId, url } = args;

            if (url) {
                const parsed = figma.parseUrl(url);
                if (parsed) {
                    fileKey = parsed.fileKey;
                    nodeId = parsed.nodeId;
                }
            }

            if (!fileKey) {
                throw new Error('File Key is required');
            }

            if (nodeId) {
                const data = await figma.getNode(fileKey, nodeId);
                return {
                    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
                };
            } else {
                const data = await figma.getFile(fileKey);
                return {
                    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
                };
            }
        }

        if (name === 'get_figma_image_url') {
            const { fileKey, nodeId } = args;
            const data = await figma.getImage(fileKey, nodeId);
            return {
                content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
        }

        throw new Error(`Tool not found: ${name}`);
    } catch (error) {
        return {
            content: [{ type: 'text', text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});

let transport;

app.get('/sse', async (req, res) => {
    console.log('New SSE connection');
    transport = new SSEServerTransport('/messages', res);
    await server.connect(transport);
});

app.post('/messages', async (req, res) => {
    console.log('New message received');
    if (transport) {
        await transport.handlePostMessage(req, res);
    }
});

const PORT = process.env.PORT || 3845;
app.listen(PORT, () => {
    console.log(`Figma MCP Server running on http://localhost:${PORT}/sse`);
});
