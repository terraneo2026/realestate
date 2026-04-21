# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: categories-grid.spec.ts >> Categories Grid >> should display category grid with all items
- Location: tests\e2e\categories-grid.spec.ts:9:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=11044
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=11044
  - [pid=11044] <gracefully close start>
  - [pid=11044] <kill>
  - [pid=11044] <will force kill>
  - [pid=11044] <process did exit: exitCode=2147483760, signal=null>
  - [pid=11044] starting temporary directories cleanup
  - [pid=11044] finished temporary directories cleanup
  - [pid=11044] <gracefully close end>

```