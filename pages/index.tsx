import { useEffect, useState } from "react";
import axios from "axios";
import randomColor from "randomcolor";

import MapLoadingHolder from "../components/map-loading-holder";
import MapboxMap from "../components/mapbox-map";
import Rides from "../components/rides";

function App({ rides }: { rides: any }) {
  const [loaded, setLoaded] = useState(false);
  const [size, setSize] = useState(5);
  const [loadedRides, setLoadedRides] = useState(rides.slice(0, size));

  useEffect(() => {
    setLoadedRides(rides.slice(0, size));
  }, [size]);

  return (
    <div className="app-container">
      <div className="map-wrapper">
        <MapboxMap onMapLoaded={() => setLoaded(true)} rides={loadedRides} />
      </div>
      {!loaded && <MapLoadingHolder />}
      {loaded && <Rides rides={loadedRides} />}
      {loaded && (
        <button
          className="load-more"
          // Permits to update the size of the list and load more courses
          onClick={() => setSize((size) => (size += 5))}
        >
          Charger plus de courses
        </button>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const result = await axios.get("https://staging.cocolis.fr/es/rides/_search");

  // Format the ride object to add a random color right after fetch
  const rides = result.data.hits.hits.map((ride: any) => ({
    ...ride,
    _color: randomColor(),
  }));
  return {
    props: {
      rides,
    },
  };
}

export default App;
