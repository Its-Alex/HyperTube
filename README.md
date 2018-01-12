# HyperTube project
Popcorntime like app
## Dependencies
To start this website you need to have installed `ffmpeg` with **libvpx** and **libvorbis**
### Mac OS
```shell
brew install libvpx libvorbis
brew install ffmpeg --with-libvpx --with-libvorbis
```
### Linux
Get `ffmpeg` from your system manager package
### Windows
Download `ffmpeg` and put it in your path
## How to launch
```shell
npm install
npm run start
```
## Requirements
You will need a config.json file in root directory
```
{
    "port": 3000,
    "pathStorage": "", // Path storage used to store movie
    "db": { // Database acces MySQL or MariaDB
        "host": "",
        "database": "",
        "user": "",
        "password": ""
    },
    "passport": { // Oauth connexion need id and secret of your app
        "fortyTwo": {
            "id": "",
            "secret": ""
        },
        "github": {
            "id": "",
            "secret": ""
        },
        "facebook": {
            "id": "",
            "secret": ""
        }
    },
    "api": {
        "tmdb": {
            "key": "" // Tmdb api key
        }
    }
}
```
