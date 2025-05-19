MATRIT24028_FTO2410_A_Mathew_Ritchie_DJS11

# Welcome to the-best-ever-podcast-web-app

This project was designed and Created by Mathew Ritchie. I can be contacted by email at ritchmat89@gmail.com.

## 1.Deployment with Netlify

The web app has been deployed to the internet through Netlify. To view it online you can follow the link:

https://the-best-ever-podcast-web-app-2.netlify.app/

## 2.Using the code

    ### install dependencies 
    
    nmp install
    

    ### view in browser
    
    npm run dev


## 3.Code Structure

The code is broken up into a few sections. Firstly there is the usePodcastStore.js which is the main store for fetching all data from the API, and has the functions for all the sorting, filtering and storing of that data.

Withing the pages folder there are 4 components that make up the bulk of the UI. The MainShowsPage (List of all podcasts), IndividualShowPage (information relating to specific podcasts), and EpisodePage(episodes within a season), all communicate with the usePodcastAPI to get thedata they need to display in the UI. the Favourites page is linked to local storage and recieved all of its required data from there. The local storage recieved favourites information via the EpisodePage, so the link of communication is EpisodePage -><-> Localstorage -><- Favourites.

The AudioContext file acts as a secondary store which has the sole purpose of maintiaining the state if the audio in the app and creating a context in which the UI pages can communicate with it. All of the logic required to play audio and keep track of the playcount is housed in the AudioContext.

There is a components folder where I have all of the smaller components used in my app. There two main ones that are the Header and LeftNavBar. These are linked up in he MainLayout and are universal in my aplication.

A component like the ShowCarousel is a React component that I got from npm https://www.npmjs.com/package/react-multi-carousel . it is the React-Multi_Carousel.

Then I have made smaller components like the GenredropDown, SearchInput, SortingDropDown and FavouritesSorting, which all are then linked with tags in my pages.

Finally I have a utils folder. This mainly has some fuctions that were easy to remove from the pages and to decluter them.

## 4. Technologies installed for this project

This is a React application and the framework was installed with Vite. I have also used Zustand for the global store which is imported into the usePodcastStore.jsx. To assist with navigation I have used React Router, the Routes are set up in my App.jsx file, which maps out the entire app. THis is also where were wrap the pages in the AudioContext so they can communicate with the AudioContext.jsx.

## 5. 3rd person components and icons used.

    - As mentioned the ShowCarousel is from npm React-Multi-Carousel
        - https://www.npmjs.com/package/react-multi-carousel

    - The site logo that I use is a png from pngtree.com and I used favicon.io to convert the png so that it could also be used in the browser tab.

    - The loading progress icon I used is from Material UI and is imported into the pages that need it. https://mui.com/material-ui/react-progress/

    - I have icons like the star and play button which I got from React Icons https://react-icons.github.io/react-icons/

# 6. Link to my presentation slides!!!!!

https://docs.google.com/presentation/d/1jM2oeR5lqOFc2vqDb8Qb8DOKhtbqAICqcmkVEyvwcIo/edit?usp=sharing
