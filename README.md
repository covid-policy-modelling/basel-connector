# Covid-Sim-Connector

This repository holds connector code for the Basel model from Neher Lab at Biozentrum Basel.
This includes code for executing the model, along with connector code to transform input and output between the model-runner's schema and the format expected by the model.
See [the architecture document](https://github.com/covid-policy-modelling/model-runner/blob/main/docs/architecture.md#connectors) for more information on the connector format.

## Dependencies

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en/)

## Building, developing, and testing

The connector is written in TypeScript. Currently, the build scripts are only compatible with MacOS and Linux. Windows is not supported.

### Building

To install all dependencies and compile the TypeScript:

```sh
npm run build
```

### Testing on the command line

To run the unit and integration tests from the command line for all packages:

```sh
npm run test
npm run integration-test
```

### Testing a connector using Docker

To build the connector using Docker and run its tests:

```sh
docker-compose build run-model
```

### Running a connector using Docker

The simplest way to build and run a connector is to use its Docker image.
To build the model and connector in a Docker image and perform a single model run:

```sh
docker-compose build run-model
docker-compose run run-model
```

The input will be taken from `test-job.json` and output will go to `output/data.json`.

### Upgrading a connector to use a newer version of the model

If the newer version of the model is already published as a Docker image (this can usually be found in GitHub Packages on the model repository or on this repository), then update the model version in the `.env` file and test using Docker as described above.

If the newer version of the model is not yet published as a Docker image, then you may wish to test against a local checkout of the model code, before working with the model team to obtain a published Docker image.
Read the next section for instructions on testing with a local checkout of the model.

### Running a connector using a local checkout of the model

To build and run one of the connectors on the local filesystem, outside Docker:

1. Ensure there is a copy of the model you want to build checked out locally.
1. Bootstrap the connector

      ```sh
      make bootstrap
      ```

      The first time you run, you will be instructed to set an environment variable pointing to your local checkout of the model (different for each connector). After setting it, re-run `make bootstrap` to build the model code.

1. Compile the TypeScript in one of the project directories:

      ```sh
      make build
      ```

      This will populate the `dist` folder with JavaScript files.

1. Run the tests as described earlier.
1. Run the model using the script `bin/run-model`. The model may ask for additional environment variables to be set.

### Publishing a package (maintainers only)

GitHub Actions will build, test, and publish a package whenever changes are committed to this repository.

To build and publish a numbered version of a package, create a Git tag of the form `vmajor.minor.patch`, for example `v1.2.3`, and push it to the repository.

## Questions, comments, and where to find us

- Found a bug? [Raise an issue!](https://github.com/covid-policy-modelling/covid-sim-connector/issues)
- Want to contribue? [Raise a pull request!](https://github.com/covid-policy-modelling/covid-sim-connector/pulls)

## Contributing

We welcome contributions to this project from the community. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT license. See [LICENSE](LICENSE).
