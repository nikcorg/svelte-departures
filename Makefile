BUILD_HASH ?= $(shell git rev-parse --short HEAD)
UPDATE_URL ?= $(UPDATE_URL)

REMOTE ?= zero
REMOTE_DIR ?= /var/www/html/

.PHONY: build
build: export BUILD_HASH := $(BUILD_HASH)
build: export UPDATE_URL := $(UPDATE_URL)
build:
	npm run build

.PHONY: deploy
deploy: build
	rsync -r public/* $(REMOTE):$(REMOTE_DIR) && \
	ssh $(REMOTE) scripts/refresh
