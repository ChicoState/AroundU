
import { Builder, Browser, By, Key, until, WebElement, Select } from 'selenium-webdriver';

(async function example() {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    await driver.get('http://localhost:3000');

    await driver.findElement(By.className("h-[18px] w-[18px]")).click();

    //Name
    var element1 = await driver.findElement(By.css('[placeholder="Enter event name"]'));
    element1.sendKeys("Test Event");

    //Date/Time
    var element2 = await driver.findElement(By.css('[type="datetime-local"]'));
    element2.sendKeys(Key.SPACE);
    element2.sendKeys(Key.ENTER);

    //Address
    var element3 = await driver.findElement(By.css('[placeholder="Enter event address"]'));
    element3.sendKeys("Test Addr");

    //Description
    var element4 = await driver.findElement(By.css('[placeholder="Enter event description (optional)"]'));
    element4.sendKeys("Test Desc");

    //Category
    var element5 = await driver.findElement(By.className("flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full"));
    element5.sendKeys("o");

    //Create Event
    await driver.findElement(By.className("items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 ml-auto flex space-x-2")).click();

   
  } finally {
    //await driver.quit();
  }
})();