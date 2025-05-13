import { test, expect } from '@playwright/test';

const websiteURL = 'http://127.0.0.1:5500/Pages/PeopleSearch.html';

test.beforeEach(async ({ page }) => {
  await page.goto(websiteURL);
});

//#region People Search

//Tries to submit with no information
//Goal: Submit button is unvailable
test('PeopleSearch, Empty Fields', async ({ page }) => {
  await page.getByRole('link', { name: 'People search' }).click();

  await page.getByRole('textbox', { name: 'Search by driver name:' }).fill('');
  await page.getByRole('textbox', { name: 'Search by driving license number:' }).fill('');

  await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
});

//Tries to fill in both a name and a license number
//Goal: Error message is shown
test('PeopleSearch, Both Fields Filled', async ({ page }) => {
  await page.getByRole('link', { name: 'People search' }).click();

  await page.getByRole('textbox', { name: 'Search by driver name:' }).fill('*');
  await page.getByRole('textbox', { name: 'Search by driving license number:' }).fill('*');

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.locator("#message")).toContainText("Error");
}); 

//If the person is not in the system it must give an appropriate error message.
test('PeopleSearch, Person Not In Database', async ({ page }) => {
  await page.getByRole('link', { name: 'People search' }).click();

  await page.getByRole('textbox', { name: 'Search by driver name:' }).fill('Bartholomew');

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.locator("#message")).toContainText("No result found!");
});

//This search must not be case sensitive
test('PeopleSearch, Case Insensitivity', async ({ page }) => {
  await page.getByRole('link', { name: 'People search' }).click();

  await page.getByRole('textbox', { name: 'Search by driver name:' }).fill('Rachel Smith');

  await page.getByRole('button', { name: 'Submit' }).click();

  let UppercaseResult = page.locator("#results").innerHTML;

  await page.reload();

  await page.getByRole('textbox', { name: 'Search by driver name:' }).fill('rachel smith');

  await page.getByRole('button', { name: 'Submit' }).click();

  let LowercaseResult = page.locator("#results").innerHTML;

  await expect(UppercaseResult).toEqual(LowercaseResult);
}); 

//Partial Search
test('PeopleSearch, Partial Search', async ({ page }) => {
  await page.getByRole('link', { name: 'People search' }).click();

  await page.getByRole('textbox', { name: 'Search by driver name:' }).fill('Rachel Smith');

  await page.getByRole('button', { name: 'Submit' }).click();

  let FullNameResult = page.locator("#results").innerHTML;

  await page.reload();

  await page.getByRole('textbox', { name: 'Search by driver name:' }).fill('Rach');

  await page.getByRole('button', { name: 'Submit' }).click();

  let PartialNameResult = page.locator("#results").innerHTML;

  await expect(FullNameResult).toEqual(PartialNameResult);
}); 
//#endregion

//#region Vehicle Search
//Tries to submit with no information
//Goal: Submit button is unvailable
test('VehicleSearch, Empty Fields', async ({ page }) => {
  await page.getByRole('link', { name: 'Vehicle search' }).click();

  await page.getByRole('textbox', { name: 'Search by license plate number:' }).fill('');

  await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
});

//Tries to search a nonexistant license plate
//Goal: Error message is displayed
test('VehicleSearch, Vehicle Not In Database', async ({ page }) => {
  await page.getByRole('link', { name: 'Vehicle search' }).click();

  await page.getByRole('textbox', { name: 'Search by license plate number:' }).fill('ISUREHOPETHISISNOTALICENSENUMBER');

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.locator("#message")).toContainText("No result found!");
});

//The system will then show all the details of the car (e.g., type, colour etc.), and the ownerʼs name and license number.
test('VehicleSearch, Returns All Details', async ({ page}) => {

  await page.getByRole('link', { name: 'Vehicle search' }).click();
  
  await page.getByRole('textbox', { name: 'Search by license plate number:' }).fill('GHT56FN');

  await page.getByRole('button', { name: 'Submit' }).click();

  //Number, Make. Model. Color, Owner, OwnerID
  await expect(page.getByText("GHT56FN Fiat Punto Blue Daphne Lai (ID: 4)")).toBeVisible();
});
  

//Allow for missing data in the system (e.g., the vehicle might not be in the system, or the vehicle might be in the system but the owner might be unknown).
test('VehicleSearch, Handles Missing Owner', async ({ page}) => {

  await page.getByRole('link', { name: 'Vehicle search' }).click();
  
  await page.getByRole('textbox', { name: 'Search by license plate number:' }).fill('KWK24JI');

  await page.getByRole('button', { name: 'Submit' }).click();

  //Number, Make. Model. Color, Unknown owner handled
  await expect(page.getByText("KWK24JI Tesla 3 White Unknown (ID: null)")).toBeVisible();
});
  
//#endregion