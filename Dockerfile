# Default version if the variable is not set. The version in the .env file takes precedence.
ARG BASEL_VERSION=master
FROM docker.pkg.github.com/covid-modeling/model-runner/basel:${BASEL_VERSION} AS build

# Copy the Basel model data.
RUN mkdir -p /model/input \
  && cp /runner/src/assets/data/scenarios.json /model/input/scenarios.json

WORKDIR /connector

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Tell the run-basel-model wrapper executable where to find the model code.
ENV MODEL_REPO_ROOT /runner
# The run-basel-model wrapper executable is stored here.
ENV MODEL_RUNNER_BIN_DIR /connector/bin
ENV MODEL_RUNNER_LOG_DIR /data/log
ENV MODEL_DATA_DIR /model/input
ENV MODEL_INPUT_DIR /data/input
ENV MODEL_OUTPUT_DIR /data/output

ENTRYPOINT ["/connector/bin/run-model"]

####################################################################
# Do this here so that we don't have to run the tests when bulding a release.
FROM build AS release

####################################################################
FROM build AS test

RUN npm run test
RUN npm run integration-test

####################################################################
# Use release as the default
FROM release
