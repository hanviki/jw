# project variables
PROJECT_NAME=performance-appraisal-ui
PROJECT_VERSION=latest
DOCKER_REGISTRY=registry.medway.cloud
DOCKER_NAMESPACE=performance-appraisal
DOCKER_IMAGE=$(DOCKER_REGISTRY)/$(DOCKER_NAMESPACE)/$(PROJECT_NAME)
DOCKER_TAG=$(PROJECT_VERSION)

.PHONY: all
all: docker

.PHONY: test
test:
	@echo "not testing ..."

.PHONY: clean
clean:
	rm -rf ./dist/*

.PHONY: build
build::clean
	npm run build

.PHONY: docker
docker::build
	docker build -t $(DOCKER_IMAGE):latest .

.PHONY: push
push::docker
	docker push $(DOCKER_IMAGE):latest

.PHONY: rmi
rmi:
	docker push $(DOCKER_IMAGE):latest
