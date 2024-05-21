.PHONY: setup-git-hooks
setup-git-hooks:
	@echo "Setting up git hooks..."
	@cp -f git-hooks/* .git/hooks/
	@chmod +x .git/hooks/*
	@echo "Done."
