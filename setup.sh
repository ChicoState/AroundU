#!/bin/bash

set -e

# Default flags
CHECK=false
SHARED=false
SERVER=false
WEB=false
ALL=false
VOLUME_CLEANUP=false
ENVIRONMENT="dev"  # Default to development environment

# Display usage information
usage() {
  echo "Usage: $0 [--check] [--shared] [--server] [--web] [--all] [-v] [--prod|--dev]"
  echo "  --check                   Run npm run check only (in all or specified directories)"
  echo "  --shared                  Run check, then install, build, and test in the /shared directory"
  echo "  --server                  Run check, then install, build, and test in the /server directory"
  echo "  --web                     Run check, then install, build, and test in the /web directory"
  echo "  --all                     Run check, install, build, and test in all directories (default if no other flags are provided)"
  echo "  -v                        Run docker compose down -v before starting containers"
  echo "  --prod                    Use docker-compose.prod.yml"
  echo "  --dev                     Use docker-compose.dev.yml (default)"
  exit 1
}

# If no arguments are provided, set ALL to true by default
if [ "$#" -eq 0 ]; then
  ALL=true
fi

# Parse each argument
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --check) CHECK=true ;;
    --shared) SHARED=true ;;
    --server) SERVER=true ;;
    --web) WEB=true ;;
    --all) ALL=true ;;
    -v) VOLUME_CLEANUP=true ;;
    --prod) ENVIRONMENT="prod" ;; 
    --dev) ENVIRONMENT="dev" ;; 
    *) usage ;;
  esac
  shift
done

# Set ALL to true if no specific directory flags are provided
if [ "$SHARED" = false ] && [ "$SERVER" = false ] && [ "$WEB" = false ]; then
  ALL=true
fi

# Install root dependencies
echo "======================================"
echo "🚀 Installing root dependencies"
echo "======================================"
npm install

# Function to run npm check, install, build, and test in a given directory
run_setup() {
  local dir=$1
  echo "--------------------------------------"
  echo "🔧 Setting up $dir"
  echo "--------------------------------------"
  
  cd "$dir"
  
  if [ "$CHECK" = true ]; then
    echo "▶️  Running check in $dir"
    npm run check
  else
    echo "▶️  Full setup (check, install, build, test) in $dir"
    npm run check
    npm install
    npm run build
    npm run test
  fi

  cd ..
}

# Run setup or check for each specified directory or all if ALL is true
if [ "$ALL" = true ]; then
  echo "======================================"
  echo "🚀 Running setup in all directories"
  echo "======================================"
  run_setup "shared"
  run_setup "server"
  run_setup "web"
else
  echo "======================================"
  echo "🚀 Running setup for specified directories"
  echo "======================================"
  if [ "$SHARED" = true ]; then
    run_setup "shared"
  fi
  if [ "$SERVER" = true ]; then
    run_setup "server"
  fi
  if [ "$WEB" = true ]; then
    run_setup "web"
  fi
fi

# Only build and start Docker containers if not in check-only mode
if [ "$CHECK" != true ]; then
  COMPOSE_FILE="docker-compose.$ENVIRONMENT.yml"
  echo "======================================"
  echo "🐳 Using Docker Compose file: $COMPOSE_FILE"
  echo "======================================"

  if [ "$VOLUME_CLEANUP" = true ]; then
    echo "🧹 Cleaning up Docker containers and volumes"
    docker compose -f "$COMPOSE_FILE" down -v
  fi

  echo "🚀 Starting Docker containers"
  docker compose -f "$COMPOSE_FILE" up -d --build
fi

echo "======================================"
echo "✅ Setup complete!"
echo "======================================"
