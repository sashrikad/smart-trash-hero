import { executeGraphQlOperation } from "../commons/utils";
import { logger } from "../commons/powertools";

export const handler = async (event, context) => {
  //logger.info(JSON.stringify(event, null, 2));

  logger.debug("Received event", { event });

  const getDevice = {
    query: `query GetDevice($id: ID!) {
      getDevice(id: $id) {
        id
        orgId
        givenName
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
    operationName: "GetDevice",
    variables: {
      id: event.device_id,
    },
  };

  const device = (await executeGraphQlOperation(getDevice)).getDevice;
  logger.debug("Found device", { device });

  const input = {
    id: event.device_id,
    bat: event.bat,
    dist: event.d,
    acc: event.acc,
    ts: Math.floor(new Date().getTime() / 1000),
  };

  if (device) {
    input.dist = event.d;
    input.orgId = device.orgId;
    input.givenName = device.givenName;
    input.vol = device.vol;
    input.accThresold = device.accThresold;
    input.fallen = event.acc > device.accThresold ? true : false;
    input.lat = device.lat;
    input.lng = device.lng;

    if (event.d > device.vol) {
      input.remaining = 100;
    } else {
      input.remaining = 100 - parseInt(((device.vol - event.d) / device.vol) * 100);
    }
  }

  const updateDevice = {
    query: `mutation UpdateDevice($input: SmartTrashDeviceInput) {
      updateDevice(input: $input) {
        id
        orgId
        givenName
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
    operationName: "UpdateDevice",
    variables: {
      input: input,
    },
  };

  await executeGraphQlOperation(updateDevice);

  const updateDeviceLog = {
    query: `mutation UpdateDeviceLog($input: SmartTrashDeviceLogInput) {
      updateDeviceLog(input: $input) {
        deviceId
        ts
        bat
        dist
        acc
        ttl
      }
    }`,
    operationName: "UpdateDeviceLog",
    variables: {
      input: {
        deviceId: event.device_id,
        ts: Math.floor(new Date().getTime() / 1000),
        bat: event.bat,
        dist: event.d,
        acc: event.acc,
        ttl: Math.floor(new Date().getTime() / 1000 + 3600 * 24 * 7),
      },
    },
  };

  const r = await executeGraphQlOperation(updateDeviceLog);

  return {
    statusCode: 200,
    body: JSON.stringify("done"),
  };
};
