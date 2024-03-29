/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const updateDevice = /* GraphQL */ `mutation UpdateDevice($input: SmartTrashDeviceInput) {
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateDeviceMutationVariables,
  APITypes.UpdateDeviceMutation
>;
export const updateDeviceLog = /* GraphQL */ `mutation UpdateDeviceLog($input: SmartTrashDeviceLogInput) {
  updateDeviceLog(input: $input) {
    deviceId
    ts
    acc
    dist
    bat
    ttl
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateDeviceLogMutationVariables,
  APITypes.UpdateDeviceLogMutation
>;
export const updateOptimizedRoute = /* GraphQL */ `mutation UpdateOptimizedRoute($input: OptimizedRouteInput) {
  updateOptimizedRoute(input: $input) {
    orgId
    optimized
    distance
    durationInSec
    ts
    routes
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateOptimizedRouteMutationVariables,
  APITypes.UpdateOptimizedRouteMutation
>;
export const optimizeRoute = /* GraphQL */ `mutation OptimizeRoute($orgId: String) {
  optimizeRoute(orgId: $orgId) {
    orgId
    optimized
    distance
    durationInSec
    ts
    routes
    __typename
  }
}
` as GeneratedMutation<
  APITypes.OptimizeRouteMutationVariables,
  APITypes.OptimizeRouteMutation
>;
