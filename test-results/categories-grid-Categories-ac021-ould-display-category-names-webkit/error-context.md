# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: categories-grid.spec.ts >> Categories Grid >> should display category names
- Location: tests\e2e\categories-grid.spec.ts:46:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=10008
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=10008
  - [pid=10008] <gracefully close start>
  - [pid=10008] <kill>
  - [pid=10008] <will force kill>
  - [pid=10008] <process did exit: exitCode=2147483760, signal=null>
  - [pid=10008] starting temporary directories cleanup
  - [pid=10008] finished temporary directories cleanup
  - [pid=10008] <gracefully close end>

```