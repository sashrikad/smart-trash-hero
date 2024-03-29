import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";

import { createMap, drawPoints } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-gl-js-amplify/dist/public/amplify-map.css";
import maplibregl from "maplibre-gl";
import { listDevices } from "../graphql/queries";
import { onUpdateDevice, onUpdateOptimizedRoute } from "../graphql/subscriptions";
import { Alert, Button, Popover, Snackbar, Typography } from "@mui/material";
import { optimizeRoute } from "../graphql/mutations";
import { SmartTrashDevice, SmartTrashDeviceInput } from "../API";

//https://maplibre.org/maplibre-gl-js/docs/examples/geojson-line/

const DeviceMap = (props: any) => {
  //let audio = new Audio("./success.mp3");
  const audioRef = useRef<any>();
  const mapRef = useRef<any>(null);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const [open, setOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [deviceMap, setDeviceMap] = useState<any>();
  const [routePoints, setRoutePoints] = useState([]);
  const [openPopover, setPpenPopover] = useState(false);
  const [popoverMessage, setPopoverMessage] = useState("");

  const callOptimizeRoute = async () => {
    const r = await client.graphql({ query: optimizeRoute, variables: { orgId: "1" } });
  };

  const updateMaker = (id: any, device: SmartTrashDevice) => {
    const el: HTMLElement = document.getElementById(id)!;
    if (device?.remaining! <= 50) {
      if (device?.fallen === true) {
        el.style.backgroundImage = `url(./trash-red-fallen.png)`;
      } else {
        el.style.backgroundImage = `url(./trash-red.png)`;
      }
    } else {
      if (device?.fallen === true) {
        el.style.backgroundImage = `url(./trash-green-fallen.png)`;
      } else {
        el.style.backgroundImage = `url(./trash-green.png)`;
      }
    }
  };

  const drawOptimizedRoute = (map: any, routePoints: any) => {
    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: routePoints,
        },
      },
    });

    map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "blue", // "#808080",
        "line-width": 5,
      },
    });
  };

  const showMessage = () => {
    playBeep();
    setOpen(true);
  };

  const handlePopoverClose = () => {
    setPpenPopover(false);

    setAnchorEl(null);
  };

  const closeMessage = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const playBeep = () => {
    try {
      // audio.play();
      audioRef.current!.play();
    } catch (error) {}
  };

  const client = generateClient();

  // const points = [
  //   [-72.1915429, 41.3250641],
  //   [-72.202612, 41.322281],
  //   [-72.1929152, 41.3274419],
  //   [-72.1968218, 41.3305608],
  // ];
  useEffect(() => {
    let map: maplibregl.Map;

    async function initializeMap() {
      // console.log("useEffect", mapRef.current, map);
      // if (mapRef.current != null) {
      console.log("create map");
      map = await createMap({
        container: "map",
        // center: { lat: points[0][1], lng: points[0][0] },
        zoom: 14,
      });

      const devices = (await client.graphql({ query: listDevices })).data.listDevices!;
      console.log("devices", devices);
      let dMap: any = {};
      devices.forEach((d) => {
        dMap[d?.id!] = d;
      });
      setDeviceMap(dMap);
      console.log("device map", dMap);

      const createSub = client.graphql({ query: onUpdateDevice }).subscribe({
        next: ({ data }) => {
          console.log("Subscription data", data);
          playBeep();
          setToastMessage("Device data is updated via appsync");
          setOpen(true);
          updateMaker(data.onUpdateDevice.id, data.onUpdateDevice);
        },
        error: (error) => console.warn(error),
      });

      map.on("load", function () {
        console.log("map loaded");

        try {
          const createSub = client.graphql({ query: onUpdateOptimizedRoute }).subscribe({
            next: ({ data }) => {
              console.log("Subscription data from optimizer", data.onUpdateOptimizedRoute);
              playBeep();
              setToastMessage(
                `Route is optimized for pickup.\nTotal estimated time is ${data.onUpdateOptimizedRoute.durationInSec} seconds.\nTotal estimated distance is ${data.onUpdateOptimizedRoute.distance} miles.`
              );
              setOpen(true);
              console.log("device map", dMap);

              let routePoints: any[] = [];
              let counter = 1;
              data.onUpdateOptimizedRoute.routes!.forEach((id: any) => {
                console.log(id, dMap[id]);
                routePoints.push([dMap[id].lng, dMap[id].lat]);
                const elem = document.getElementById(id);
                if (elem) {
                  console.log(`adding ${id}`);
                  elem.innerHTML = elem.innerHTML + `<span class="digit">${counter}</span>`;
                }
                counter++;
              });

              console.log("route points", routePoints);
              console.log(" points", points);
              drawOptimizedRoute(map, routePoints);
            },
            error: (error) => console.warn(error),
          });
        } catch (error) {}

        // drawPoints(
        //   "pointsSource", // Arbitrary source name
        //   [
        //     {
        //       coordinates: [points[1][0], points[1][1]], // [Longitude, Latitude]
        //       title: "Golden Gate Bridge",
        //       address: "A suspension bridge spanning the Golden Gate",
        //     },
        //     {
        //       coordinates: [points[0][0], points[0][1]], // [Longitude, Latitude]
        //     },
        //     {
        //       coordinates: [points[2][0], points[2][1]], // [Longitude, Latitude]
        //     },
        //     {
        //       coordinates: [points[3][0], points[3][1]], // [Longitude, Latitude]
        //     },
        //   ], // An array of coordinate data, an array of Feature data, or an array of [NamedLocations](https://github.com/aws-amplify/maplibre-gl-js-amplify/blob/main/src/types.ts#L8)
        //   map,
        //   {
        //     showCluster: true,
        //     unclusteredOptions: {
        //       showMarkerPopup: true,
        //     },
        //     clusterOptions: {
        //       showCount: true,
        //     },
        //   }
        // );

        let points: any = [];

        if (devices.length > 0) {
          const firstDevice = devices[0]!;
          map.setCenter({ lat: firstDevice.lat!, lng: firstDevice.lng! });
          points = devices.map((device) => [device!.lng!, device!.lat!]);
        }

        //add marker
        devices?.forEach((device) => {
          const el = document.createElement("div");
          el.id = device?.id!;
          el.className = "marker";
          if (device?.remaining! <= 50) {
            if (device?.fallen === true) {
              el.style.backgroundImage = `url(./trash-red-fallen.png)`;
            } else {
              el.style.backgroundImage = `url(./trash-red.png)`;
            }
          } else {
            if (device?.fallen === true) {
              el.style.backgroundImage = `url(./trash-green-fallen.png)`;
            } else {
              el.style.backgroundImage = `url(./trash-green.png)`;
            }
          }

          el.innerHTML = `<span style="top:-30px; position:relative"><strong >${device?.givenName}`;
          el.addEventListener("click", () => {
            //window.alert(device?.id);
            setPopoverMessage(
              `Remaining ${device?.remaining}% \nMovement Index ${device?.acc}\nBattery  ${device?.bat}`
            );
            setAnchorEl(el);
            setPpenPopover(true);
          });

          new maplibregl.Marker({ element: el }).setLngLat({ lat: device?.lat!, lng: device?.lng! }).addTo(map);
        });
      });
      //}
    }
    initializeMap();

    return () => {
      console.log("return from useEffect");
      if (map != null) map.remove();
    };
  }, []);

  return (
    <div>
      <div id="map" ref={mapRef} />

      <Button variant="contained" onClick={callOptimizeRoute} sx={{ mt: 2, ml: 2 }}>
        Optimize Route
      </Button>
      <Snackbar
        open={open}
        onClose={closeMessage}
        sx={{ height: "auto", lineHeight: "28px", padding: 10, whiteSpace: "pre-line" }}
      >
        <Alert onClose={closeMessage} severity="success" variant="filled" sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ height: "auto", lineHeight: "28px", padding: 10, whiteSpace: "pre-line" }}
      >
        <Typography sx={{ p: 2 }}>{popoverMessage}</Typography>
      </Popover>
      <audio src="./success.mp3" id="beep" ref={audioRef} />
    </div>
  );
};

DeviceMap.propTypes = {
  town: PropTypes.string,
  county: PropTypes.string,
};

export default withAuthenticator(DeviceMap);
