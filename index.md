---
layout: blog_index
title: Deep Learning & AI Research
permalink: /deep_learning/
---

<div class="blog-content" markdown="1">

Welcome to my deep learning research page. Here I document my progress through the [FastAI course](https://course.fast.ai/) and various AI-driven experiments.

## Sci-Fi vs. Fantasy Classifier

This is a binary classifier trained on a dataset of concept art images to distinguish between science fiction and fantasy aesthetics. It uses a ResNet-18 architecture fine-tuned on custom scraped data.

<div class="media-item">
  <iframe
    src="https://michael-kato-scifi-vs-fantasy.hf.space"
    frameborder="0"
    width="100%"
    height="600"
    style="border-radius: 4px; background: white;"
  ></iframe>
  <p class="media-caption">Live inference via Hugging Face Spaces.</p>
</div>

### Project Notes
- **Framework:** FastAI / PyTorch
- **Deployment:** Hugging Face Spaces + Gradio
- **Dataset:** Scraped concept art via DuckDuckGo API
- **Goal:** Automate genre classification for large asset libraries.

</div>