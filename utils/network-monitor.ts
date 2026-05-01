import { Page } from '@playwright/test';

export const monitorNetwork = (page: Page) => {
  page.on('requestfailed', request => {
    console.error(`❌ Request Failed: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      console.error(`⚠️ API Error: ${response.status()} ${response.url()}`);
    }
  });
};
