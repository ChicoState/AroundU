const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
const ENVIRONMENT = args.includes('--prod') ? 'prod' : 'dev';
const VOLUME_CLEANUP = args.includes('-v');
const CHECK = args.includes('--check');
const ALL = args.includes('--all') || args.length === 0;
const directories =
  ALL ||
  (!args.includes('--shared') &&
    !args.includes('--server') &&
    !args.includes('--web'))
    ? ['shared', 'server', 'web']
    : ['shared', 'server', 'web'].filter((dir) => args.includes(`--${dir}`));

// Detect if running in WSL
const isWSL = () => os.release().toLowerCase().includes('microsoft');

// Adjust Docker Compose command for WSL
const composeCommand =
  isWSL() || process.platform !== 'win32' ? 'docker compose' : 'docker-compose';

// Install root dependencies
console.log('======================================');
console.log('🚀 Installing root dependencies');
console.log('======================================');
execSync('npm install', { stdio: 'inherit' });

// Function to run setup or check for a directory
const runSetup = (dir) => {
  console.log('--------------------------------------');
  console.log(`🔧 Setting up ${dir}`);
  console.log('--------------------------------------');

  // Get the absolute path to the directory
  const dirPath = path.resolve(__dirname, dir);

  try {
    // Move to the directory and run commands
    process.chdir(dirPath);

    if (CHECK) {
      console.log(`▶️  Running check in ${dir}`);
      execSync('npm run check', { stdio: 'inherit' });
    } else {
      console.log(`▶️  Full setup (check, install, build, test) in ${dir}`);
      execSync('npm run check', { stdio: 'inherit' });
      execSync('npm install', { stdio: 'inherit' });
      execSync('npm run build', { stdio: 'inherit' });
      execSync('npm run test', { stdio: 'inherit' });
    }
  } catch (error) {
    console.error(`❌ Error in ${dir}: ${error.message}`);
    process.exit(1);
  } finally {
    // Return to the root directory after setup
    process.chdir(__dirname);
  }
};

// Run setup or check for each specified directory
directories.forEach(runSetup);

if (!CHECK) {
  const composeFile = `docker-compose.${ENVIRONMENT}.yml`;
  console.log('======================================');
  console.log(`🐳 Using Docker Compose file: ${composeFile}`);
  console.log('======================================');

  if (VOLUME_CLEANUP) {
    console.log('🧹 Cleaning up Docker containers and volumes');
    execSync(`${composeCommand} -f ${composeFile} down -v`, {
      stdio: 'inherit',
    });
  }

  console.log('🚀 Starting Docker containers');
  execSync(`${composeCommand} -f ${composeFile} up -d --build`, {
    stdio: 'inherit',
  });
}

console.log('======================================');
console.log('✅ Setup complete!');
console.log('======================================');
