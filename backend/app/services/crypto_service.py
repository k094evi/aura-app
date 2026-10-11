"""
crypto_service.py
Field-level encryption for resume data at rest.

- Fernet (AES-128-CBC + HMAC-SHA256, authenticated) via `cryptography`
- Supports key rotation: RESUME_ENCRYPTION_KEYS="newest,older,oldest"
  (first key encrypts, all keys can decrypt)
- Never log plaintext resume content.
"""

import json
import logging
import os
from functools import lru_cache
from typing import Any, Optional

from cryptography.fernet import Fernet, InvalidToken, MultiFernet
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

_PREFIX = "enc:v1:"


class EncryptionError(Exception):
    pass


@lru_cache(maxsize=1)
def _get_fernet() -> MultiFernet:
    raw = os.getenv("RESUME_ENCRYPTION_KEYS", "").strip()
    if not raw:
        raise EncryptionError(
            "RESUME_ENCRYPTION_KEYS is not set. Generate a key with "
            "Fernet.generate_key() and add it to .env, then restart the server."
        )
    keys = [k.strip() for k in raw.split(",") if k.strip()]
    try:
        return MultiFernet([Fernet(k.encode()) for k in keys])
    except Exception as exc:
        raise EncryptionError("Invalid RESUME_ENCRYPTION_KEYS format.") from exc


def is_encrypted(value: Any) -> bool:
    return isinstance(value, str) and value.startswith(_PREFIX)


# ---------- text ----------

def encrypt_text(plaintext: Optional[str]) -> Optional[str]:
    if plaintext is None:
        return None
    if is_encrypted(plaintext):
        return plaintext  # already encrypted, avoid double-encrypting
    token = _get_fernet().encrypt(plaintext.encode("utf-8")).decode("ascii")
    return _PREFIX + token


def decrypt_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    if not is_encrypted(value):
        return value  # legacy plaintext rows still readable during migration
    try:
        return _get_fernet().decrypt(value[len(_PREFIX):].encode("ascii")).decode("utf-8")
    except InvalidToken as exc:
        logger.error("Decryption failed: wrong key or corrupted data.")
        raise EncryptionError("Unable to decrypt resume data.") from exc


# ---------- JSON (parsed resume, analysis results) ----------

def encrypt_json(data: Any) -> Optional[str]:
    if data is None:
        return None
    return encrypt_text(json.dumps(data, ensure_ascii=False))


def decrypt_json(value: Optional[str]) -> Any:
    text = decrypt_text(value)
    if text is None:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return text


# ---------- bytes (uploaded PDF/DOCX before storing) ----------

def encrypt_bytes(data: bytes) -> bytes:
    return _get_fernet().encrypt(data)


def decrypt_bytes(token: bytes) -> bytes:
    try:
        return _get_fernet().decrypt(token)
    except InvalidToken as exc:
        logger.error("Decryption failed: wrong key or corrupted data.")
        raise EncryptionError("Unable to decrypt file.") from exc


# ---------- rotation ----------

def rotate_text(value: str) -> str:
    """Re-encrypt with the newest key. Run over existing rows after adding a new key."""
    if not is_encrypted(value):
        return encrypt_text(value)
    token = _get_fernet().rotate(value[len(_PREFIX):].encode("ascii")).decode("ascii")
    return _PREFIX + token