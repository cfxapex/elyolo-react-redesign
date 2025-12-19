#!/bin/bash

# This script automates sending your code to GitHub.
# It uses the GitHub CLI (gh) installed on your machine.

echo "🚀 Starting GitHub Push Process..."

# 1. Check if 'gh' is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI ('gh') is not installed or not found in PATH."
    echo "   Please install it: brew install gh"
    exit 1
fi

# 2. Check authentication
echo "🔍 Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    echo "⚠️  You are not logged in. Please log in now:"
    gh auth login
fi

# 3. Create Repository
REPO_NAME="elyolo-react-redesign"
echo "📦 Ensuring repository '$REPO_NAME' exists..."

# Attempt to create. If it fails, we assume it might match an existing repo or user can handle the error.
# We do not use --push here yet to ensure we set remote correctly first.
gh repo create "$REPO_NAME" --public --source=. --remote=origin || echo "   (Repository might already exist or remote is set, continuing...)"

# 4. Push Code
echo "⬆️  Pushing main branch to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ SUCCESS! Your code is live on GitHub."
echo "   Now you can go to Railway -> New Project -> Deploy from GitHub repo."
