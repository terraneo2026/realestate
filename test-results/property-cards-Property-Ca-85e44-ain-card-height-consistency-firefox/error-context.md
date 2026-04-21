# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: property-cards.spec.ts >> Property Cards & Images >> should maintain card height consistency
- Location: tests\e2e\property-cards.spec.ts:62:7

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe -no-remote -headless -profile C:\Users\user\AppData\Local\Temp\playwright_firefoxdev_profile-JsNTSl -juggler-pipe -silent
<launched> pid=7296
[pid=7296] <process did exit: exitCode=2147483760, signal=null>
[pid=7296] starting temporary directories cleanup
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe -no-remote -headless -profile C:\Users\user\AppData\Local\Temp\playwright_firefoxdev_profile-JsNTSl -juggler-pipe -silent
  - <launched> pid=7296
  - [pid=7296] <process did exit: exitCode=2147483760, signal=null>
  - [pid=7296] starting temporary directories cleanup
  - [pid=7296] <gracefully close start>
  - [pid=7296] <kill>
  - [pid=7296] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=7296] finished temporary directories cleanup
  - [pid=7296] <gracefully close end>

```