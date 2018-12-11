# Node REST API backed by express + JWT + MongoDB
[![Maintainability](https://api.codeclimate.com/v1/badges/534b7dc52af7d2bee6da/maintainability)](https://codeclimate.com/github/frandieguez/node-rest-api/maintainability) 
[![dependencies Status](https://david-dm.org/frandieguez/node-rest-api/status.svg)](https://david-dm.org/frandieguez/node-rest-api)  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) 

This projects its just an example of creating a node.js api using different technologies

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

In order to get an development environment you need to install nodejs, npm, docker and docker-compose in your system.

```
sudo apt install nodejs npm docker docker-compose
```

### Installing

So after fulfill these requirements you just need to issue the next commands:

```
cp .env.example .env
vim .env # edit your parameters
npm install
docker-compose up -d
npm run start-dev
```

Then you will be able to get information from http://localhost:3000

## Running the tests

```
npm test
```

## Deployment

There is a docker composer to ease the deployment in local machines.

## Built With

- [JWT(https://jwt.io)] - JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.
- [NodeJS(https://nodejs.org/) - Language and VM
- [Express](https://expressjs.com/) - Node.js Express framework

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/frandieguez/6e0fe20139abc0285cd5955784843b21) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/frandieguez/node-restserver-api/tags).

## Authors

- **Fran Dieguez** - _Initial work_ - [frandieguez](https://github.com/frandieguez)

See also the list of [contributors](https://github.com/frandieguez/node-restserver-api/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
