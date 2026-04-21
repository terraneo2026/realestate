# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-ui-fixes.spec.ts >> UI Design - Core Fixes Validation >> ✅ No horizontal scroll on desktop
- Location: tests\e2e\core-ui-fixes.spec.ts:159:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=10724
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=10724
  - [pid=10724] <gracefully close start>
  - [pid=10724] <kill>
  - [pid=10724] <will force kill>
  - [pid=10724] <process did exit: exitCode=2147483760, signal=null>
  - [pid=10724] starting temporary directories cleanup
  - [pid=10724] finished temporary directories cleanup
  - [pid=10724] <gracefully close end>

```