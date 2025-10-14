// Test DNS resolution for MongoDB
const dns = require('dns').promises;

async function testDNS() {
  console.log('Testing DNS resolution for MongoDB Atlas...\n');
  
  const hostname = '_mongodb._tcp.cluster0.xt8vpu7.mongodb.net';
  
  try {
    console.log(`Attempting to resolve: ${hostname}`);
    const addresses = await dns.resolveSrv(hostname);
    console.log('✅ DNS Resolution Successful!');
    console.log('Found servers:', addresses);
  } catch (error) {
    console.log('❌ DNS Resolution Failed!');
    console.log('Error:', error.message);
    console.log('\n🔧 This confirms DNS is the issue. Try these fixes:');
    console.log('1. Change DNS server to Google DNS (8.8.8.8)');
    console.log('2. Use standard MongoDB connection string (not SRV)');
    console.log('3. Flush DNS cache: ipconfig /flushdns');
    console.log('4. Check if your ISP/firewall is blocking MongoDB');
  }
}

testDNS();
