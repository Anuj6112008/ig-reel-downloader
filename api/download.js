import axios from 'axios';

export default async function handler(req, res) {
    // CORS Headers: Isse tumhari website ko data milega
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ status: false, message: "URL is required" });
    }

    try {
        // Instagram Scraping Logic
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            }
        });

        const html = response.data;
        const videoUrl = html.match(/"video_url":"([^"]+)"/)?.[1]?.replace(/\\u0026/g, '&');
        const thumbUrl = html.match(/"display_url":"([^"]+)"/)?.[1]?.replace(/\\u0026/g, '&');

        if (videoUrl) {
            return res.status(200).json({
                status: true,
                video_url: videoUrl,
                thumbnail_url: thumbUrl || "",
                joinUs: "Powered by MyAPI - Telegram @YourHandle"
            });
        } else {
            return res.status(404).json({ status: false, message: "Video not found. Private account?" });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server Error" });
    }
}
