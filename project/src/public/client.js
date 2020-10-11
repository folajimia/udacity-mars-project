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

// Rover related information (refactor html to make prettier)
const renderInfo = roverPhotos => {
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
  return roverInfoHTML;
};

// generate html for rover data and image
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

//Handle click event when rover is selected
const init = (tabs, store) => {
  tabs.forEach(tab => {
    tab.addEventListener(`click`, async event => {
      const currentTab = event.target.innerText;
      await updateStore(store, { currentTab: currentTab });
      //Select new tab/rover
      activeTab(tabs, tab);
      // fetch selected tab/rover related data
      fetchData(store, currentTab);
    });
  });
};

// fetch rover data
const fetchData = async (store, currentTab) => {
  await getRoverPhotos(store, currentTab);
};

window.addEventListener("load", async () => {
  init(tabs, store);
  await fetchData(store, "curiosity");
  render(root, store);
});

//set new active tab in tab menu
const activeTab = (tabs, currentTab) => {
  console.log(tabs);
  tabs.forEach(tab => tab.classList.remove("active"));
  currentTab.classList.add("active");
};

// fetch data from backend
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
