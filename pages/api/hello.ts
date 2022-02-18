import { NextApiRequest, NextApiResponse } from 'next'

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ text: 'Hello, API' })
}

export default handler
