Hotel Safe Deposit Box 
React app, web simulation of safe deposit box usually found in hotel rooms. They are  designed to keep small valuables and documents protected while guests are out of the room.  User interface is made simple to avoid the need for issuing mechanical keys or pin codes by  hotel’s staff. What follows are User’s manual and then control panel of safe deposit box.     


Locking:    1. Before closing doors enter any 6 digit passcode.  Remember the passcode! 
            2. Close the door and press lock button [L] to lock the safe.       
Unlocking:  1. Enter your 6 digit passcode**   
            2. Please leave the door open before checking out from hotel         
** If you can’t remember passcode, please call reception to help you for a small fee of 5€ 

Control panel is composed of body,  number keypad and backlit screen. Backlit screen has two textual segments:  ● top left segment that indicates if door is locked,  ● main segment for status messages during locking/unlocking process.    Screen’s backlight is turned off when idle for more than 5 seconds. 
Locking/unlocking sequence is described in User’s manual for the safe. You can also check out  this video to see one variation of real world safe implementation: ​https://youtu.be/qNPJqtGSXuE    
Number keypad doesn’t have submit/cancel keys for the commands and passcodes. Instead  input timeout should be implemented with the value of 1.2s: User enters sequence of button  presses, then if idle for 1.2s, control panel processes given input.    
Mechanical process of locking/unlocking lasts 3 seconds.    
Sometimes hotel guests leave the safe deposit box locked when they uncheck. Or sometimes  they just forget the passcode. This is why there is master unlock IoT feature:   
1. hotel’s staff member enters 6 zeros, which puts control panel into “service” mode, 
2. then staff member enters super secret master code of unknown length that can be made  up from any keypad character (eg. ‘4L5336*987**L01576823’)   
3. when input is completed, master code should be sent to this validation endpoint:  https://9w4qucosgf.execute-api.eu-central-1.amazonaws.com/default/CR-JS_team_M02a?code=456R987L0123   
4. if response, eg. {sn:123456}, matches serial number of safe deposit box - door unlocks.  Serial number is predefined and marked with [S/N] and placed on the door of the safe  box. (check the design!)   




This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
