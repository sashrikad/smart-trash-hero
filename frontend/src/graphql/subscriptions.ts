/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onUpdateDevice = /* GraphQL */ `subscription OnUpdateDevice($id: ID) {
  onUpdateDevice(id: $id) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDeviceSubscriptionVariables,
  APITypes.OnUpdateDeviceSubscription
>;
export const onUpdateOptimizedRoute = /* GraphQL */ `subscription OnUpdateOptimizedRoute($orgId: String) {
  onUpdateOptimizedRoute(orgId: $orgId) {
    orgId
    optimized
    distance
    durationInSec
    ts
    routes
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateOptimizedRouteSubscriptionVariables,
  APITypes.OnUpdateOptimizedRouteSubscription
>;
