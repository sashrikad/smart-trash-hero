/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getDevice = /* GraphQL */ `query GetDevice($id: ID!) {
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
    __typename
  }
}
` as GeneratedQuery<APITypes.GetDeviceQueryVariables, APITypes.GetDeviceQuery>;
export const listDevices = /* GraphQL */ `query ListDevices {
  listDevices {
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
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDevicesQueryVariables,
  APITypes.ListDevicesQuery
>;
export const listDeviceLogs = /* GraphQL */ `query ListDeviceLogs($deviceId: String) {
  listDeviceLogs(deviceId: $deviceId) {
    deviceId
    ts
    acc
    dist
    bat
    ttl
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDeviceLogsQueryVariables,
  APITypes.ListDeviceLogsQuery
>;
export const getOptimizedRoute = /* GraphQL */ `query GetOptimizedRoute($orgId: String!) {
  getOptimizedRoute(orgId: $orgId) {
    orgId
    optimized
    distance
    durationInSec
    ts
    routes
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetOptimizedRouteQueryVariables,
  APITypes.GetOptimizedRouteQuery
>;
