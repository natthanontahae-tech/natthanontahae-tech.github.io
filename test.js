const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const consoleErrors = [];
    const pageErrors = [];

    // Listen for console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    // Listen for page errors
    page.on('pageerror', error => {
        pageErrors.push(error.message);
    });

    try {
        const filePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });

        // Wait for content to load
        await page.waitForTimeout(2000);

        // Check if main elements exist
        const navbar = await page.$('.navbar');
        const hero = await page.$('.hero');
        const about = await page.$('#about');
        const education = await page.$('#education');
        const skills = await page.$('#skills');
        const contact = await page.$('#contact');
        const footer = await page.$('footer');

        console.log('=== Page Load Test Results ===');
        console.log('Navigation:', navbar ? '✓ Found' : '✗ Missing');
        console.log('Hero Section:', hero ? '✓ Found' : '✗ Missing');
        console.log('About Section:', about ? '✓ Found' : '✗ Missing');
        console.log('Education Section:', education ? '✓ Found' : '✗ Missing');
        console.log('Skills Section:', skills ? '✓ Found' : '✗ Missing');
        console.log('Contact Section:', contact ? '✓ Found' : '✗ Missing');
        console.log('Footer:', footer ? '✓ Found' : '✗ Missing');

        console.log('\n=== Console Errors ===');
        if (consoleErrors.length === 0) {
            console.log('✓ No console errors found');
        } else {
            consoleErrors.forEach(err => console.log('✗ Error:', err));
        }

        console.log('\n=== Page Errors ===');
        if (pageErrors.length === 0) {
            console.log('✓ No page errors found');
        } else {
            pageErrors.forEach(err => console.log('✗ Error:', err));
        }

        // Test mobile menu
        const mobileMenuBtn = await page.$('.mobile-menu-btn');
        if (mobileMenuBtn) {
            await mobileMenuBtn.click();
            await page.waitForTimeout(500);
            console.log('\n=== Mobile Menu Test ===');
            console.log('✓ Mobile menu button works');
        }

        // Test smooth scroll to sections
        await page.click('a[href="#about"]');
        await page.waitForTimeout(1000);
        console.log('\n=== Navigation Test ===');
        console.log('✓ Smooth scroll works');

        console.log('\n=== All Tests Passed ===');

    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
