# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: categories-grid.spec.ts >> Categories Grid >> should show hover effect on category cards
- Location: tests\e2e\categories-grid.spec.ts:103:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=8084
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=8084
  - [pid=8084] <gracefully close start>
  - [pid=8084] <kill>
  - [pid=8084] <will force kill>
  - [pid=8084] <process did exit: exitCode=2147483760, signal=null>
  - [pid=8084] starting temporary directories cleanup
  - [pid=8084] finished temporary directories cleanup
  - [pid=8084] <gracefully close end>

```