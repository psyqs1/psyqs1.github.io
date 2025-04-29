import { test, expect } from '@playwright/test';

const websiteURL = 'http://127.0.0.1:5500/Pages/PeopleSearch.html';

test.beforeEach(async ({ page }) => {
  await page.goto(websiteURL);
});

//Tries to add a vehicle that already exists
//Goal: Site returns an error message
test('AddVehicle, Existing Vehicle', async ({ page }) => {
  await page.getByRole('link', { name: 'Add a vehicle' }).click();

  await page.getByRole('textbox', { name: 'Plate Number:' }).fill('GHT56FN');
  await page.getByRole('textbox', { name: 'Make:' }).fill('Fiat');
  await page.getByRole('textbox', { name: 'Model:' }).fill('Punto');
  await page.getByRole('textbox', { name: 'Colour:' }).fill('Blue');

  await page.getByRole('textbox', { name: 'Owner Name:' }).fill('Daphne');

  await page.getByRole('button', { name: 'Check owner' }).click();
  await page.getByRole('button', { name: 'Select as Owner' }).first().click();
  await page.getByRole('button', { name: 'Add vehicle' }).click();

  await expect(page.getByText('Error')).toContainText("Error");
});

//Tries to add a vehicle with some missing information
//Goal: Add Vehicle button is unavailable
test('AddVehicle, Missing Field', async ({ page }) => {
  await page.getByRole('link', { name: 'Add a vehicle' }).click();

  await page.getByRole('textbox', { name: 'Plate Number:' }).fill('GHT56FN');
  await page.getByRole('textbox', { name: 'Make:' }).fill('Fiat');
  //await page.getByRole('textbox', { name: 'Model:' }).fill('Punto');
  await page.getByRole('textbox', { name: 'Colour:' }).fill('Blue');

  await page.getByRole('textbox', { name: 'Owner Name:' }).fill('Daphne');

  await page.getByRole('button', { name: 'Check owner' }).click();
  await page.getByRole('button', { name: 'Select as Owner' }).first().click();

  await expect(page.getByRole('button', { name: 'Add vehicle' })).toBeDisabled();
});


//Tries to add a 'new' owner that actually already exists
//Goal: Selects that existing owner, able to add vehicle
test('AddVehicle, Add Owner, Already Exists', async ({ page }) => {
  await page.getByRole('link', { name: 'Add a vehicle' }).click();

  await page.getByRole('textbox', { name: 'Owner Name:' }).fill('Rachel Smith');

  await page.getByRole('button', { name: 'Check owner' }).click();

  await page.getByRole('button', { name: 'New owner' }).click();

  await page.getByRole('textbox', { name: 'New Owner Address:' }).fill('Wollaton');
  await page.getByRole('textbox', { name: 'New Owner Date of Birth:' }).fill('1979-06-05');
  await page.getByRole('textbox', { name: 'New Owner License Number:' }).fill('SG345PQ');
  await page.getByRole('textbox', { name: 'New Owner Expiry Date:' }).fill('2020-05-05');

  await page.waitForTimeout(300);

  await page.getByRole('button', { name: 'Add owner' }).click();

  await expect(page.locator('#message-owner')).toContainText('This Owner Already Exists!')
  await expect(page.locator('#results').locator('div')).toHaveCount(1)

  await page.getByRole('textbox', { name: 'Plate Number:' }).fill('TestPlate1');
  await page.getByRole('textbox', { name: 'Make:' }).fill('TestMake1');
  await page.getByRole('textbox', { name: 'Model:' }).fill('TestModel1');
  await page.getByRole('textbox', { name: 'Colour:' }).fill('TestColour1');

  await page.getByRole('button', { name: 'Add vehicle' }).click();
  await expect(page.locator('#message-vehicle')).toContainText('Vehicle added successfully');

});

//Tries to add a 'new' owner that actually already exists, except with a difference in letter casing
//Goal: Selects that existing owner, able to add vehicle
test('AddVehicle, Add Owner, Already Exists Lowercase', async ({ page }) => {
  await page.getByRole('link', { name: 'Add a vehicle' }).click();

  await page.getByRole('textbox', { name: 'Owner Name:' }).fill('rachel Smith'); // !

  await page.getByRole('button', { name: 'Check owner' }).click();

  await page.getByRole('button', { name: 'New owner' }).click();

  await page.getByRole('textbox', { name: 'New Owner Address:' }).fill('Wollaton');
  await page.getByRole('textbox', { name: 'New Owner Date of Birth:' }).fill('1979-06-05');
  await page.getByRole('textbox', { name: 'New Owner License Number:' }).fill('SG345PQ');
  await page.getByRole('textbox', { name: 'New Owner Expiry Date:' }).fill('2020-05-05');

  await page.waitForTimeout(300);

  await page.getByRole('button', { name: 'Add owner' }).click();

  await expect(page.locator('#message-owner')).toContainText('This Owner Already Exists!')
  await expect(page.locator('#results').locator('div')).toHaveCount(1)

  await page.getByRole('textbox', { name: 'Plate Number:' }).fill('TestPlate2');
  await page.getByRole('textbox', { name: 'Make:' }).fill('TestMake2');
  await page.getByRole('textbox', { name: 'Model:' }).fill('TestModel2');
  await page.getByRole('textbox', { name: 'Colour:' }).fill('TestColour2');

  await page.getByRole('button', { name: 'Add vehicle' }).click();
  await expect(page.locator('#message-vehicle')).toContainText('Vehicle added successfully');

});

//Tries to add a new owner with identical details except one different field
//Goal: Does not select the similar owner, creates new owner, able to add vehicle
test('AddVehicle, Add Owner, Almost Already Exists', async ({ page }) => {
  await page.getByRole('link', { name: 'Add a vehicle' }).click();

  await page.getByRole('textbox', { name: 'Owner Name:' }).fill('Quentin');

  await page.getByRole('button', { name: 'Check owner' }).click();

  await page.getByRole('button', { name: 'New owner' }).click();

  await page.getByRole('textbox', { name: 'New Owner Address:' }).fill('Wollaton');
  await page.getByRole('textbox', { name: 'New Owner Date of Birth:' }).fill('1979-06-05');
  await page.getByRole('textbox', { name: 'New Owner License Number:' }).fill('SG345PQ');
  await page.getByRole('textbox', { name: 'New Owner Expiry Date:' }).fill('2020-05-05');

  await page.waitForTimeout(300);

  await page.getByRole('button', { name: 'Add owner' }).click();

  await expect(page.locator('#message-owner')).toContainText('Owner added successfully')
  await expect(page.locator('#results').locator('div')).toHaveCount(1)

  await page.getByRole('textbox', { name: 'Plate Number:' }).fill('TestPlate3');
  await page.getByRole('textbox', { name: 'Make:' }).fill('TestMake3');
  await page.getByRole('textbox', { name: 'Model:' }).fill('TestModel3');
  await page.getByRole('textbox', { name: 'Colour:' }).fill('TestColour3');

  await page.getByRole('button', { name: 'Add vehicle' }).click();
  await expect(page.locator('#message-vehicle')).toContainText('Vehicle added successfully');

});


//Tries to add a new owner with some missing information
//Goal: Add Vehicle button is unavailable
test('AddVehicle, Add Owner, Missing Field', async ({ page }) => {
  await page.getByRole('link', { name: 'Add a vehicle' }).click();

  await page.getByRole('textbox', { name: 'Plate Number:' }).fill('GHT56FN');
  await page.getByRole('textbox', { name: 'Make:' }).fill('Fiat');
  await page.getByRole('textbox', { name: 'Model:' }).fill('Punto');
  await page.getByRole('textbox', { name: 'Colour:' }).fill('Blue');

  await page.getByRole('textbox', { name: 'Owner Name:' }).fill('Quentin');

  await page.getByRole('button', { name: 'Check owner' }).click();

  await page.getByRole('button', { name: 'New owner' }).click();

  await page.getByRole('textbox', { name: 'New Owner Address:' }).fill('Remetehegyi');
  //await page.getByRole('textbox', { name: 'New Owner Date of Birth:' }).fill('Sometime');
  await page.getByRole('textbox', { name: 'New Owner License Number:' }).fill('12345');
  await page.getByRole('textbox', { name: 'New Owner Expiry Date:' }).fill('Sometime');

  await expect(page.getByRole('button', { name: 'Add vehicle' })).toBeDisabled();
});

//Tries to add a new owner with incorrect flipped date input (DD-MM-YYYY)
//Goal: Add Owner button is unavailable
test('AddVehicle, Add Owner, Incorrect Date (Flipped)', async ({ page }) => {;
  await page.getByRole('link', { name: 'Add a vehicle' }).click();

  await page.getByRole('textbox', { name: 'Owner Name:' }).fill('Quentin');

  await page.getByRole('button', { name: 'Check owner' }).click();

  await page.getByRole('button', { name: 'New owner' }).click();

  await page.getByRole('textbox', { name: 'New Owner Address:' }).fill('Remetehegyi');
  await page.getByRole('textbox', { name: 'New Owner Date of Birth:' }).fill('23-09-2004');
  await page.getByRole('textbox', { name: 'New Owner License Number:' }).fill('AB123CD');
  await page.getByRole('textbox', { name: 'New Owner Expiry Date:' }).fill('2099-12-31');

  await expect(page.getByRole('button', { name: 'Add owner' })).toBeDisabled();
});

//Tries to add a new owner with impossible date input (September 40th)
//Goal: Add Owner button is unavailable
test('AddVehicle, Add Owner, Incorrect Date (Impossible)', async ({ page }) => {;
  await page.getByRole('link', { name: 'Add a vehicle' }).click();

  await page.getByRole('textbox', { name: 'Owner Name:' }).fill('Quentin');

  await page.getByRole('button', { name: 'Check owner' }).click();

  await page.getByRole('button', { name: 'New owner' }).click();

  await page.getByRole('textbox', { name: 'New Owner Address:' }).fill('Remetehegyi');
  await page.getByRole('textbox', { name: 'New Owner Date of Birth:' }).fill('2004-09-40'); // !
  await page.getByRole('textbox', { name: 'New Owner License Number:' }).fill('AB123CD');
  await page.getByRole('textbox', { name: 'New Owner Expiry Date:' }).fill('2099-12-31');

  await expect(page.getByRole('button', { name: 'Add owner' })).toBeDisabled();
});