# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core-ui-fixes.spec.ts >> UI Design - Core Fixes Validation >> ✅ Property images render without layout shift
- Location: tests\e2e\core-ui-fixes.spec.ts:36:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=17796
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=17796
  - [pid=17796] <gracefully close start>
  - [pid=17796] <kill>
  - [pid=17796] <will force kill>
  - [pid=17796] <process did exit: exitCode=2147483760, signal=null>
  - [pid=17796] starting temporary directories cleanup
  - [pid=17796] finished temporary directories cleanup
  - [pid=17796] <gracefully close end>

```