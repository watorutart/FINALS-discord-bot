# Discord Bot - Serverless Migration Guide

This document explains the serverless architecture migration for the FINALS Discord Bot.

## Overview

The bot has been migrated from a constantly running server to a serverless architecture using GitHub Actions. This eliminates the need for 24/7 server hosting while maintaining the same functionality.

## Architecture Changes

### Before (Server-based)
- Bot runs continuously on Railway/server
- Uses node-cron for scheduling
- Express server for health checks
- Persistent connection to Discord Gateway

### After (Serverless)
- GitHub Actions handles scheduling
- No persistent server required
- One-time execution per scheduled run
- Uses Discord REST API only

## Files Created/Modified

### GitHub Actions Workflow
- `.github/workflows/discord-cron.yml` - Scheduled execution every Friday at 18:30 JST

### Serverless Script
- `src/cron/post.ts` - Standalone script for posting clips
- `package.json` - Added npm scripts for serverless execution

## Configuration

### GitHub Secrets Required
Set these in your repository's GitHub Secrets:

```
DISCORD_TOKEN=your_discord_bot_token
CHANNEL_ID=your_discord_channel_id
```

### Environment Variables
The following environment variables are used:
- `DISCORD_TOKEN` - Discord bot token
- `CHANNEL_ID` - Target Discord channel ID
- `DATA_FILE_PATH` - Path to markdown data file (defaults to './data/posts.md')

## Usage

### Automatic Execution
The bot will automatically run every Friday at 18:30 JST via GitHub Actions.

### Manual Execution
You can manually trigger the workflow:
1. Go to the Actions tab in your GitHub repository
2. Select "Discord Clip Bot - Weekly Post"
3. Click "Run workflow"

### Local Testing
```bash
# Development mode
npm run cron:post:dev

# Production mode (requires build)
npm run build
npm run cron:post
```

## Benefits

1. **Cost Reduction**: No server hosting costs
2. **Zero Maintenance**: No server management required
3. **Reliability**: GitHub's infrastructure handles scheduling
4. **Scalability**: Runs only when needed
5. **Easy Monitoring**: GitHub Actions provides execution logs

## Migration Steps

1. Set up GitHub Secrets (DISCORD_TOKEN, CHANNEL_ID)
2. Commit the new files to your repository
3. Disable the old server-based deployment
4. Monitor the first few scheduled executions

## Rollback Plan

If you need to revert to the server-based approach:
1. Re-enable Railway deployment
2. Remove or disable the GitHub Actions workflow
3. The original `src/index.ts` file remains unchanged and functional

## Monitoring

Check execution status:
- GitHub Actions tab shows workflow runs
- Each run provides detailed logs
- Failed runs will send email notifications (if configured)