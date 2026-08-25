"""
FILE LOCATION: app/utils/logger.py
────────────────────────────────────

PURPOSE
-------
This module defines ONE shared logger object, named "aura", that every
other module in the backend should import and use instead of calling
`logging.getLogger(__name__)` on their own.

WHY A SHARED LOGGER?
---------------------
If every file created its own logger independently, each one could end
up with a different message format, a different log level, or (worse)
duplicate handlers printing the same line multiple times. Centralizing
the setup here means:
  - Every log line across the whole app looks the same:
    "<timestamp> | <LEVEL> | aura | <message>"
  - The log level (currently INFO) is controlled from one place. Modules
    like file_handler.py that call `logger.debug(...)` will only have
    those lines shown if this level is lowered to DEBUG.
  - Output always goes to stdout, which is friendly for both local
    development and containerized/cloud deployments that capture
    stdout as their log stream.

HOW OTHER FILES USE THIS
--------------------------
Example (as seen in file_handler.py):
    from app.utils.logger import logger
    logger.debug("some message")

HOW IT WORKS
------------
- `logging.getLogger("aura")` returns the same logger instance every
  time it's called with that name anywhere in the app (Python's
  logging module caches loggers by name), so this setup effectively
  runs once.
- The `if not logger.handlers:` guard prevents adding duplicate
  StreamHandlers if this module happens to be imported more than once
  (e.g. via different import paths) or reloaded.
- `logger.propagate = False` stops log records from also being passed
  up to the root logger, which would otherwise risk printing each line
  twice if the root logger has its own handler configured elsewhere.
"""

import logging
import sys

# The single shared logger instance used throughout the backend.
logger = logging.getLogger("aura")
logger.setLevel(logging.INFO)  # Change to logging.DEBUG to see debug-level logs (e.g. from file_handler.py)

# Only configure handlers once, even if this module gets imported
# multiple times, to avoid duplicate log lines.
if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
        )
    )
    logger.addHandler(handler)
    logger.propagate = False