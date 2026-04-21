# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui-validation.spec.ts >> UI Design - Production Validation >> ✅ Images load with Next.js Image optimization
- Location: tests\e2e\ui-validation.spec.ts:35:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=8872
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=8872
  - [pid=8872] <gracefully close start>
  - [pid=8872] <kill>
  - [pid=8872] <will force kill>
  - [pid=8872] <process did exit: exitCode=2147483760, signal=null>
  - [pid=8872] starting temporary directories cleanup
  - [pid=8872] finished temporary directories cleanup
  - [pid=8872] <gracefully close end>

```