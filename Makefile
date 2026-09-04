MAKEFLAGS += --no-print-directory
.SHELLFLAGS := -eu -o pipefail -c

.PHONY: help lint lint-fix format format-check typecheck security-audit \
        test test-ci test-e2e test-a11y i18n-check storybook-build \
        check pre-push ci fix pre-commit

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

lint: ## ESLint (whole project)
	pnpm lint

lint-fix: ## ESLint with auto-fix
	pnpm lint:fix

format: ## Prettier write (whole project)
	pnpm exec prettier --write .

format-check: ## Prettier check (no writes) — fails if unformatted
	pnpm exec prettier --check .

fix: lint-fix format ## Auto-fix lint + format

typecheck: ## TypeScript --noEmit
	pnpm typecheck

i18n-check: ## Verify en/ar message key parity
	pnpm i18n:check

security-audit: ## Dependency vulnerability scan (blocks on high/critical)
	pnpm audit --audit-level=high

test: ## Vitest watch mode
	pnpm test

test-ci: ## Vitest single run (CI/pre-push)
	pnpm test:ci

test-a11y: ## Playwright axe accessibility scans
	pnpm test:a11y

test-e2e: ## Playwright functional E2E
	pnpm test:e2e

storybook-build: ## Build Storybook (validates stories + a11y addon)
	pnpm build-storybook

pre-commit: ## What .husky/pre-commit runs (staged files only)
	pnpm lint-staged

check: lint format-check typecheck security-audit i18n-check test-ci storybook-build test-a11y ## Core gate (no E2E)
	@echo "✓ make check passed"

pre-push: check test-e2e ## .husky/pre-push — MUST pass or push is blocked
	@echo "✓ make pre-push passed — push allowed"

ci: pre-push ## GitHub Actions — identical to pre-push gate
	@echo "✓ make ci passed"
