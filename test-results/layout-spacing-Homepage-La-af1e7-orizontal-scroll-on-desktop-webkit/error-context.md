# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: layout-spacing.spec.ts >> Homepage Layout & Spacing >> should have no horizontal scroll on desktop
- Location: tests\e2e\layout-spacing.spec.ts:48:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=18872
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=18872
  - [pid=18872] <gracefully close start>
  - [pid=18872] <kill>
  - [pid=18872] <will force kill>
  - [pid=18872] <process did exit: exitCode=2147483760, signal=null>
  - [pid=18872] starting temporary directories cleanup
  - [pid=18872] finished temporary directories cleanup
  - [pid=18872] <gracefully close end>

```