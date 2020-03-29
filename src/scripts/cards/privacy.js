import puppeteer from 'puppeteer';
import fetch from 'node-fetch';

const getPrivacyAuthToken = async (email, password) => {
  console.log('Logging in to privacy.com...');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://privacy.com/login');
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);

  console.log('Submitting...');
  await page.click('.submit-button');

  console.log('Waiting for successful login');
  await page.waitForSelector('.new-card', { timeout: 100000 });

  console.log('Logged in! Getting cookies..');
  const cookies = await page.cookies();
  console.log(cookies);
  await browser.close();
  return cookies.token;
};

const issueNewCard = async (
  token,
  nickname,
  type = 'SINGLE_USE',
  spendLimitDuration = 'MONTHLY',
  spendLimit = 1
) => {
  console.log('Issuing new card...');

  const newCardData = await fetch('https://privacy.com/api/v1/card', {
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type,
      spendLimitDuration,
      unused: true,
      memo: nickname,
      spendLimit,
    }),
    method: 'POST',
  });

  const newCard = await newCardData.json();
  console.log(newCard);
  return newCard;
};

const createNewPrivacyCard = async (
  nickname,
  type = 'SINGLE_USE',
  spendLimitDuration = 'MONTHLY',
  spendLimit = 1
) => {
  process.env.PRIVACY_EMAIL = 'aivantgoyal@gmail.com';
  process.env.PRIVACY_PASSWORD = 'agprivacy@Concorde1';
  const email = process.env.PRIVACY_EMAIL;
  const password = process.env.PRIVACY_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Error logging into privacy.com: Could not find both PRIVACY_EMAIL and PRIVACY_PASSWORD environment variables'
    );
  }

  console.log('Creating New Privacy Card!');

  const token = await getPrivacyAuthToken(email, password);
  // const token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTgwY2M4MGI5NzVlNjUyNjUwNDk4MzkiLCJpYXQiOjE1ODU0OTkyNjUsImV4cCI6MTU4NTUxNzI2NX0.vIb9Qy22GglqWJzrup48QyzWVeDqTLFY44Dg0aUn5Pk';

  return issueNewCard(token, nickname, type, spendLimitDuration, spendLimit);
};

createNewPrivacyCard('Test Card 2');
