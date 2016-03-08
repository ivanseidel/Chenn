test:
	@NODE_ENV=test NODE_PATH=./app/controllers ./node_modules/.bin/mocha \
    --reporter spec \
    --ui bdd

.PHONY: test