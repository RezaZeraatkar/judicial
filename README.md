# Judicial Staff Management Application

## Overview
The Judicial Staff Management Application is a comprehensive software solution developed by Reza Zeraatkar and it's now working on an organization. The application is designed to store and manage employee data, including applauses, punishments, remarks, and penalties. It also provides personal reporting for each staff member and filterable reporting to obtain meticulous results from the data. The application is bifurcated into two primary components: the server-side, constructed with Express.js, and the client-side, developed using React.js and RTK Query.

## Demo (username: reza, password: 123456)
You can check out the demo version of the application [here](https://reactjsystem.iran.liara.run/login) (username: reza, password: 123456). Please note that the demo version may not include all the features of the full application.

<img src="https://res.cloudinary.com/db7v5ycxn/image/upload/v1702671039/github-readme-images/zog6pfnrpwhb0i22cmyi.png" height="400" />
<img src="https://res.cloudinary.com/db7v5ycxn/image/upload/v1702671038/github-readme-images/ow9crmi859dvb71fb0aa.png" height="400" />
<img src="https://res.cloudinary.com/db7v5ycxn/image/upload/v1702671040/github-readme-images/sqmuqzd1lme8ovxuzhk5.png" height="400" />

## Server-Side Architecture
The server-side of the application is the backbone of the system, responsible for managing requests and responses. It leverages a multitude of packages to ensure seamless operation. Key packages include:

- **Express.js**: A high-performance, unopinionated, and minimalist web framework for Node.js.
- **Axios**: A promise-based HTTP client that works seamlessly in the browser and Node.js.
- **Bcrypt**: A robust library designed to assist in password hashing.
- **Cors**: A middleware package for Connect/Express that enables CORS with a variety of options.
- **express-session**: A comprehensive implementation of JSON Web Tokens.
- **Mysql2**: A performance-focused MySQL client for Node.js.

The server-side also ensures security by maintaining user sessions and store them in mysql database.

## Client-Side Architecture
The client-side of the application, developed with React.js, utilizes a range of packages to deliver a rich and interactive user interface. Key packages include:

- **React**: A state-of-the-art JavaScript library for crafting user interfaces.
- **RTK Query**: A powerful data fetching and caching tool from Redux Toolkit.
- **Axios**: A promise-based HTTP client that works seamlessly in the browser and Node.js.
- **React Hook Form**: A high-performance, flexible, and extensible form solution with easy-to-use validation.
- **React Redux**: The official React bindings for Redux.
- **React Router Dom**: DOM bindings for React Router.
- **Material-UI**: A popular React UI framework for faster and easier web development.
- **Material-datagrid**: A powerful and flexible component from Material-UI that allows you to quickly and easily display and manipulate tabular data.

## Features
- **Employee Management**: Store and manage employee data, including applauses, punishments, remarks, and penalties.
- **Personal Reporting**: Generate personal reports for each staff member.
- **Filterable Reporting**: Obtain fine-grained results from the data using filterable reporting.
- **Data Export**: Download reports as Excel files or Office Word Documents.

## License
This project is licensed under the terms of the MIT license. See the [https://opensource.org/license/mit/] file for details.

## Contact

If you have any questions or feedback, please feel free to send me an email at [r.zeraatkar1992@gmail.com].
