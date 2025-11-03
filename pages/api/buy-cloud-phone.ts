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
  data?: any;
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

    // Make the request to meows.io.vn
    const response = await fetch('https://meows.io.vn/api/buy-cloud-phone', {
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
      return res.status(response.status).json({
        success: false,
        message: data.message || 'Failed to purchase cloud phone',
        data,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cloud phone purchased successfully!',
      data,
    });
  } catch (error) {
    console.error('Error purchasing cloud phone:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.',
    });
  }
}
