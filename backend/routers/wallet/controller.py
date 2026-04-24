import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
from utils.errors import AppError

load_dotenv()

router = APIRouter(prefix="/wallet", tags=["Wallet"])

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Upload to Cloudinary
        # resource_type="auto" allows for PDFs and other non-image files
        result = cloudinary.uploader.upload(
            file.file,
            resource_type="auto",
            folder="edu_wallet"
        )
        
        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "size": result.get("bytes")
        }
    except Exception as e:
        print(f"Cloudinary upload error: {str(e)}")
        raise AppError(
            code="UPLOAD_FAILED",
            message="Failed to upload document to Cloudinary",
            status_code=500,
            details={"error": str(e)}
        )
