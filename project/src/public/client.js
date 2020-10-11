const { Map } = require("immutable");

let store = Map({
  user: {
    name: "Folajimi Adekoya"
  },
  rovers: ["curiosity", "opportunity", "spirit"],
  roverPhotos: [],
  currentTab: "curiosity",
  rover: ""
});

// let store = {
//   currentTab: "curiosity",
//   roverPhotos: []
// };

//add our markup to the page
const root = document.getElementById("root");
const tabs = document.querySelectorAll(".tab");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state, renderInfo, renderImages);
};

const App = (state, renderInfo, renderImages) => {
  const { roverPhotos } = state;
  return generateHTML(roverPhotos, renderInfo, renderImages);
};

// A pure function that renders images requested from the backend
const renderImages = roverPhotos => {
  let photoHTML = ``;

  // here map() is also a higher order function
  roverPhotos.image.latest_photos.map(photo => {
    photoHTML += `
        <figure class="image-card">
          <img src="${photo.img_src}" alt="Rover image" class="rover-image"/>
          <figcaption>
          <span><b>Sol (Mars days):</b> ${photo.sol}</span><br/>
          <span><b>Earth date:</b> ${photo.earth_date}</span>
          </figcaption>
          </figure>
    `;
  });
  return photoHTML;
};

const renderInfo = roverPhotos => {
  // here map() is also a higher order function
  const roverData = roverPhotos.image.latest_photos[0].rover;
  let roverInfoHTML = `<h4>Welcome to my dashboard</h4>
          <div class="info">
          <strong>These are photos from </strong> <p>${roverData.name}</p>
          <strong>The current Status of the Rover is</strong>
            <p>${roverData.status}</p>
            <strong>The Rover Launch Date is</strong>
            <p>${roverData.launch_date}</p>
            <strong>The Rover Landing Date is</strong>
            <p>${roverData.landing_date}</p>
        </div>
  `;
  //});
  return roverInfoHTML;
};

const generateHTML = (roverPhotos, renderInfo, renderImages) => {
  const roverInfoHTML = renderInfo(roverPhotos);
  const photoHTML = renderImages(roverPhotos);
  return `
        <div>
                ${roverInfoHTML}
            <section class="image-container">
                ${photoHTML}
            </section>
        </div>
    `;
};

// const generateHTML = roverPhotos => {
//   //const photoHTML = renderPhotos(roverPhotos);

//   const roverData = roverPhotos.image.latest_photos[0].rover;
//   let photoHTML = ``;
//   let textHTML = `<h4>Welcome to my dashboard</h4>
//           <div class="info">
//           <strong>These are photos from </strong> <p>${roverData.name}</p>
//           <strong>The current Status of the Rover is</strong>
//             <p>${roverData.status}</p>
//             <strong>The Rover Launch Date is</strong>
//             <p>${roverData.launch_date}</p>
//             <strong>The Rover Landing Date is</strong>
//             <p>${roverData.landing_date}</p>
//         </div>
//   `;
//   //debugger;
//   roverPhotos.image.latest_photos.map(photo => {
//     photoHTML += `
//         <figure class="image-card">
//           <img src="${photo.img_src}" alt="Rover image" class="rover-image"/>
//           <figcaption>
//           <span><b>Sol (Mars days):</b> ${photo.sol}</span><br/>
//           <span><b>Earth date:</b> ${photo.earth_date}</span>
//           </figcaption>
//           </figure>
//     `;
//   });

//   return `
//   <div>
//         ${textHTML}
//       <section class="image-container">
//         ${photoHTML}
//       </section>
//   </div>
//   `;
// };
const init = (tabs, store) => {
  //replace forEach with map when testing
  tabs.forEach(tab => {
    tab.addEventListener(`click`, async event => {
      debugger;
      const currentTab = event.target.innerText;
      await updateStore(store, { currentTab: currentTab });
      activeTab(tabs, tab);
      fetchData(store, currentTab);
    });
  });
};

const fetchData = async (store, currentTab) => {
  await getRoverPhotos(store, currentTab);
};

window.addEventListener("load", async () => {
  init(tabs, store);
  await fetchData(store, "curiosity");
  render(root, store);
});

const activeTab = (tabs, currentTab) => {
  console.log(tabs);
  tabs.forEach(tab => tab.classList.remove("active"));
  currentTab.classList.add("active");
};

const getRoverPhotos = (store, roverName) => {
  fetch(`http://localhost:3000/apod`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ roverName: roverName })
  })
    .then(res => res.json())
    .then(roverPhotos => {
      updateStore(store, { roverPhotos: roverPhotos });
    });
};

// const { Map } = require("immutable");
// const getRoverPhotos = (store, roverName) => {
//   fetch(`http://localhost:3000/apod`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ roverName: roverName })
//   })
//     .then(res => res.json())
//     .then(roverPhotos => {
//       updateStore(store, { roverPhotos: roverPhotos });
//     });
// };

//const RoverPhotoMap = Map(getRoverPhotos(store, "curiosity"));

// RoverPhotoMap;
//let { Map } = require("immutable");
//import Immutable from require('immutable');

//import Immutable from require('immutable');
//const map = Map();

//const map = Map();
console.log(store);
