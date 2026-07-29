# Kewal Jewellers — Review Assistant

A mobile-first "Review Assistant" web app. A customer scans a QR code in
the shop, answers two quick questions about their visit, and in one tap
the app writes a natural, grammatically correct Google review based
only on what they selected, copies it, and opens Google Reviews so they
can paste it in.

No backend, no build tools, no npm, no frameworks — just three files:

```
index.html
style.css
script.js
```

## The flow

1. **Quick sentiment check** — a single tap on "😊 Yes, loved it" or
   "😕 Not quite" (not a 5-star picker). Google's own star rating is the
   only one that counts publicly, so asking for stars here too would
   just be rating twice for no reason — this is only a fast way to keep
   an unhappy visit out of the public review flow.
   - "Not quite" → a private feedback box only. Nothing is ever pushed
     toward a public review for an unhappy visit.
   - "Yes, loved it" → continues to the review builder.
2. **What did you purchase?** — tap a category (Gold / Silver / Diamond /
   Services); tapping it opens quick sub-options (Ring, Chain, etc.) if
   the customer wants to be specific. Multiple categories can be picked.
   One "Continue" tap.
3. **What impressed you?** — tap any number of chips. Right above the
   "✦ Generate & Copy Review" button is a short line explaining exactly
   what that tap will do (copy the review and open Google Reviews) —
   read *before* tapping, since the tab switch that follows is instant
   and there's no reliable moment to explain it afterwards.
4. Tapping generate copies the review and opens Google Reviews in a new
   tab, both at once. A brief loading beat, then this tab shows a
   reference screen — what was copied, plus numbered steps for pasting
   it in. This screen is deliberately *not* styled as "you're done": no
   checkmark, no confetti — the review still needs to be pasted and
   posted on Google, so nothing here should feel like a finish line.
   From here they can copy again, try another wording, reopen the
   Google tab, or start a fresh review for the next customer.

## Two design decisions worth knowing about

**Why there's no "Review copied! 🎉" celebration screen.** Early
versions had a checkmark, confetti, and "Review copied!" right after
generating. That combination reads as "task complete" — and the actual
task (posting to Google) isn't done yet. A screen that *feels* finished
gives people a natural point to stop and put their phone away before
they've actually pasted anything. So the review-copied screen intentionally
looks like a mid-step reference (an arrow icon, "paste it into Google
Reviews" as the heading), not a reward.

**Why the review never says "my wife", "my husband", "my daughter",
etc.** Earlier sentence variety included lines like "my mother
suggested…" or "my husband and I chose…" for more natural-sounding
variety. The problem: the app has no idea whether the customer is male,
female, married, has children, or has living parents — so any of those
assume something we have no basis for. If a detail like that is wrong,
it's the one thing in the review the customer notices immediately (since
they're reading it as if it were their own words), and it undermines
trust in the rest of the text too. Every sentence pool now sticks to
"I", "We", "My family", or "Recently" as the subject — natural, varied,
and true for literally any customer.

There's also no "personal note" field anymore. Since this app is a
combination of pre-written sentence arrays rather than an AI model, it
can't intelligently weave in freeform text the way a generative model
could — it could only awkwardly append whatever was typed. Removing it
keeps every part of the output equally reliable.

---

## 1. How to put this online with GitHub Pages (step by step)

You don't need to know how to code for this part.

1. Go to [github.com](https://github.com) and log in (or create a free account).
2. Click the **+** icon top-right → **New repository**.
3. Name it something like `kewal-review-assistant` → click **Create repository**.
4. On the new repo page, click **Add file → Upload files**.
5. Drag in all four files: `index.html`, `style.css`, `script.js`, `README.md`.
6. Scroll down and click **Commit changes**.
7. Go to the repo's **Settings** tab → **Pages** (left sidebar).
8. Under "Build and deployment" → **Source**, choose **Deploy from a branch**.
9. Under **Branch**, choose `main` and folder `/ (root)` → **Save**.
10. Wait 1–2 minutes, then refresh the page — you'll see a link like:
    `https://yourusername.github.io/kewal-review-assistant/`
11. Open that link on your phone to test it, then generate a QR code
    for it (see step below). You don't need to fill in the "Custom
    domain" field — it's optional and unnecessary for a QR-scan flow
    like this one, since nobody types the URL by hand.

That's it — the site is now live and free forever on GitHub.

If you update any file later, upload the changed file again the same
way (Add file → Upload files → Commit changes) and GitHub Pages will
redeploy automatically within a minute or two. If the live page still
shows old text after that, it's almost always just your phone/browser
caching the old version — a hard refresh (or closing and reopening the
tab) clears it.

## 2. How to test it right now, without uploading anywhere

Just double-click `index.html` on your computer. It opens directly in
your browser and works fully offline (the only thing that needs
internet is opening the Google review page at the end).

## 3. How to generate a QR code for your shop counter

1. Once your GitHub Pages link is live (step 1), copy it.
2. Go to a free QR generator such as `https://www.qr-code-generator.com`
   or search "free QR code generator" — paste your link in and download
   the QR image.
3. Print it and place it at your billing counter with a small sign like
   "Loved your visit? Scan to share a quick review!"

## 4. How to change the Google Review link

Open `script.js`, near the top you'll see:

```js
const CONFIG = {
  businessName: "Kewal Jewellers",
  googleReviewUrl: "https://g.page/r/CWSPqeqCFgtDEBE/review",
  ...
};
```

Replace the `googleReviewUrl` value with your own shop's Google review
link, keeping the quotes. You can also change `businessName` here — it's
used inside the generated review sentences.

## 5. How to replace the logo / seal

The welcome screen shows a gold "hallmark seal" drawn directly in code
(an SVG circle with a "K" in it), so it always looks crisp with no image
file needed. To use your own logo image instead:

1. Add your logo file (e.g. `logo.png`) into the same folder as
   `index.html`.
2. In `index.html`, find this block near the top of the `<body>`:
   ```html
   <div class="hallmark-seal">
     <svg viewBox="0 0 120 120" ...> ... </svg>
   </div>
   ```
3. Replace the `<svg>...</svg>` part with:
   ```html
   <img src="logo.png" alt="Kewal Jewellers logo" style="width:72px;height:72px;border-radius:50%;object-fit:cover;" />
   ```

## 6. How to add or rename products / categories

Open `script.js` and find the `CATEGORIES` array near the top. Each
category looks like this:

```js
{
  key: "gold",
  label: "Gold Jewellery",
  genericPhrase: "gold jewellery",
  subs: [
    { key: "Ring", phrase: "a gold ring" },
    { key: "Chain", phrase: "a gold chain" },
    ...
  ]
}
```

- `label` is what the customer sees as the category name.
- Each item in `subs` is a sub-category chip. `key` is the button label,
  and `phrase` is exactly how it should read naturally inside a sentence
  (e.g. `"a gold ring"`, not just `"ring"`).
- To add a new sub-category, copy a line and edit both `key` and
  `phrase`.
- `genericPhrase` is used only if the customer selects the category but
  skips choosing a specific item (e.g. just "gold jewellery" instead of
  "a gold ring").

The same pattern applies to `IMPRESSED_OPTIONS` for the "what impressed
you" chips.

## 7. How the review generation works

This is a **grammar assistant, not an AI review generator**. It never
invents anything the customer didn't select, and it never assumes
anything about who the customer is.

1. There are four pools of pre-written sentence fragments: ~40
   **introductions**, ~40 **purchase sentences**, ~40 **appreciation
   sentences**, and ~30 **endings** (a small share of which naturally
   mention "Vishnu Garden" or "West Delhi" — about 1 in 8 reviews).
   Every line uses only "I", "We", "My family", or "Recently" as its
   subject — nothing gendered or relationship-specific.
2. When the customer taps "Generate & Copy Review," the app randomly
   picks one sentence from each pool, fills in the customer's actual
   selections, and joins them into one paragraph.
3. The app checks the result is roughly 40–80 words; if a random
   combination comes out too short or too long, it tries a few more
   combinations and keeps the best-fitting one.
4. Because sentences are mixed and matched from four independent pools,
   there are thousands of possible combinations — no two customers are
   likely to get the same wording, even with the same purchase.

## 8. Editing colours / design

All colours and spacing live at the top of `style.css` inside `:root`:

```css
:root{
  --ink: #0b0b0c;      /* background black */
  --gold: #cda44e;     /* accent gold */
  --gold-bright: #e8c877;
  ...
}
```

Change any hex value there and it updates everywhere in the app
automatically.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and all screens |
| `style.css` | Black / white / gold visual design, animations |
| `script.js` | App logic, category data, and the review grammar engine |
| `README.md` | This guide |
