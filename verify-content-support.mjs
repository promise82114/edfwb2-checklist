// Existing full-catalog checks explicitly opt into all supported content.
export async function enableAllContent(page){
 await page.locator('#settingsOpen').click();
 await page.locator('#seasonPass').check();
 for(const id of ['riho','honda','himekawa','air-senpai'])await page.locator('#content-'+id).check();
 await page.locator('#settingsDialog .close').click();
}
