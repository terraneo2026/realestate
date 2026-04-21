# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-validation.spec.ts >> UI Design - Production Validation >> ✅ Badges positioned correctly on cards
- Location: tests\e2e\ui-validation.spec.ts:88:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=14924
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=14924
  - [pid=14924] <gracefully close start>
  - [pid=14924] <kill>
  - [pid=14924] <will force kill>
  - [pid=14924] <process did exit: exitCode=2147483760, signal=null>
  - [pid=14924] starting temporary directories cleanup
  - [pid=14924] finished temporary directories cleanup
  - [pid=14924] <gracefully close end>

```