import type { NextApiRequest, NextApiResponse } from 'next';

interface Account {
  account: string;
  password: string;
}

interface RequestBody {
  service: 'Vsphone' | 'Vmos';
  accounts: Account[];
}

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { service, accounts }: RequestBody = req.body;

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
      // Generic error - don't expose any backend details
      return res.status(400).json({
        success: false,
        message: 'Unable to process your request. Please check your credentials and try again.',
      });
    }

    // Success - don't expose any backend details
    return res.status(200).json({
      success: true,
      message: 'Trial purchase completed successfully! Check your account.',
    });
  } catch (error) {
    // Log server-side only, never expose to client
    console.error('[SYSTEM]', error);
    return res.status(500).json({
      success: false,
      message: 'System temporarily unavailable. Please try again in a moment.',
    });
  }
}
