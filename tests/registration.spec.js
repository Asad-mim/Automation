
import { test, expect } from '@playwright/test';

test('Restaurant registration with manual OTP', async ({ page }) => {
  test.setTimeout(300000);

  //const registrationUrl = 'https://draft.thaiimperial.com/sign-up';
  const registrationUrl = 'https://v9-asap-blank-preorder.netlify.app/sign-up';
 
  const tempMailUrl = 'https://temp-mail.org/en/';

  const phone = process.env.TEST_PHONE;
  const firstName = 'Test';
  const lastName = 'User';
  const password = 'ChangeMe123!';
  const postcode = process.env.TEST_POSTCODE || 'RG21 7LS';

  if (!phone?.trim()) {
    throw new Error(
      'Phone number missing. Enter your phone number in PowerShell first.'
    );
  }

  // Fill fields slowly
  async function fillSlowly(locator, value) {
    await locator.waitFor({
      state: 'visible',
      timeout: 20000,
    });

    await locator.fill(value);
    await page.waitForTimeout(500);
  }

  // STEP 1: Open Temp-Mail
  console.log('STEP 1: Opening Temp-Mail...');

  const tempMailPage = await page.context().newPage();

  await tempMailPage.goto(tempMailUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await tempMailPage.waitForFunction(
    () =>
      Array.from(document.querySelectorAll('input')).some((input) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())
      ),
    null,
    { timeout: 30000 }
  );

  const email = await tempMailPage.locator('input').evaluateAll((inputs) =>
    inputs
      .map((input) => input.value.trim())
      .find((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
  );

  if (!email) {
    throw new Error('Could not find an email address on Temp-Mail.');
  }

  console.log('Temporary email:', email);

  // STEP 2: Open registration page
  console.log('STEP 2: Opening registration page...');

  await page.goto(registrationUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  const acceptButton = page.getByRole('button', {
    name: 'Accept',
    exact: true,
  });

  if (await acceptButton.isVisible().catch(() => false)) {
    await acceptButton.click();
  }

  // STEP 3: Fill registration details
  console.log('STEP 3: Filling registration form...');

  const textboxes = page.getByRole('textbox');

  await fillSlowly(textboxes.nth(0), firstName);
  await fillSlowly(textboxes.nth(1), lastName);

  await fillSlowly(
    page.locator('input[type="email"]'),
    email
  );

  await fillSlowly(
    page.locator('#sign_up-mobile_no'),
    phone.trim()
  );

  const passwordFields = page.locator('input[type="password"]');

  await fillSlowly(passwordFields.nth(0), password);
  await fillSlowly(passwordFields.nth(1), password);

  // STEP 4: Click NEXT and wait for the address page
  console.log('STEP 4: Clicking NEXT...');

  await page.getByRole('button', { name: 'NEXT' }).click();

  const postcodeField = page.getByRole('textbox', {
    name: 'i.e E16SA',
  });

  await postcodeField.waitFor({
    state: 'visible',
    timeout: 30000,
  });

  console.log('Address page opened.');

  // STEP 5: Choose automatic address entry
  const automaticAddress = page.getByText(
    'Enter address by automatic',
    { exact: true }
  );

  if (await automaticAddress.isVisible().catch(() => false)) {
    await automaticAddress.click();
  }

  await fillSlowly(postcodeField, postcode);

  await page.getByText('Search', {
    exact: true,
  }).click();

  const addressResult = page.getByText(
    /Westminster House|RG21/i
  ).first();

  await addressResult.waitFor({
    state: 'visible',
    timeout: 20000,
  });

  console.log('Address result found. Selecting it...');

  await addressResult.click();

  // STEP 6: Click REGISTER
  console.log('STEP 6: Clicking REGISTER...');

  const registerButton = page.getByRole('button', {
    name: /REGISTER/i,
  });

  await registerButton.waitFor({
    state: 'visible',
    timeout: 20000,
  });

  await registerButton.click();

  // STEP 7: Wait for the OTP page to appear
  console.log('STEP 7: Waiting for OTP page...');

  await page.waitForTimeout(3000);

  console.log('Current URL:', page.url());
  console.log('Enter OTP manually in the browser.');

  // Pause so you can enter OTP and verify manually
  await page.pause();

  // STEP 8: Continue after manual OTP verification
  console.log('Resumed after manual OTP verification.');

  // Allow the site to process the verification
  await page.waitForTimeout(3000);

  console.log('Current URL after OTP:', page.url());

  // STEP 9: Keep the browser open on the resulting website page
  console.log(
    'Check that verification succeeded. Browser will remain open.'
  );

  await page.pause();
});
