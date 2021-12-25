# Strictly Social

## What is this repo?
This is the repository of a social networking application called "Strictly Social" that I'm working on.

## Why this app?
It is common knowledge that there are countless social networking applications. So this app is not cool novel idea. But the thing is, most social networking apps track users all throughout the web for various reasons with one of them being "offering good recommendations to users".

I've sidestepped the whole issue of tracking users by asking the users what their interests are upfront. This makes the overall functionality of the application easier to make. Moreover, users can modify their interests at any point in time. 

## What can a user on this app do?
The sole purpose of me creating is to bring like-minded people together. Therefore, every user on this app can obtain recommendations(calculated with the help of KNN) of users similar to them. If a user finds another user interesting, they can make a friend request(cliched...I know). Once a friend request is accepted, both parties involved will be able to view each other's contact information.

## Tamper proof
The app checks if the local storage has been tampered with at each page load. If yes, the app will make the user re-login

## How to run the app?
Run the seedInterests.js file to create the global interests collection. At this point the core functionalities of the app should work. Follow the comments in app.py to make modifications to the recommender_api. Run both the index.js files and the app.py file. 

## What does the future look like for this app?
The next iteration of this app will have a chat-system built in so that users do not have to resort to external communication mediums like email and phone.

[Will add screenshots of the client-side in some time]
