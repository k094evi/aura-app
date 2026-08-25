# ==============================================================================
# FILE: app/dependencies/__init__.py
# ==============================================================================
# PURPOSE OF THIS FILE:
#   This is the package initializer for the `app.dependencies` package (the
#   folder that also contains auth.py, and any other future dependency
#   modules like rate-limiting, DB-session, or role-checking dependencies).
#
#   Its presence is what tells Python "the `dependencies/` folder is an
#   importable package," which is what makes imports like this work
#   elsewhere in the codebase:
#
#       from app.dependencies.auth import get_current_user
#
#   Right now this file is intentionally empty — it doesn't need to contain
#   any code for the package to function. It's simply a marker file.
#
# WHEN YOU MIGHT ADD CODE HERE:
#   - To re-export commonly used dependencies for shorter imports, e.g.:
#         from app.dependencies.auth import get_current_user  # noqa: F401
#     which would then let other files do:
#         from app.dependencies import get_current_user
#   - To define package-wide constants or shared setup used by multiple
#     dependency modules in this folder.
#
#   Until one of those needs comes up, leaving this file empty (aside from
#   this explanatory comment) is the correct, standard practice.
# ==============================================================================