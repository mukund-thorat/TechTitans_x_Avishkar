from youtube_transcript_api import YouTubeTranscriptApi
import youtube_transcript_api
print(f"Module file: {youtube_transcript_api.__file__}")
print(f"YouTubeTranscriptApi: {YouTubeTranscriptApi}")
print(f"Has get_transcript: {hasattr(YouTubeTranscriptApi, 'get_transcript')}")
try:
    print(f"Dir: {dir(YouTubeTranscriptApi)}")
except Exception as e:
    print(f"Error: {e}")
