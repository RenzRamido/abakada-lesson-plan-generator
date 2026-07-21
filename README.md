# ABAKADA Lesson Plan Generator

ABAKADA is a low-cost AI-assisted lesson plan generation system for Philippine K–12 teachers.

It uses Google Forms, Google Sheets, Google Apps Script, Google Docs, Gmail, Google Drive, and OpenAI to turn structured curriculum data and teacher requests into editable lesson plan documents.

## What it does

A teacher submits a request through Google Forms.

The system then:

1. validates the request
2. checks grade, subject, and term support
3. creates a queue job
4. generates lesson plan content using OpenAI
5. creates an editable Google Doc
6. emails the completed lesson plan to the teacher
7. records logs for review and audit

## Current status

ABAKADA is a working prototype prepared for controlled teacher field testing.

The public demo includes sanitized screenshots, a sample generated lesson plan, a README, and a video demonstration.

## Built with

- OpenAI
- Codex
- Google Apps Script
- Google Forms
- Google Sheets
- Google Docs
- Gmail
- Google Drive
- JavaScript

## How Codex and GPT-5.6 were used

Codex and GPT-5.6 were used during OpenAI Build Week to help design, audit, validate, and harden the system.

They assisted with:

- Apps Script architecture review
- curriculum import validation
- support matrix checks
- subject profile checks
- queue worker hardening
- preflight validation logic
- constructed-curriculum disclosure checks
- debugging and audit review
- Devpost demo preparation

## Privacy and security note

Sensitive project files are intentionally excluded from this public repository.

The following are not included:

- OpenAI API keys
- `.clasp.json`
- private Google Sheet IDs
- private Google Doc links
- teacher emails
- real teacher personal information
- private generated documents
- Apps Script project secrets

The public demo uses sanitized screenshots and sample outputs only.

## Demo

The Devpost submission includes:

- Google Drive demo folder
- YouTube demo video
- sample generated lesson plan
- sanitized screenshots
