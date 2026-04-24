from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.auth.controller import router as auth_router
from routers.notes.controller import router as notes_router
from routers.stats.controller import router as stats_router
from routers.wallet.controller import router as wallet_router

from utils.errors import AppError
from fastapi import Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.code,
            "message": exc.message,
            "details": exc.details,
        },
    )

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"], # Support both ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(notes_router)
app.include_router(stats_router)
app.include_router(wallet_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
