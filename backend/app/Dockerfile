# FILE LOCATION: Dockerfile (project root)
#
# PURPOSE
# -------
# Builds the container image that runs the Aura resume analyzer's
# FastAPI backend (app/main.py). This is what turns the Python project
# into a self-contained, deployable image — used both for local
# containerized dev and for actual deployment.
#
# HOW IT FITS INTO THE PROGRAM
# -----------------------------
# - Installs two system-level (non-pip) dependencies that specific
#   Python packages need under the hood:
#     - poppler-utils → required by `pdfplumber` (or similar PDF
#       libraries) to read PDF metadata/fonts when extracting resume
#       text from uploaded PDFs.
#     - libmagic1      → required by `python-magic`, which is the
#       stronger file-type detection method used in
#       app/utils/file_handler.py's validate_file(). This is exactly
#       the system dependency that file_handler.py's fallback logic
#       is designed to handle the *absence* of — but in this
#       Dockerfile it IS installed, so the container gets the more
#       accurate MIME-based detection rather than falling back to
#       extension-based checking.
# - Installs Python dependencies from requirements.txt.
# - Copies the rest of the app code in.
# - Starts the server with uvicorn, matching the same
#   "app.main:app" target referenced in main.py's own docstring.
#
# NOTES / THINGS WORTH DOUBLE-CHECKING
# --------------------------------------
# - `--reload` is normally a development convenience (auto-restarts
#   the server on code changes) and isn't usually recommended for a
#   production image, since it adds overhead and expects a live
#   filesystem watch — worth confirming this Dockerfile is meant for
#   dev/staging use, or removing --reload for a production build.
# - Order of COPY commands (requirements.txt first, then `pip install`,
#   then the rest of the code) is intentional: it lets Docker's layer
#   caching skip re-running `pip install` on every build unless
#   requirements.txt itself changes.

# Base image: slim Python 3.11 — smaller footprint than the full
# python:3.11 image, at the cost of needing to manually apt-get
# install any system libraries (like poppler/libmagic below) that
# aren't included in the slim variant.
FROM python:3.11-slim

# poppler-utils  → lets pdfplumber read PDF metadata/fonts
# libmagic1      → required by python-magic for MIME sniffing
RUN apt-get update && apt-get install -y \
    poppler-utils \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*
    # ^ Cleans up the apt package list cache after install to keep the
    #   resulting image layer smaller.

# All subsequent COPY/RUN/CMD instructions run relative to /app inside
# the container.
WORKDIR /app

# Copy only requirements.txt first (not the whole app) so this layer
# is cached and only re-runs pip install when dependencies actually change.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the application source code in.
COPY . .

# Documents that the container listens on port 8000 (matches the
# --port 8000 used in main.py's own local run instructions).
EXPOSE 8000

# Starts the FastAPI app via uvicorn, binding to all interfaces
# (0.0.0.0) so it's reachable from outside the container, on port 8000.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]