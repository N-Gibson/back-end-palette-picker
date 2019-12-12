# back-end-palette-picker

## About

Palette Picker is an app that generates random colors in sets of 5 to allow the user to customize their own palette. Along with this, the user can save projects containing multiple folders, all saved to a custom API so their work will persist.

## Endpoints

#### List all projects

```
GET /api/v1/projects
```


##### Parameters

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `id` | `number` | Unique id of folder |

##### Response

Returns an array containing all folders in database.

` Status: 200 OK `

```json
[
    {
        "id": 3,
        "name": "Test Folder 2",
        "created_at": "2019-10-09T01:35:09.554Z",
        "updated_at": "2019-10-09T01:35:09.554Z"
    },
    {
        "id": 4,
        "name": "Blah",
        "created_at": "2019-12-11T19:09:12.843Z",
        "updated_at": "2019-12-11T19:09:12.843Z"
    }
]

```





---
#### Find specific project by id

```
GET /api/v1/project/:id
```

##### Parameters

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `id` | `number` | Unique id of folder |

##### Response

Returns an array containing folder matching the `id` parameter

```json
[
    {
        "id": 3,
        "name": "Test Folder 2",
        "created_at": "2019-12-11T01:35:09.554Z",
        "updated_at": "2019-12-11T01:35:09.554Z"
    }
]

```

##### Error

`Status: 404 Not Found`

```json
{
    "error": "Could not find folder with id 9"
}
```



----
#### Add new project

```
POST /api/v1/projects
```


##### Input (Request Body)

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `name` | `string` | User-created name of folder |

##### Response

Returns an object with the id of the newly-created folder

`Status: 201 Created`

```json
{
    "id": 5
}
```

##### Error

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot POST /api/v1/folders/3</pre>
</body>
</html>
```


----
#### Edit existing project

```
PATCH /api/v1/project/:id
```

##### Input (Request Body)

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `name` | `string` | **Required** User-created name of folder |

##### Response

Returns object with id of edited project.

`Status: 202 Accepted`

```
{
    "id": 5
}
```

##### Error 

`Status: 422 Unprocessable Entry`

```json
{"error":"Expected format { name: <String>. You are missing a name property}"}
```

---
#### Delete folder

```
DELETE /api/v1/project/:id
```

##### Response

`Status: 200 OK`

```
"Project with the id of 6 has been deleted."
```

##### Error

`Status: 404 Not Found`

```json
{"error":"Could not find folder with the id of 399"}
```



---
#### List all palettes

```
GET /api/v1/palettes
```

##### Parameters

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `id` | `number` | Unique id of palette |
| `color1` | `string` | String containing hex code of color |
| `color2` | `string` | String containing hex code of color |
| `color3` | `string` | String containing hex code of color |
| `color4` | `string` | String containing hex code of color |
| `color5` | `string` | String containing hex code of color |
| `name` | `string` | User-created name of palette |
| `folder_id` | `number` | id of associated folder containing palette |


##### Response

Returns array of all palettes in the database

`Status: 200 OK`

```json

[
    {
        "id": 3,
        "color1": "#FF5733",
        "color2": "#0D1E6D",
        "color3": "#176D0D",
        "color4": "#C2E436",
        "color5": "#570E43",
        "name": "Test Palette 3",
        "folder_id": 3,
        "created_at": "2019-10-09T01:35:09.560Z",
        "updated_at": "2019-10-09T01:35:09.560Z"
    },
    {
        "id": 4,
        "color1": "#20570E",
        "color2": "#1316C4",
        "color3": "#ABADFF",
        "color4": "#00F997",
        "color5": "#900C3F",
        "name": "Test Palette 4",
        "folder_id": 3,
        "created_at": "2019-10-09T01:35:09.560Z",
        "updated_at": "2019-10-09T01:35:09.560Z"
    }
]
```


----
#### Find specific palette by id

```
GET /api/v1/palettes/:id
```

##### Parameters

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `id` | `number` | Unique id of palette |
| `color1` | `string` | String containing hex code of color |
| `color2` | `string` | String containing hex code of color |
| `color3` | `string` | String containing hex code of color |
| `color4` | `string` | String containing hex code of color |
| `color5` | `string` | String containing hex code of color |
| `name` | `string` | User-created name of palette |
| `folder_id` | `number` | id of associated folder containing palette |

##### Response

Returns array containing palette that matches id in request

`Status: 200 OK`

```json

[
    {
        "id": 3,
        "color1": "#FF5733",
        "color2": "#0D1E6D",
        "color3": "#176D0D",
        "color4": "#C2E436",
        "color5": "#570E43",
        "name": "Test Palette 3",
        "folder_id": 3,
        "created_at": "2019-10-09T01:35:09.560Z",
        "updated_at": "2019-10-09T01:35:09.560Z"
    }
]
```
##### Error
`Status: 404 Not Found`

```json
{
    "error": "Could not find palette with id 300"
}
```

----
#### Add new palette

```
POST /api/v1/palettes
```

##### Input

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `color1` | `string` | **Required** String containing hex code of color |
| `color2` | `string` | **Required** String containing hex code of color |
| `color3` | `string` | **Required** String containing hex code of color |
| `color4` | `string` | **Required** String containing hex code of color |
| `color5` | `string` | **Required** String containing hex code of color |
| `name` | `string` | **Required** User-created name of palette |
| `folder_id` | `number` | **Required** id of associated folder containing palette |

##### Response

Returns id of newly-created palette 

`Status: 201 Created`

```json
{
    "id": 7
}
```
##### Error

`Status: 422 Unprocessable Entry`

```json
{
    "error": "Expected format: { folder_id: <String>, color1: <Number>, color2: <Number>, color3: <Number>, color4: <Number>, color5: <Number>, name: <String> }. Youre missing a \"folder_id\" property."
}
```

---

#### Edit existing palette

```
PATCH /api/v1/palettes/:id
```

##### Input

| Name | Type | Description | 
| ---  | ---- | ----------- |
| `color1` | `string` | **Required** String containing hex code of color |
| `color2` | `string` | **Required** String containing hex code of color |
| `color3` | `string` | **Required** String containing hex code of color |
| `color4` | `string` | **Required** String containing hex code of color |
| `color5` | `string` | **Required** String containing hex code of color |
| `name` | `string` | **Required** User-created name of palette |
| `folder_id` | `number` | **Required** id of associated folder containing palette |

##### Response

Returns object containing id of successfully-updated palette

`Status: 202 Accepted`

```json
{
    "id": "7"
}
```

##### Error

`Status: 422 Unprocessable Entry`

```json
{
    "error": "Expected format: { folder_id: <String>, color1: <Number>, color2: <Number>, color3: <Number>, color4: <Number>, color5: <Number>, name: <String> }. You're missing a \"folder_id\" property."
}
```



---

#### Delete palette

```
DELETE /api/v1/palettes/:id
```

##### Response

`Status: 200 OK `

```
"Palette with the id of 7 has been deleted"
```

##### Error

`Status: 402 Not Found`

```json
"Could not find palette with the id of 3999"
```
