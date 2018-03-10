## Picking APP Web

A web application using React.

## Authors

Jonathan Corral - Thomas Garayt

## Requirements

- npm > 5

## Compilation

To compile the application (JS + CSS), we use **WebPack** ( https://webpack.js.org/ ) and **Babel** ( https://babeljs.io/ ).
This allow us to write JS in ES6 without thinking about browser compatibility.

To help type checking, we also use **Flow** ( https://flow.org ).
It's a tool that allow us to strongly type our code.
This prevents various potential bugs and helps keeping a clean code.

## Architecture

This application is based on **ReactJS** ( https://facebook.github.io/react/ ).
To manage data, we use the basic **FLUX** design pattern ( https://github.com/facebook/flux/tree/master/examples/flux-concepts ).

Based on that, the application can be separate this way :

- /src/actions : Contains all the FLUX actions.
 - For readability, we allow to regroup actions by theme. It MUST BE only one subfolder (ex: user, company).
- /src/constants : Contains the constants used to name the action types.
 - Action types should not be set directly as string, but always match a constant.
 - Also, action types MUST BE unique.
- /src/stores : Contains all the FLUX stores. It's here where the data are stored to be used by the views.
 - For readability, we allow to regroup actions by theme in ONLY ONE subfolder (ex: user, company).
- /src/services : Contains all the services. It can be some Utils. But the most important are the services that helps making all the requests to the API.
 - For readability, we allow to regroup actions by theme in ONLY ONE subfolder (ex: user, company).
- /src/dispatchers : Contains the application FLUX dispatcher. We only have one dispatcher for all the application.
- /src/components  : Contains the "dummy" components of the application.
 - These components SHOULD NOT use actions or stores.
 - All there data and events SHOULD BE passed as props.
- /src/pages : Contains the views of the application. These are "smart" components.
 - They CAN use stores and actions.
- /src/flow_types: Contains the type declarations used by Flow for our entities.

## Style

To create styles, we use **SASS** ( http://sass-lang.com/guide ).
All the stylesheet are in /style directory.
There is only one entry file that is /style/style.scss.
All other stylesheets MUST BE imported in this entry file.

### Components
For the design part of the application, we use **Ant Design** ( https://ant.design/docs/react/introduce ).
It's a very complete set of React components and Style.

We use a powerfull component to create grids, **React Grid Layout** ( https://github.com/STRML/react-grid-layout ).

### Utils
To make Ajax requests to the API, we use **Reqwest** ( https://github.com/ded/reqwest ).

To create JS promises ( https://www.promisejs.org/ ), we use **Promise** ( https://github.com/then/promise ) and **When** ( https://github.com/cujojs/when ).