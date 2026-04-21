# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: property-cards.spec.ts >> Property Cards & Images >> should have proper card structure with all elements
- Location: tests\e2e\property-cards.spec.ts:38:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=21132
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=21132
  - [pid=21132] <gracefully close start>
  - [pid=21132] <kill>
  - [pid=21132] <will force kill>
  - [pid=21132] <process did exit: exitCode=2147483760, signal=null>
  - [pid=21132] starting temporary directories cleanup
  - [pid=21132] finished temporary directories cleanup
  - [pid=21132] <gracefully close end>

```