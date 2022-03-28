.PHONY: build
build:
	npm run build

.PHONY: deploy
deploy: build
	rsync -r public/* zero:/var/www/html/
