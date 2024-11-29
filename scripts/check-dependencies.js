import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

async function checkDependency(command, name) {
  try {
    const { stdout } = await execAsync(command);
    const version = stdout.toString().trim();
    console.log(`✅ ${name} is installed (${version})`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} is not installed`);
    return false;
  }
}

function checkNodeVersion() {
  const requiredVersion = 18;
  const currentVersion = process.version.match(/^v(\d+)/)[1];
  
  if (parseInt(currentVersion) >= requiredVersion) {
    console.log(`✅ Node.js version is compatible (${process.version})`);
    return true;
  } else {
    console.log(`❌ Node.js version ${process.version} is below required version ${requiredVersion}`);
    return false;
  }
}

console.log('\nChecking dependencies...\n');

try {
  const results = {
    node: checkNodeVersion(),
    npm: await checkDependency('npm --version', 'npm'),
  };

  console.log('\nSummary:');
  console.log('--------');
  const allInstalled = Object.values(results).every(Boolean);

  if (allInstalled) {
    console.log('✅ All required dependencies are installed!\n');
    console.log('You can proceed with running the application.');
  } else {
    console.log('❌ Some dependencies are missing.\n');
    console.log('Please install the missing dependencies before proceeding.');
  }
} catch (error) {
  console.error('Error checking dependencies:', error);
  process.exit(1);
}