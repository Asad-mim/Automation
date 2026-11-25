
import { test, expect } from '@playwright/test';

test('Restaurant Online Order Automation', async ({ page }) => {

  test.setTimeout(300000);

  // FIXED CUSTOMER INFORMATION
  const restaurantUrl = 'https://the-71.netlify.app/';
  const email = 'asadmim70@gmail.com';
  const password = '1234qwer';

  // FIXED ALLERGY SELECTION
  const testAllergens = ['Lupin', 'Egg'];

  // Helper: Wait and click
  async function clickVisible(locator) {
    await locator.waitFor({
      state: 'visible',
      timeout: 20000
    });

    await locator.click();
  }

  // Helper: Wait and fill
  async function fillVisible(locator, value) {
    await locator.waitFor({
      state: 'visible',
      timeout: 20000
    });

    await locator.fill(value);
  }

  // STEP 1: OPEN WEBSITE
  console.log('STEP 1: Opening restaurant website');

  await page.goto(restaurantUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // Accept cookies
  const acceptButton = page.getByRole('button', {
    name: 'Accept all'
  });

  if (await acceptButton.isVisible().catch(() => false)) {
    await acceptButton.click();
  }

  // STEP 2: OPEN ONLINE MENU
  console.log('STEP 2: Opening online menu');

  await clickVisible(
    page.getByRole('button', {
      name: 'Open menu'
    })
  );

  await clickVisible(
    page.getByRole('navigation', {
      name: 'Menu navigation'
    }).getByRole('link', {
      name: 'Order Online'
    })
  );

  // STEP 3: SELECT COLLECTION
  console.log('STEP 3: Selecting collection');

  await clickVisible(
    page.locator(
      '#category2 > .card-body > .card > .ng-tns-c3872932673-0.card-container > .action-area > .ng-tns-c3872932673-0.icon-btn > div'
    )
  );

  await clickVisible(
    page.getByRole('button', {
      name: /COLLECTION 30 MIN/i
    })
  );

  // STEP 4: SELECT FOOD ITEMS
  console.log('STEP 4: Selecting food items');

  // First item - quantity interaction
  await page.locator('div').filter({
    hasText: /^1$/
  }).nth(1).click({
    clickCount: 4
  });

  // First food item
  await clickVisible(
    page.locator(
      '#category1 > .card-body > div:nth-child(3) > .ng-tns-c3872932673-0.card-container > .action-area > .ng-tns-c3872932673-0.icon-btn'
    )
  );

  await clickVisible(
    page.locator(
      'li:nth-child(2) > .d-flex > .price-and-btn > .initial-btn'
    )
  );

  await clickVisible(
    page.getByRole('listitem').filter({
      hasText: 'CHICKEN£'
    })
  );

  await clickVisible(
    page.locator('.initial-btn').first()
  );

  await clickVisible(
    page.locator('div').filter({
      hasText: /^£9\.95$/
    }).first()
  );

  await clickVisible(
    page.getByRole('button', {
      name: /Add to Basket/
    })
  );

  // Second food item
  await clickVisible(
    page.locator(
      '#category1 > .card-body > div:nth-child(2) > .ng-tns-c3872932673-0.card-container > .action-area > .ng-tns-c3872932673-0.icon-btn'
    )
  );

  await clickVisible(
    page.locator(
      'li:nth-child(2) > .d-flex > .price-and-btn > .initial-btn'
    )
  );

  await clickVisible(
    page.getByText('£9.95').nth(2)
  );

  await clickVisible(
    page.getByRole('button', {
      name: /Add to Basket/
    })
  );

  // Third food item
  await clickVisible(
    page.locator(
      'div:nth-child(5) > .ng-tns-c3872932673-0.card-container > .action-area > .ng-tns-c3872932673-0.icon-btn'
    )
  );

  await clickVisible(
    page.locator('.initial-btn').first()
  );

  await clickVisible(
    page.locator('div').filter({
      hasText: /^£3\.95$/
    }).first()
  );

  await clickVisible(
    page.getByRole('button', {
      name: /Add to Basket/
    })
  );

  // STEP 5: OPEN CHECKOUT
  console.log('STEP 5: Opening checkout');

  await clickVisible(
    page.getByRole('button', {
      name: /Checkout £/
    })
  );

  // STEP 6: SELECT ALLERGIES
  console.log('STEP 6: Selecting fixed allergies');

  for (const allergen of testAllergens) {

    const allergyOption = page.getByText(allergen, {
      exact: true
    });

    await expect(allergyOption).toBeVisible();

    await allergyOption.click();

    console.log(`Selected allergy: ${allergen}`);
  }

  // Continue after allergy selection
  const allergyContinueButton = page.getByRole('button', {
    name: /Continue/i
  });

  await expect(allergyContinueButton).toBeEnabled({
    timeout: 15000
  });

  await allergyContinueButton.click();

  // STEP 7: CUSTOMER LOGIN
  console.log('STEP 7: Customer login');

  await fillVisible(
    page.getByRole('textbox', {
      name: 'Email / Mobile number'
    }),
    email
  );

  await fillVisible(
    page.getByRole('textbox', {
      name: 'Password'
    }),
    password
  );

  await clickVisible(
    page.getByRole('button', {
      name: 'Sign In'
    })
  );

  // STEP 8: CLOSE DIRECTIONS POPUP
  console.log('STEP 8: Handling directions popup');

  const directionsButton = page.getByRole('button', {
    name: 'Close directions'
  });

  if (await directionsButton.isVisible().catch(() => false)) {
    await directionsButton.click();
  }

  // STEP 9: SELECT CASH PAYMENT
  console.log('STEP 9: Selecting cash payment');

  const cashOption = page.getByRole('radio', {
    name: 'Cash'
  });

  await cashOption.check();

  await expect(cashOption).toBeChecked();

  // STEP 10: VERIFY CHECKOUT
  console.log('STEP 10: Final checkout verification');

  const orderButton = page.getByRole('button', {
    name: 'Order Now'
  });

  await expect(orderButton).toBeVisible();

  console.log('Customer:', email);
  console.log('Allergies:', testAllergens.join(', '));
  console.log('Payment: Cash');
  console.log('Checkout verification completed.');

  // STOP BEFORE REAL ORDER SUBMISSION
  console.log('Waiting for manual order review...');

  await page.pause();

});
