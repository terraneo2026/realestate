# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: property-cards.spec.ts >> Property Cards & Images >> should display property cards in grid layout
- Location: tests\e2e\property-cards.spec.ts:9:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=12980
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=12980
  - [pid=12980] <gracefully close start>
  - [pid=12980] <kill>
  - [pid=12980] <will force kill>
  - [pid=12980] <process did exit: exitCode=2147483760, signal=null>
  - [pid=12980] starting temporary directories cleanup
  - [pid=12980] finished temporary directories cleanup
  - [pid=12980] <gracefully close end>

```