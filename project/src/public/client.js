let store = {
  currentTab: "curiosity",
  roverPhotos: []
};

//add our markup to the page
const root = document.getElementById("root");
const tabs = document.querySelectorAll(".tab");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

const App = state => {
  const { roverPhotos } = state;
  return generateHTML(roverPhotos);
};

const generateHTML = roverPhotos => {
  //const photoHTML = renderPhotos(roverPhotos);

  let photoHTML = ``;
  //debugger;
  roverPhotos.image.photos.map(photo => {
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

  return `
  <div>
      <section class="image-container">
        ${photoHTML}
      </section>
  </div>
  `;
};

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
