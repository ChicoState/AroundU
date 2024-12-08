
import { Builder, Browser, By, Key, until, WebElement } from 'selenium-webdriver';

(async function example() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get('http://localhost:3000');

    await driver.findElement(By.className("h-[18px] w-[18px]")).click();

    var element = await driver.findElement(By.className("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"));
    element.sendKeys("Test Event");
   
  } finally {
    //await driver.quit();
  }
})();