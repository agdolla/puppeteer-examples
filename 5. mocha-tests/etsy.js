/**
 * @name Etsy shopping cart
 * @desc Goes to etsy.com, select the first knick knack and adds it to the shopping cart.
 */

const assert = require('assert')
const puppeteer = require('puppeteer')
let browser
let page

before(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
  await page.setViewport({ width: 1280, height: 800 })
})

describe('Etsy shopping cart', () => {
  it('shows the correct category', async () => {
    await page.goto('https://www.etsy.com/c/art-and-collectibles/collectibles/figurines?ref=catnav-66', { waitUntil: 'networkidle2' })
    const categoryTitle = await page.evaluate(() => document.querySelector('h1').textContent)
    assert.equal(categoryTitle, 'Figurines & Knicknacks')
  }).timeout(20000)

  it('selects the first product', async () => {
    const products = await page.$$('.placeholder-content')
    await products[0].click()
    await page.waitForSelector('button.btn-transaction')
    assert.ok('Buy button showing')
  }).timeout(10000)

  it('adds the product to the cart', async () => {
    await page.click('button.btn-transaction')
    await page.waitForSelector('h1.item-count')
    const quantity = await page.evaluate(() => document.querySelector('h1.item-count').textContent.trim())
    assert.equal(quantity, '1 item in your cart')
  }).timeout(10000)
})

after(async () => {
  await browser.close()
})
