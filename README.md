# CBC Media API

## Install Node and NPM
You can do this using Node's own installers: https://nodejs.org/en/download/, or a package manager like homebrew:

    $ brew install node

Installing node should also install npm. To verify that it installed, check the version number

    $ npm -v

## Download the Code

Download the code from https://github.com/countrysidebible/cbc-media-api, to wherever you want this app to live.

## Run the API

First, you must install the dependancies using npm. To do so, you must navigate to the same working directory as the api's `package.json` file:

    $ cd cbc-media-api/api

Once there, install the dependancies:

    $ npm install

Next, you must modify the `mongodb` object in the `api/src/config.ts` file so that it matches your mongodb server credentials. Finally, you can run any of the scripts specified in the `package.json` using the command `npm run <script-name>`. If you want it to automatically recompile and restart on code changes, use:

    $ npm run dev

The script should finish with a message saying `listening on port 3000` (If it doesn't, then you probably got an error connecting to your mongodb server). If you then navigate to http://localhost:3000/api in the browser, you should see documentation for the API.

Note that http://localhost:3000 won't load anything until you build the UI

## Build the UI

Like the API, the UI also has dependancies that must be installed. To do so, you must navigate to the same working directory as the UI's `package.json` file:

    $ cd cbc-media-api/ui

Once there, install the dependancies:

    $ npm install

Finally, you can run any of the scripts specified in the `package.json` using the command `npm run <script-name>`. If you want it to automatically recompile on code changes, use:

    $ npm run dev

If done correctly, there should be files generated in the `www` directory of the repository.

## How it all comes together

The API is set to serve static files at the location `www` (this can be configured in the `api/src/config.ts` file). The UI currently outputs to the `www` directory (because `ui/angular.json` has an `"outputPath"` property of `"../www"`). Since one of the output files is named specifically `index.html`, the api will return it whenever a `GET` request is made to the API root, such as http://localhost:3000.

Another useful connection is that the UI can reference the same typescript models that the API uses. They are currently located in `api/src/models`. Importing the models into the UI components can be a bit messy, since the paths will look like `"../../../api/src/models/my-model"`. To remedy this, the `ui/tsconfig.json` file specifies a `"paths"` property for this directory, so the UI can instead have an import path of `"@models/my-model"`. 

## The openAPI specification

We use the openAPI specification version 3.0.0 to document our API. The rules of this specification are [very overwhelming](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md), so I recommend learning by example, such as this [petstore API](https://app.swaggerhub.com/apis/JoshPearson/petstore/1.0.0). The biggest advantage of the openAPI is that there are tools to automatically generate an HTML page for viewing the documentation, which is what we have at http://localhost:3000/api.