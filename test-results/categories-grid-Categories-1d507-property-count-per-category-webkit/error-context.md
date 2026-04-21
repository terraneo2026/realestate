# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: categories-grid.spec.ts >> Categories Grid >> should display property count per category
- Location: tests\e2e\categories-grid.spec.ts:57:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=22976
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=22976
  - [pid=22976] <gracefully close start>
  - [pid=22976] <kill>
  - [pid=22976] <will force kill>
  - [pid=22976] <process did exit: exitCode=2147483760, signal=null>
  - [pid=22976] starting temporary directories cleanup
  - [pid=22976] finished temporary directories cleanup
  - [pid=22976] <gracefully close end>

```