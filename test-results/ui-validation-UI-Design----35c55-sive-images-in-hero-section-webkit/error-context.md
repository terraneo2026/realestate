# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-validation.spec.ts >> UI Design - Production Validation >> ✅ Responsive images in hero section
- Location: tests\e2e\ui-validation.spec.ts:156:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=15800
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=15800
  - [pid=15800] <gracefully close start>
  - [pid=15800] <kill>
  - [pid=15800] <will force kill>
  - [pid=15800] <process did exit: exitCode=2147483760, signal=null>
  - [pid=15800] starting temporary directories cleanup
  - [pid=15800] finished temporary directories cleanup
  - [pid=15800] <gracefully close end>

```