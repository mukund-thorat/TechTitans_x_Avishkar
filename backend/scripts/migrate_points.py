import asyncio
import os
from sqlalchemy import text
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine

load_dotenv()

async def migrate():
    pg_uri = os.getenv("PG_URI")
    if not pg_uri:
        print("PG_URI not found")
        return

    engine = create_async_engine(pg_uri)
    
    async with engine.begin() as conn:
        try:
            print("Checking current table structure for 'users'...")
            # More robust check using SQLAlchemy's inspector or raw query
            result = await conn.execute(text("""
                SELECT EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'users' AND column_name = 'points'
                );
            """))
            exists = result.scalar()
            
            if not exists:
                print("Column 'points' NOT found. Attempting to add it...")
                await conn.execute(text('ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0 NOT NULL;'))
                print("Column 'points' added successfully.")
            else:
                print("Column 'points' already exists according to information_schema.")
                
            # Let's also try a direct select to be sure
            try:
                await conn.execute(text("SELECT points FROM users LIMIT 1;"))
                print("Verification: 'points' column is accessible via SELECT.")
            except Exception as e:
                print(f"Verification FAILED: 'points' column is NOT accessible despite information_schema. Error: {e}")
                print("Attempting forced ADD COLUMN...")
                await conn.execute(text('ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0 NOT NULL;'))
                print("Forced ADD COLUMN successful.")

        except Exception as e:
            print(f"Error during migration: {e}")

    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(migrate())
