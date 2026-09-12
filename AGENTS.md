# Antigravity Agent Guidelines

## Automatic Git Commit & Push Workflow
After making code modifications, fixes, or additions in this repository:
1. Ensure `.env` and sensitive files are NOT tracked in git (check `.gitignore`).
2. Always stage modified project files: `git add .`
3. Commit the changes with a clear, concise, descriptive message: `git commit -m "..."`
4. Automatically push the commit to the active remote repository and branch (`git push origin <current-branch>`).
5. Confirm the push status in the final response.
