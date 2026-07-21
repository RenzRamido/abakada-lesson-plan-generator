# SETUP NOTES

ABAKADA is a Google Apps Script + Google Workspace + OpenAI prototype.

This repository contains sanitized Apps Script source files for review. The live system shown in the demo video uses a private Google Workspace deployment.

## Private configuration excluded

The working deployment depends on private configuration values that are intentionally excluded from this public repository, including:

- OpenAI API key
- Google Apps Script project ID
- Google Sheet ID
- Google Drive output folder ID
- Google Doc template ID
- authorized teacher emails
- private generated lesson plan links
- private school or teacher data
- `.clasp.json`
- Apps Script PropertiesService values

## How the system is deployed

To reproduce ABAKADA, a reviewer would need to:

1. Create a Google Form for teacher lesson plan requests.
2. Link the form responses to a Google Sheet.
3. Create required control sheets such as:
   - FORM_RESPONSES
   - GENERATION_QUEUE
   - PROCESSING_LOG
   - SUPPORT_MATRIX
   - SUBJECT_PROFILES
   - BOW_DATABASE
   - CONFIG
   - GENERATED_HISTORY
   - TERM_DAY_PLAN
   - AUTHORIZED_EMAILS
4. Create a Google Docs template for lesson plan output.
5. Create a Google Drive folder for generated lesson plans.
6. Add the Apps Script source files to a Google Apps Script project.
7. Store private IDs and the OpenAI API key in private Apps Script configuration.
8. Install the form submit trigger and queue worker trigger.
9. Run Preflight validation before controlled testing.

## Public demo

The Devpost submission includes:

- YouTube demo video
- Google Drive demo folder
- sanitized screenshots
- sample generated lesson plan
- README explanation

The demo shows the working flow:

Google Form request → validation → queue → processing logs → generated Google Doc → email delivery.
