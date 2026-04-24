import asyncio
from sqlalchemy import text
from data.core import engine

async def add_col():
    try:
        async with engine.begin() as conn:
            await conn.execute(text('ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER NOT NULL DEFAULT 0'))
            print('Column points added successfully')
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(add_col())
