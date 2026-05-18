---
title: FastAI Course - My First Image Classifier Model
post_id: fastai-scifi-fantasy
date: 2026-05-15
---

As part of my deep learning journey through the [fastai course](https://course.fast.ai/), I built a binary classifier to solve a classic Technical Artist dilemma: Is this concept art piece **Sci-Fi** or **Fantasy**? 

This project was a great exercise in data curation, model fine-tuning, and production deployment.

## The Pipeline

1.  **Data Acquisition**: Using the `fastbook` search tools to scrape images from DuckDuckGo.
2.  **Model Training**: Leveraging a **ResNet-18** architecture. I used transfer learning to fine-tune the model, achieving a surprisingly low error rate.
3.  **Data Cleaning**: Using fastai's `ImageClassifierCleaner` to prune mislabeled images.
4.  **Deployment**: Exporting the model as a `.pkl` file and hosting it on **Hugging Face Spaces**.

## Hugging Face & Site Integration

One of the highlights of this project was the integration. I deployed it to Hugging Face Spaces, allowing for live inference. You can view the detailed notebook and implementation notes on my dedicated deep learning page:
michaelkato.work/deep_learning/

## Technical Highlights

- **Architecture**: ResNet-18 (Pre-trained on ImageNet)
- **Library**: fastai / PyTorch
- **Deployment**: Hugging Face Spaces + Gradio
- **Optimization**: Random Resizing, Cropping, and Data Augmentation.

## What's Next?

The model occasionally struggles with "Science Fantasy" (like Star Wars). A future iteration might involve multi-label classification to account for these overlapping genres.

## Tools

Python, fastai, PyTorch, Gradio, Hugging Face Spaces