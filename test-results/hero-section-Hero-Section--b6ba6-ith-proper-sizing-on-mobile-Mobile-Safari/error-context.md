# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hero-section.spec.ts >> Hero Section >> should display search filter inputs with proper sizing on mobile
- Location: tests\e2e\hero-section.spec.ts:97:7

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
<launched> pid=10500
Call log:
  - <launching> C:\Users\user\AppData\Local\ms-playwright\webkit-2272\Playwright.exe --inspector-pipe --disable-accelerated-compositing --headless --no-startup-window
  - <launched> pid=10500
  - [pid=10500] <gracefully close start>
  - [pid=10500] <kill>
  - [pid=10500] <will force kill>
  - [pid=10500] <process did exit: exitCode=2147483760, signal=null>
  - [pid=10500] starting temporary directories cleanup
  - [pid=10500] finished temporary directories cleanup
  - [pid=10500] <gracefully close end>

```