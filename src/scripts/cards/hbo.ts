// import fetch from 'node-fetch';
// import puppeteer from 'puppeteer';

interface Card {
  number: number;
  expiryDate: string;
  cvv: number;
}
export const createNewHBOTrial = (
  email: string,
  password: string,
  card: Card
) => {
  console.log(card);
};
