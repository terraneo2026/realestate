# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: categories-grid.spec.ts >> Categories Grid >> should have visible category cards on mobile
- Location: tests\e2e\categories-grid.spec.ts:86:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=21448
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=21448
  - [pid=21448] <gracefully close start>
  - [pid=21448] <kill>
  - [pid=21448] <will force kill>
  - [pid=21448] <process did exit: exitCode=2147483760, signal=null>
  - [pid=21448] starting temporary directories cleanup
  - [pid=21448] finished temporary directories cleanup
  - [pid=21448] <gracefully close end>

```