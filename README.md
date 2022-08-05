## Company Dashboard Template

A dashboard server template, built with Node.js, MongoDB, and TypeScript.

## Pre-requisites

Install [Node.js](https://nodejs.org/en/).

## Installation

### `yarn install` (or `npm install`)

## Available Scripts

In the project directory, you can run:

### `yarn dev` (or `npm run dev`)

Runs the server in the development mode.\
The server will run on [http://localhost:9090](http://localhost:9090).

The server will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build` (or `npm run build`)

Builds the server for production to the `build` folder.\

### `yarn start` (or `npm run start`)

Runs node on build/server.js.

### `yarn prettier` (or `npm run prettier`)

Launches the Prettier to format code layout. Configure Prettier via .prettierrc file.

## Snippets For Fast Controllers and Routes Replication

### Set Configuration

Ctrl + Shift + P -> Configure User Snippets -> TypeScript -> `typescript.json` file

```json
{
  "CRUD Mongo Controller": {
    "prefix": "crudmongocontroller",
    "body": [
      "import { NextFunction, Request, Response } from 'express';",
      "import mongoose from 'mongoose';",
      "import ${1:ModelName} from '../models/${1:ModelName}';",
      "",
      "const create${1:ModelName} = (req: Request, res: Response, next: NextFunction) => {",
      "  const { ${3:StartName} } = req.body;",
      "",
      "  const ${2:VariableName} = new ${1:ModelName}({",
      "    _id: new mongoose.Types.ObjectId(),",
      "    ${3:StartName},",
      "  });",
      "",
      "  return ${2:VariableName}",
      "    .save()",
      "    .then((${2:VariableName}) => res.status(201).json({ ${2:VariableName} }))",
      "    .catch((error) => res.status(500).json({ error }));",
      "};",
      "",
      "const get${1:ModelName} = (req: Request, res: Response, next: NextFunction) => {",
      "  const ${2:VariableName}Id = req.params.${2:VariableName}Id;",
      "",
      "  return ${1:ModelName}.findById(${2:VariableName}Id)",
      "    .then((${2:VariableName}) => (${2:VariableName} ? res.status(200).json({ ${2:VariableName} }) : res.status(404).json({ message: 'not found' })))",
      "    .catch((error) => res.status(500).json({ error }));",
      "};",
      "",
      "const get${1:ModelName}s = (req: Request, res: Response, next: NextFunction) => {",
      "  return ${1:ModelName}.find()",
      "    .then((${2:VariableName}s) => res.status(200).json({ ${2:VariableName}s }))",
      "    .catch((error) => res.status(500).json({ error }));",
      "};",
      "",
      "const update${1:ModelName} = (req: Request, res: Response, next: NextFunction) => {",
      "  const ${2:VariableName}Id = req.params.${2:VariableName}Id;",
      "",
      "  return ${1:ModelName}.findById(${2:VariableName}Id)",
      "    .then((${2:VariableName}) => {",
      "      if (${2:VariableName}) {",
      "        ${2:VariableName}.set(req.body);",
      "",
      "        return ${2:VariableName}",
      "          .save()",
      "          .then((${2:VariableName}) => res.status(201).json({ ${2:VariableName} }))",
      "          .catch((error) => res.status(500).json({ error }));",
      "      } else {",
      "        return res.status(404).json({ message: 'not found' });",
      "      }",
      "    })",
      "    .catch((error) => res.status(500).json({ error }));",
      "};",
      "",
      "const delete${1:ModelName} = (req: Request, res: Response, next: NextFunction) => {",
      "  const ${2:VariableName}Id = req.params.${2:VariableName}Id;",
      "",
      "  return ${1:ModelName}.findByIdAndDelete(${2:VariableName}Id)",
      "    .then((${2:VariableName}) => (${2:VariableName} ? res.status(201).json({ ${2:VariableName}, message: '${2:VariableName} deleted' }) : res.status(404).json({ message: 'not found' })))",
      "    .catch((error) => res.status(500).json({ error }));",
      "};",
      "",
      "export default { create${1:ModelName}, get${1:ModelName}, get${1:ModelName}s, update${1:ModelName}, delete${1:ModelName} };",
      ""
    ]
  },
  "CRUD Mongo Route": {
    "prefix": "crudmongoroute",
    "body": [
      "import express from 'express';",
      "import controller from '../controllers/${1:ModelName}';",
      "",
      "const router = express.Router();",
      "",
      "router.post('/create', controller.create${1:ModelName});",
      "router.get('/get/:${2:VariableName}Id', controller.get${1:ModelName});",
      "router.get('/get', controller.get${1:ModelName}s);",
      "router.patch('/update/:${2:VariableName}Id', controller.update${1:ModelName});",
      "router.delete('/delete/:${2:VariableName}Id', controller.delete${1:ModelName});",
      "",
      "export = router;",
      ""
    ]
  }
}
```

### Complete a new model file in models

ex: Todo.ts

### Create an empty file in the controllers, routes folder

ex: Todo.ts

### Use Snippets in the empty controller and route file

type `crudmongocontroller` Enter ModelName, VariableName, StartName. (Click tab to enter next one.)

type `ccrudmongoroute` Enter ModelName, VariableName. (Click tab to enter next one.)
