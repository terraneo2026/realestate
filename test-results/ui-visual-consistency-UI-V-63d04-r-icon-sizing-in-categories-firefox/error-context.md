# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-visual-consistency.spec.ts >> UI Visual Consistency >> should have proper icon sizing in categories
- Location: tests\e2e\ui-visual-consistency.spec.ts:138:7

# Error details

```
Error: browserType.launch: Failed to launch the browser process.
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe -no-remote -headless -profile C:\Users\user\AppData\Local\Temp\playwright_firefoxdev_profile-Rb3wZW -juggler-pipe -silent
<launched> pid=18980
[pid=18980] <process did exit: exitCode=2147483760, signal=null>
[pid=18980] starting temporary directories cleanup
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\firefox-1511\firefox\firefox.exe -no-remote -headless -profile C:\Users\user\AppData\Local\Temp\playwright_firefoxdev_profile-Rb3wZW -juggler-pipe -silent
  - <launched> pid=18980
  - [pid=18980] <process did exit: exitCode=2147483760, signal=null>
  - [pid=18980] starting temporary directories cleanup
  - [pid=18980] <gracefully close start>
  - [pid=18980] <kill>
  - [pid=18980] <skipped force kill spawnedProcess.killed=false processClosed=true>
  - [pid=18980] finished temporary directories cleanup
  - [pid=18980] <gracefully close end>

```