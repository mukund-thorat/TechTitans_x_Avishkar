import base64
import hashlib
import os
import hmac

import bcrypt

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_byte_enc = plain_password.encode('utf-8')
    hashed_password_byte_enc = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_byte_enc, hashed_password_byte_enc)

def generate_hash(data: str) -> tuple[str, str]:
    salt = os.urandom(12)
    salted = salt + data.encode()
    hashed = hashlib.sha256(salted).hexdigest()
    return base64.b64encode(salt).decode(), hashed

def verify_hash(data: str, hash_value: str, salt: str) -> bool:
    salt_bytes = base64.b64decode(salt)
    gen_hash = hashlib.sha256(salt_bytes + data.encode()).hexdigest()
    return hmac.compare_digest(gen_hash, hash_value)

