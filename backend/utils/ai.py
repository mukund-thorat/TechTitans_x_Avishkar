import os
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
import httpx
from typing import Optional, Tuple

# Initialize Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

async def get_youtube_video_title(video_id: str) -> str:
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            return response.json().get("title", "YouTube Video")
    return "YouTube Video"

def get_transcript(video_id: str) -> Optional[str]:
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([t['text'] for t in transcript_list])
    except Exception as e:
        print(f"Error fetching transcript: {e}")
        return None

async def generate_summary(video_id: str) -> Tuple[str, str]:
    title = await get_youtube_video_title(video_id)
    transcript = get_transcript(video_id)
    
    if not transcript:
        return title, "Could not fetch transcript for this video. Please ensure the video has subtitles enabled."

    prompt = f"""
    Title: {title}
    Transcript: {transcript}
    
    Please provide a structured summary of this educational video. 
    Use clear headings, bullet points, and highlight key takeaways.
    Keep it concise but informative for study notes.
    """
    
    response = model.generate_content(prompt)
    return title, response.text
