BUILD_HASH ?= $(shell git rev-parse --short HEAD)

.PHONY: build
build: export BUILD_HASH := $(BUILD_HASH)
build:
	npm run build

.PHONY: deploy
deploy: build
	rsync -r public/* zero:/var/www/html/ && \
	ssh zero scripts/refresh
