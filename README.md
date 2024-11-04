# AroundU

## Overview

AroundU is an app that allows users to browse upcoming and ongoing local events. It shows the time, date, and distance of events relative to the user. The app is designed to help users find activities and connect with others in their community.

## Installation

### 1. Pull the Latest Code

```bash
git pull upstream main
```

### 2. Run Setup Script

Use the `./setup.sh` script to install dependencies, build, and start the Docker containers. For development, simply run:

```bash
./setup.sh
```

This will start the app in development mode, which includes **Hot Module Replacement (HMR)** for both the **web server** and **backend server**. HMR allows the servers to automatically reload when you make changes to your code, saving time by eliminating the need for full container restarts during development.

If you’d prefer to minimize memory usage and don’t need HMR, use the production configuration:

```bash
./setup.sh --prod
```

The `--prod` flag disables HMR, which can help optimize resource usage.

## Development

### Accessing Containers

To access the running containers for debugging or inspection:

```bash
docker exec -it <container_name> sh
```

### Accessing MongoDB

To access the running MongoDB instance for debugging or inspection:

```bash
docker exec -it aroundu-mongo mongosh

use aroundu_db
db.events.find()
```

## Troubleshooting

### Stop and Rebuild Containers After Dependency Changes

If you make changes to dependencies (like `node_modules`) or configuration files that are not mapped to the containers as volumes—such as `tailwind.config.ts`, `tsconfig.json`, or package files—you’ll need to fully stop and rebuild the containers to apply these updates. This can be done with the following command:

```bash
./setup.sh -v
```

The `-v` flag stops all containers, removes volumes, and then rebuilds and restarts everything to ensure that dependency and configuration changes are properly applied.

### Make `setup.sh` Executable

If you encounter a "permission denied" error when running `./setup.sh`, make the script executable with:

```bash
chmod +x setup.sh
```

Then, try running the script again.

## Commit Message Guidelines

We're using **commitlint** with **husky** to enforce **Conventional Commits** format.

Commit messages should follow this structure:

```
<type>(optional scope): <description>
```

Examples:

```bash
git commit -m "feat(auth): add login functionality"
git commit -m "fix(ui): correct button alignment"
```

Allowed types: `build`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `style`, `test`, `chore`, `revert`, `translation`, `security`, `changeset`.
