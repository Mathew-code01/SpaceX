// import axios from 'axios';

   // Get the menu icon and navigation menu elements  
const menuIcon = document.querySelector('.menu-icon');  
const navMenu = document.querySelector('nav ul');  

// Add event listener to the menu icon  
menuIcon.addEventListener('click', () => {  
    menuIcon.classList.toggle('hidden');  
    navMenu.classList.toggle('show');  
}); 


  // SOS Message functionality
const sosForm = document.getElementById('sos-form');
const sosMessageInput = document.getElementById('sos-message');

sosForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const sosMessage = sosMessageInput.value.trim();
  if (sosMessage) {
    try {
      const response = await axios.post('/api/sos', { message: sosMessage });
      console.log(response.data);
      sosMessageInput.value = '';
    } catch (error) {
      alert(error.message);
    }
  }
});

 

// // Sign In functionality
// const signInForm = document.getElementById('sign-in-form');
// const signInEmailInput = document.getElementById('sign-in-email');
// const signInPasswordInput = document.getElementById('sign-in-password');
// const signinresponds = document.getElementById('sign-in-responds');

// signInForm.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const email = signInEmailInput.value.trim();
//   const password = signInPasswordInput.value.trim();
//   if (email && password) {
//     console.log(email,password);
//     try {
//       const response = await axios.post('/signin', { email, password });
      
//       // Process the data
//       if (response.ok) {
//         signinresponds.textContent = "Signed in successsfully";
//       } else {
//         signinresponds.textContent = "Sign in unsuccessful"
//       }
      
      

//     } catch (error) {
      
//       console.error(error);
//     }
//   } else {
//     displayError('Please fill in all fields');
//     return false;

//   }
// });

//        // Sign Up functionality
//        const signUpForm = document.getElementById('sign-up-form');
//        const signUpNameInput = document.getElementById('sign-up-name');
//        const signUpEmailInput = document.getElementById('sign-up-email');
//        const signUpPasswordInput = document.getElementById('sign-up-password');
//        const signupresponds = document.getElementById('sign-up-responds');
       
//        signUpForm.addEventListener('submit', async (e) => {
//          e.preventDefault();
//          const signUpname = signUpNameInput.value.trim();
//          const signUpemail = signUpEmailInput.value.trim();
//          const signUppassword = signUpPasswordInput.value.trim();
//          if (signUpname && signUpemail && signUppassword) {
//            try {
//              const response = await axios.post('/signup', { signUpname, signUpemail, signUppassword });
//              alert.log(response.data);
       
//              // Process the data
//              if (response.ok) {
//                signupresponds.textContent = "Signed up successsfully";
//              } else {
//                signupresponds.textContent = "Sign up unsuccessful"
//              }
             
//            } catch (error) {
//              console.error(error);
//              if (error) {
//                signupresponds.textContent = `An error occurred:${error}`;
//              } 
//            }
//          }
//        });
       
       // toggle-password-icon
       
       document.getElementById('toggle-password-icon').addEventListener('click', function() {
           const togglePasswordIcon = document.querySelector('i #toggle-password-icon .fa');
       
           // Toggle password visibility
           if (signUpPasswordInput.type === 'pasword') {
               togglePasswordIcon.classList.add('fa-unlock');
               togglePasswordIcon.classList.remove('fa-lock');
               
           } else {
               signUpEmailInput.type = 'password'; // Hide Password
               togglePasswordIcon.classList.remove('fa-unlock');
               togglePasswordIcon.classList.add('fa-lock');
           }if (error) {
               console.error(error);
               signupresponds.textContent = `An error occurred:${error}`;
             } 
       });

// Logout Functionality

document.getElementById('logout-btn').addEventListener('click', () => {
  document.getElementById('confirmation-dialog').style.display = 'block';
});

document.getElementById('no-btn').addEventListener('click', () => {
  document.getElementById('confirmation-dialog').style.display = 'none';
});


// // Confirmation Dialog
// document.getElementById('yes-btn').addEventListener('click', async () => {
//   try {
//     const response = await fetch('/api/logout', { 
//       method:'POST'});
//       if (response.ok) {
//         document.getElementById('sign')
//       }

//   }
// })



// Toggle Switch 

async function DarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
   document.body.classList.toggle('dark-mode');
   document.querySelectorAll('header, footer').forEach((element) => {
     element.classList.toggle('dark-mode');
   });
   document.querySelectorAll('.container.b').forEach((container) => {
     container.classList.toggle('dark-container');
   });
   document.querySelectorAll('button').forEach((button) => {
     button.classList.toggle('dark-mode');
   });
 
   document.querySelectorAll('h2, p').forEach((element) => {
     element.classList.toggle('dark-text-head');
   });

   document.querySelectorAll('nav').forEach((element) => {
      element.classList.toggle('dark-mode');
   });
 
   document.querySelectorAll('svg').forEach((svg) => {
     svg.classList.toggle('dark-mode');
   });
   localStorage.setItem('theme',
     document.body.classList.contains('dark-mode') ? 'dark': 'light'
   );
   document.body.classList.toggle('light-mode');
 });
  }

  
  
 
 // Set initial theme based on local storage
 const initialTheme = localStorage.getItem('theme');
 if (initialTheme === 'dark') {
   document.body.classList.add('dark-mode');
 }

// Get the menu icon and the mobile nav element  
const menuicon = document.getElementById('menu-icon');  
const mobileNav = document.querySelector('nav');  

// Toggle the mobile nav when the menu icon is clicked  
menuicon.addEventListener('click', () => {  
mobileNav.classList.toggle('show'); 
mobileNav.classList.toggle('mobile-nav');
mobileNav.classList.toggle('nav');
menuicon.classList.toggle('menu-icon');


});

// Live Coverage functionality
const liveCoverageList = document.getElementById('live-coverage-list');

async function fetchLiveCoverage() {
try {
  const response = await fetch('/api/live-coverage');
  const liveCoverage = response.data;
  liveCoverageList.innerHTML = '';
  liveCoverage.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    liveCoverageList.appendChild(listItem);
  });
} catch (error) {
  console.error(error);
}
}



// AI Identifier functionality


async function fetchAiIdentifier() {
  try {
    const image = document.getElementById('image').files[0];
    const formData = new FormData();
    formData.append('image', image); 
    const response = await fetch('/api/ai-identifier', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    const aiIdentifierResult = document.getElementById('ai-identifier-result');
    aiIdentifierResult.textContent = data.result.join(', ');
  } catch (error) {
    console.error(error);
  }
};



// Space Guide functionality
async function fetchSpaceGuide() {
try {
  const response = await fetch('/api/space-guide');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  // Process the data
  document.getElementById('space-guide-info').innerHTML = `
    <h2>${data.title}</h2>
      <p>${data.explanation}</p>
      <img src="${data.url}" alt="${data.title}" />
    <p><strong>Copyright:</strong> ${data.copyright}</p>
    <a href="${data.hdurl}" target="_blank">View High-Definition Image</a>
  `;
} catch (error) {
  console.error('Error fetching space guide:', error);
  document.getElementById('space-guide-info').innerHTML = 'Failed to load space guide.';
}
}



// Call fetch function when the page loads  
window.onload = fetchAstronomyPictureOfTheDay;





async function fetchAstronomyPictureOfTheDay() {  
  try {  
    const response = await fetch('/api/apod');  
    const apodData = await response.json();  
    console.log(apodData);  

    if (apodData && apodData.url && apodData.title && apodData.explanation) {  
      document.getElementById('space-guide-info').innerHTML = `  
        <h2>${apodData.title}</h2>  
        <img src="${apodData.url}" alt="${apodData.title}" />  
        <p>${apodData.explanation}</p>  
      `;  
    } else {  
      document.getElementById('space-guide-info').innerText = 'Failed to load Astronomy Picture of the Day';  
    }  
  } catch (error) {  
    console.error(error);  
    document.getElementById('space-guide-info').innerText = 'Failed to load Astronomy Picture of the Day';  
  }  
}


async function fetchSpaceNews() {
try {
  const response = await fetch('/api/space-news');
  const data = await response.json();  // Ensure this is correct
  const articles = data.articles; // Assuming the articles are in the "articles" key
  const newsList = articles.map(article => `
    <li>
      <h3>${article.title}</h3>
      <p>${article.summary}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    </li>
  `).join('');
  document.getElementById('space-news-list').innerHTML = newsList;
} catch (error) {
  console.error(error);
  document.getElementById('space-news-list').innerText = 'Failed to load space news';
}
}


async function fetchMarsRoverPhotos() {
try {
  const response = await fetch('/api/mars-rover-photos'); // Correct endpoint for Mars Rover photos
  const photos = await response.json();  // Get photo data
  const photoList = photos.map(photo => {
    const img = document.createElement('img');
    img.src = photo.img_src; // Make sure 'img_src' is the correct field
    img.alt = 'Mars Rover Photo';
    img.style.width = '200px';
    img.style.margin = '5px';
    return img.outerHTML; // Correctly add the image elements
  }).join('');
  document.getElementById('photos-mars-result').innerHTML = photoList;
} catch (error) {
  console.error(error);
  document.getElementById('photos-mars-result').innerText = 'Failed to load Mars rover photos';
}
}



// Function to initialize the app by fetching all necessary data  
async function initializeApp() {  
await fetchAstronomyPictureOfTheDay(); // Fetch APOD  
await fetchSpaceNews(); // Fetch space news  
await fetchMarsRoverPhotos(); // Fetch Mars rover photos  
await fetchSpaceGuide(); //
await fetchAiIdentifier();
await fetchLiveCoverage();

}  

// Immediately invoke the initialize function on DOM content loaded  
document.addEventListener('DOMContentLoaded', (event) => {  
initializeApp();  // Call the function to initialize the app  
}); 


const MainIndex = document.getElementById('mainIndex');
const MainProfile = document.getElementById('mainProfile');
const profileMain = document.querySelector('a#profilemain');

profileMain.addEventListener('click', () => {
  MainIndex.style.display = 'none';
  MainProfile.style.display = 'block';
});
