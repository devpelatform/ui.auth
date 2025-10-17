import { config } from '@repo/config';
import { sendEmail } from './src/send';

const TEST_CONFIG = {
  // Change this to your test email address
  testEmail: 'laviccena@gmail.com',

  // Test data for different templates
  testData: {
    newsletterSignup: {
      name: 'John Doe',
    },
    welcome: {
      url: 'https://app.pelatform.com/dashboard',
      name: 'Jane Smith',
    },
  },
};

async function testNewsletterEmail() {
  console.log('🧪 Testing Newsletter Email...');

  try {
    const result = await sendEmail({
      to: TEST_CONFIG.testEmail,
      locale: 'en',
      templateId: 'newsletterSignup',
      context: TEST_CONFIG.testData.newsletterSignup,
    });

    if (result) {
      console.log('✅ Newsletter email sent successfully!');
    } else {
      console.log('❌ Failed to send newsletter email');
    }
  } catch (error) {
    console.error('❌ Error sending newsletter email:', error);
  }
}

async function testWelcomeEmail() {
  console.log('🧪 Testing Welcome Email...');

  try {
    const result = await sendEmail({
      to: TEST_CONFIG.testEmail,
      locale: 'en',
      templateId: 'welcome',
      context: TEST_CONFIG.testData.welcome,
    });

    if (result) {
      console.log('✅ Welcome email sent successfully!');
    } else {
      console.log('❌ Failed to send welcome email');
    }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
}

/**
 * Test sending custom email (without template)
 */
async function testCustomEmail() {
  console.log('🧪 Testing Custom Email...');

  try {
    const result = await sendEmail({
      to: TEST_CONFIG.testEmail,
      locale: 'en',
      subject: 'Test Custom Email',
      text: 'This is a test custom email sent from Pelatform mail package.',
      html: '<h1>Test Custom Email</h1><p>This is a test custom email sent from <strong>Pelatform</strong> mail package.</p>',
    });

    if (result) {
      console.log('✅ Custom email sent successfully!');
    } else {
      console.log('❌ Failed to send custom email');
    }
  } catch (error) {
    console.error('❌ Error sending custom email:', error);
  }
}

/**
 * Test sending email with Indonesian locale
 */
async function testIndonesianEmail() {
  console.log('🧪 Testing Indonesian Email...');

  try {
    const result = await sendEmail({
      to: TEST_CONFIG.testEmail,
      locale: 'id',
      templateId: 'newsletterSignup',
      context: {
        name: 'Budi Santoso',
      },
    });

    if (result) {
      console.log('✅ Indonesian email sent successfully!');
    } else {
      console.log('❌ Failed to send Indonesian email');
    }
  } catch (error) {
    console.error('❌ Error sending Indonesian email:', error);
  }
}

/**
 * Check environment variables
 */
function checkEnvironment() {
  const requiredEnvVars = [
    'PELATFORM_EMAIL_RESEND_API_KEY',
    'PELATFORM_EMAIL_FROM_NAME',
    'PELATFORM_EMAIL_FROM_EMAIL',
    'PELATFORM_EMAIL_REPLY_TO',
  ];

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease set these variables in your .env file');
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting Email Tests...\n');

  // Check environment
  checkEnvironment();

  console.log(`📧 Test email will be sent to: ${TEST_CONFIG.testEmail}`);
  console.log(`🌍 Default locale: ${config.i18n.defaultLocale}`);
  console.log(`📤 Email provider: ${config.email.provider}\n`);

  // Run individual tests
  await testNewsletterEmail();
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second between emails

  await testWelcomeEmail();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await testCustomEmail();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await testIndonesianEmail();

  console.log('\n🎉 All tests completed!');
}

runTests().catch(console.error);
