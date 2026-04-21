# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-visual-consistency.spec.ts >> UI Visual Consistency >> should display section headings consistently
- Location: tests\e2e\ui-visual-consistency.spec.ts:153:7

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe -no-remote -headless -profile C:\Users\user\AppData\Local\Temp\playwright_firefoxdev_profile-hp7NWH -juggler-pipe -silent
<launched> pid=24116
[pid=24116] <process did exit: exitCode=2147483760, signal=null>
[pid=24116] starting temporary directories cleanup
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe -no-remote -headless -profile C:\Users\user\AppData\Local\Temp\playwright_firefoxdev_profile-hp7NWH -juggler-pipe -silent
  - <launched> pid=24116
  - [pid=24116] <process did exit: exitCode=2147483760, signal=null>
  - [pid=24116] starting temporary directories cleanup
  - [pid=24116] <gracefully close start>
  - [pid=24116] <kill>
  - [pid=24116] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=24116] finished temporary directories cleanup
  - [pid=24116] <gracefully close end>

```