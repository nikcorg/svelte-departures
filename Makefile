BUILD_HASH ?= $(shell git rev-parse --short HEAD)
UPDATE_URL ?= $(UPDATE_URL)

.PHONY: build
build: export BUILD_HASH := $(BUILD_HASH)
build: export UPDATE_URL := $(UPDATE_URL)
build:
	npm run build

.PHONY: deploy
deploy: build
	rsync -r public/* zero:/var/www/html/ && \
	ssh zero scripts/refresh
