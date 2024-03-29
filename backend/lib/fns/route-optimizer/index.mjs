import { executeGraphQlOperation } from "../commons/utils";
import { logger } from "../commons/powertools";

const { LocationClient, CalculateRouteMatrixCommand } = require("@aws-sdk/client-location");

export const handler = async (event, context) => {
  logger.debug("GPAPHQL INPUT", { event });
  const locationClient = new LocationClient();

  const listDevices = {
    query: `query ListDevices {
      listDevices {
        id
        orgId
        vol
        remaining
        acc
        accThresold
        fallen
        dist
        bat
        lat
        lng
        ts
      }
    
    }`,
    operationName: "ListDevices",
  };

  let devices = (await executeGraphQlOperation(listDevices)).listDevices;
  //d.orgId === event.arguments.orgId
  devices = devices.filter((d) => d.remaining <= 50);
  logger.debug("DEVICES", { devices });

  const waypoints = devices.map((point) => [point.lng, point.lat]);
  let markers = devices;

  const { RouteMatrix } = await locationClient.send(
    new CalculateRouteMatrixCommand({
      CalculatorName: process.env.ROUTE_CALCULATOR_NAME,
      DeparturePositions: waypoints,
      DestinationPositions: waypoints,
      DistanceUnit: "Miles",
      TravelMode: "Truck",
    })
  );

  let routeMatrix = RouteMatrix;

  logger.debug("Route matrix", { routeMatrix });
  const optimizedMarkers = [];
  const visitedIdx = new Set();
  let current = 0;
  let totalTime = 0;
  let totalDistance = 0;
  while (optimizedMarkers.length < markers.length) {
    optimizedMarkers.push(markers[current].id);
    visitedIdx.add(current);
    let closest = Infinity;
    let closestIdx = -1;
    routeMatrix[current].forEach(({ DurationSeconds }, idx) => {
      if (visitedIdx.has(idx)) {
        return;
      }
      if (DurationSeconds < closest) {
        closestIdx = idx;
        closest = DurationSeconds;
      }
    });

    //console.log(totalTime);
    console.log(`${totalTime} + ${closest} = ${totalTime + closest}`);
    if (closest !== Infinity) {
      totalTime += closest;
      totalDistance += routeMatrix[current][closestIdx].Distance;
    }

    current = closestIdx;
  }

  logger.debug("optimized route", { optimizedMarkers });

  const input = {
    orgId: event.arguments.orgId,
    optimized: true,
    routes: optimizedMarkers,
    durationInSec: totalTime,
    distance: totalDistance,
    ts: Math.floor(new Date().getTime() / 1000),
  };

  const updateOptimizedRoute = {
    query: `mutation UpdateOptimizedRoute($input: OptimizedRouteInput) {
      updateOptimizedRoute(input: $input) {
        orgId
        optimized
        distance
        durationInSec
        ts
        routes
      }
    }`,
    operationName: "UpdateOptimizedRoute",
    variables: {
      input: input,
    },
  };

  const r = await executeGraphQlOperation(updateOptimizedRoute);

  return input;
};
