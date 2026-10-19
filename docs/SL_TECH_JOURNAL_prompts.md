# SL Tech Journal — Talking-Video Portfolio Prompts

Source: Instagram reel by [@SL_TECH_JOURNAL](https://www.instagram.com/sl_tech_journal/)  
Captured from end-of-video guide screens (Build Your Own Talking-Video Portfolio).

---

## Guide overview

**BUILD YOUR OWN TALKING-VIDEO PORTFOLIO**  
A 3-step guide · Create your character, generate your intro video, then build your portfolio with an AI coding assistant.

1. Create your 3D character image  
2. Generate your intro talking video (Google Flow + prompts below)  
3. Build the interactive portfolio with an AI coding assistant  

---

## Step 2 — Upload & setup

Upload the image you generated in Step 1 to **Google Flow**, then paste the prompt below.  
**Replace the spoken name, role and introduction with your own details before generating.**

---

## Main generation prompt

```text
Use the uploaded reference image as the EXACT and ONLY visual reference for the character.

Create a premium, high-quality 3D animated video of this exact character.

CHARACTER CONSISTENCY:
- The character must look exactly like the uploaded reference character.
- Preserve her exact face, facial structure, eyes, eyebrows, nose, lips, hairstyle, hair color, skin tone, body proportions, clothing, accessories, and overall appearance.
- Do not redesign the character.
- Do not change her outfit.
- Do not change her hairstyle.
- Do not change her facial features.
- Do not make her look like a different person.
- Do not add or remove accessories.
- Do not change her age or body shape.
- Maintain the same premium 3D Bitmoji/cartoon style as the reference image.

POSE AND POSITION:
- Start with the character standing exactly in the same pose shown in the uploaded reference image.
- Keep her standing upright in the exact CENTER of the frame.
- Keep her entire body visible from head to feet.
- Do not crop any part of her body.
- Do not change the basic pose.
- Only allow natural small movements required for speaking.

PERFORMANCE:
- The character is introducing herself directly to the camera.

NATURAL ANIMATION:
- Natural blinking.
- Natural eye movement.
- Subtle facial expressions.
- Small natural head movements.
- Natural hand gestures while speaking.
- Gentle body movement.
- No exaggerated gestures.
- No robotic movement.
- No sudden movements.
- No unnatural stretching or deformation.
- The character must remain standing in the center while speaking.

CAMERA:
- Fixed camera.
```

---

## Spoken script (TEXT)

Replace with your own name, role, and intro, for example:

```text
Hi — I'm Abhishek Agrawal. I'm a Data Engineer based in San Jose.
I build cloud data platforms on AWS and GCP — lakehouses, orchestration, and cost-aware pipelines.
Welcome to my portfolio.
```

---

## Negative / clean-output constraints

```text
- NO background music.
- NO instrumental music.
- NO sound effects.
- NO ambient music.
- NO environmental sounds.
- NO footsteps.
- NO reverb.
- No additional voices.
- No background noise.

- NO subtitles
- NO captions
- NO titles
```

---

## Portfolio build checklist (from the reel UI)

Use these as product requirements when coding the site:

1. **Landing** — Clean hero; avatar introducing you; floating badges for proud moments; giant name watermark; Explore work / Let's talk / Resume.
2. **About** — Short bio + hanging Developer ID badge (lanyard) + quick facts column.
3. **Skills** — Filterable “periodic” tiles; click/hover lights a family; side panel shows a large block logo for the active skill.
4. **Header** — Split / floating transparent pill nav; active section stays in sync on scroll.
5. **Work** — Interactive project stack with side tabs; one open panel at a time; short copy + feature bullets + tech pills.
6. **Experience** — Clean journey / progress bar that reveals as you scroll.
7. **Proud moments** — Sparse achievement cards (not long paragraphs).
8. **Reach out** — Big closing line + Let's talk CTA + light contact path.
