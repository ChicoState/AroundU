#!/bin/bash

set -e

# Default flags
TARGET="all"  # Options: all, shared, server, web
VOLUME_CLEANUP=false
ENVIRONMENT="dev"  # Default environment
COMPOSE_DOWN=false  # Flag for bringing down containers
CHECK=false  # Flag for check only mode

# Usage information
usage() {
  echo "Usage: $0 [--shared|--server|--web|--all] [-v] [--prod|--dev] [--down] [--check]"
  echo "  --shared    Target shared directory"
  echo "  --server    Target server directory"
  echo "  --web       Target web directory"
  echo "  --all       Target all directories (default)"
  echo "  -v          Clean Docker volumes before starting"
  echo "  --prod      Use production environment"
  echo "  --dev       Use development environment (default)"
  echo "  --down      Bring down Docker containers with volumes and exit"
  echo "  --check     Run checks only and skip build/tests"
  exit 1
}

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --shared) TARGET="shared" ;;
    --server) TARGET="server" ;;
    --web) TARGET="web" ;;
    --all) TARGET="all" ;;
    -v) VOLUME_CLEANUP=true ;;
    --prod) ENVIRONMENT="prod" ;;
    --dev) ENVIRONMENT="dev" ;;
    --down) COMPOSE_DOWN=true ;;
    --check) CHECK=true ;;
    *) usage ;;
  esac
  shift
done

# Function to handle Docker Compose down
compose_down() {
  COMPOSE_FILE="docker-compose.$ENVIRONMENT.yml"
  echo "🐳 Bringing down Docker containers using $COMPOSE_FILE"
  docker compose -f "$COMPOSE_FILE" down -v
  echo "✅ Containers and volumes cleaned up"
  exit 0
}

# Handle --down flag
if [ "$COMPOSE_DOWN" = true ]; then
  compose_down
fi

# Install root dependencies
if [ "$CHECK" = false ]; then
  echo "🚀 Installing root dependencies"
  npm install
fi

# Function to handle directory setup
run_setup() {
  local dir=$1
  echo "🔧 Setting up $dir"
  cd "$dir"

  if [ "$CHECK" = true ]; then
    echo "▶️ Running check in $dir"
    npm run check
  else
    echo "▶️ Installing dependencies in $dir"
    npm install
    echo "▶️ Running check in $dir"
    npm run check
    echo "▶️ Building in $dir"
    npm run build
  fi

  cd ..
}

# Handle directory processing
case $TARGET in
  "all")
    for dir in shared server web; do
      run_setup "$dir"
    done
    ;;
  *)
    run_setup "$TARGET"
    ;;
esac

# Skip Docker setup if in check-only mode
if [ "$CHECK" = true ]; then
  echo "✅ Check complete!"
  exit 0
fi

# Docker setup
COMPOSE_FILE="docker-compose.$ENVIRONMENT.yml"
echo "🐳 Using Docker Compose file: $COMPOSE_FILE"

if [ "$VOLUME_CLEANUP" = true ]; then
  echo "🧹 Cleaning up Docker containers and volumes"
  docker compose -f "$COMPOSE_FILE" down -v
fi

echo "🚀 Starting Docker containers"
docker compose -f "$COMPOSE_FILE" up -d --build

echo "🛠️ Running tests after container deployment"
for dir in shared server web; do
  echo "▶️ Running tests in $dir"
  cd "$dir"
  npm run test
  cd ..
done

echo "✅ Setup complete!"
