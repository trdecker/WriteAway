# Overview
A sample journalling app. Users can sign up, reate entries, record audio, take photos, and mark entries with tags and moods.

# Development Environment
Developed in VSCode and Android Studio, written in TypeScript with React Ionic.

Uses a Node.js backend to save entries in Microsoft Azure. It's the same database used for a previous project [NoteMaster](https://github.com/trdecker/NoteMaster), titled [NoteMaster-API](https://github.com/trdecker/NoteMasterAPI).

# Features

### Login Page
* Sign in with username and password ✔
* Create new user name with ✔
* Display error message with incorrect username/password ✔
### Home Page
* List of recent entries ✔
  - Clickable ✔
  - Searchable ✔
* Previous entries are editable ✔
* Button to create a new journal entry ✔
### Entry Page
* Entries save to database ✔
* Rich text ✔
* Audio clips ✔
* Images ✔
* Save images to back end
* Save audio to back end
* Journal entry can have tags ✔
* Journal entry can have mood ✔
### Stretch Goals
* Integrate with calendar
* Push notifications ✔
* Utilize device camera and microphone ✔
* Add Chat GPT API help based on the day of the week, calendar events, mood, etc.
### TODO
* Modify [NoteMaster-API](https://github.com/trdecker/NoteMasterAPI) to accept images and audio
* Save audio and images in Microsoft Azure using
* Use Auth0 for authentication
* Deploy to Play Store and App Store!

# Useful Websites
* [Ionic React](https://ionicframework.com/docs/react)
* [VSCode](https://code.visualstudio.com/)
* [Node.js](https://nodejs.org/en/)
* [Photo Gallery Tutorial](https://github.com/trdecker/tutorial-photo-gallery-react)
* [Android Studio](https://developer.android.com/studio/install)
* [AppFlow](https://ionic.io/docs/appflow/)
* [React Developer Tools](https://react.dev/learn/react-developer-tools)
* [Auth0](https://auth0.com/)

### Packages Used
* [string-strip-html](https://www.npmjs.com/package/string-strip-html)
* [capacitor-voice-recordings](https://www.npmjs.com/package/capacitor-voice-recorder)
* [quill-react](https://www.npmjs.com/package/react-quill)
