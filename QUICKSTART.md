# 🚀 QUICK START GUIDE

## The npm Problem

You mentioned npm doesn't work on your Mac. Here's how to fix it:

### Install Node.js (includes npm)

```bash
# 1. Install Homebrew (if you don't have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Node.js (this includes npm)
brew install node

# 3. Verify it worked
node --version
npm --version
```

## Running the Site

```bash
# 1. Navigate to the project
cd /Users/chrisbreault/elyolo-react

# 2. Install dependencies (first time only)
npm install

# 3. Start the development server
npm run dev
```

The site will open automatically at `http://localhost:3000`

## Making Changes

### Add a Product
1. Open `src/data/products.js`
2. Copy one of the existing product objects
3. Paste it in the array and change the values
4. Save - changes appear instantly!

### Add a Blog Post
1. Open `src/data/blogPosts.js`
2. Copy one of the existing post objects
3. Paste it at the top of the array
4. Update title, content, date, etc.
5. Save!

### Change Colors
1. Open `src/styles/global.css`
2. Change `--primary-color` (around line 11)
3. Save!

## What You Have

✅ **Home page** with hero and CTAs
✅ **Shop** with 6 products + shopping cart
✅ **Custom Shirts** request form
✅ **Blog** with 4 posts + individual post pages
✅ **About** page
✅ **Contact** form
✅ **Fully responsive** design
✅ **ELYOLO dark theme**

## Deploy When Ready

### Vercel (Easiest)
1. Push code to GitHub
2. Go to vercel.com
3. Import your repository
4. Done! Auto-deploys on every update

### Netlify
1. Run `npm run build`
2. Drag the `dist` folder to netlify.com/drop
3. Done!

## Need Help?

All code is commented and organized.
Each file does one thing and does it well.

---

**You have a COMPLETE e-commerce site ready to customize and deploy!**
