# House Marketplace

This project is from the `React Front To Back 2022 Course` by Traversy Media. 
The app allows to create an account, login, create, update, delete listings, 
and protects private routes. 

The app uses firebase for authentication and firestore as database. 

To connect to firebase, a config folder will need to be created to add your app configurations.

The app also uses the Postion Stack API to get coordinates of listings' addresses.
These coordinates are then used to display the location using leaflet map.

A `.env` file needs to be created to store the api key also. 

## Available Scripts

Technologies: 

• React
• React-router-dom v6
• Firebase v9
• Netlify Serverless Functions



## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs app and server on [http://localhost:8888]
Runs the app in the development mode.\

The page will reload when you make changes.\
You may also see any lint errors in the console.


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
