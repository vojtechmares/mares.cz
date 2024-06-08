.PHONY: setup-git-hooks
setup-git-hooks:
	@echo "Setting up git hooks..."
	@mkdir -p .git/hooks
	@cp .git-hooks/* .git/hooks/
	@chmod +x .git/hooks/*
	@echo "Done."
