/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type SmartTrashDeviceInput = {
  id: string,
  orgId?: string | null,
  givenName?: string | null,
  vol?: number | null,
  remaining?: number | null,
  acc?: number | null,
  accThresold?: number | null,
  fallen?: boolean | null,
  dist?: number | null,
  bat?: number | null,
  lat?: number | null,
  lng?: number | null,
  ts?: number | null,
};

export type SmartTrashDevice = {
  __typename: "SmartTrashDevice",
  id: string,
  orgId?: string | null,
  givenName?: string | null,
  vol?: number | null,
  remaining?: number | null,
  acc?: number | null,
  accThresold?: number | null,
  fallen?: boolean | null,
  dist?: number | null,
  bat?: number | null,
  lat?: number | null,
  lng?: number | null,
  ts?: number | null,
};

export type SmartTrashDeviceLogInput = {
  deviceId: string,
  ts: number,
  acc?: number | null,
  dist?: number | null,
  bat?: number | null,
  ttl?: number | null,
};

export type SmartTrashDeviceLog = {
  __typename: "SmartTrashDeviceLog",
  deviceId: string,
  ts: number,
  acc?: number | null,
  dist?: number | null,
  bat?: number | null,
  ttl?: number | null,
};

export type OptimizedRouteInput = {
  orgId: string,
  optimized?: boolean | null,
  distance?: number | null,
  durationInSec?: number | null,
  ts?: number | null,
  routes?: Array< string | null > | null,
};

export type OptimizedRoute = {
  __typename: "OptimizedRoute",
  orgId: string,
  optimized?: boolean | null,
  distance?: number | null,
  durationInSec?: number | null,
  ts?: number | null,
  routes?: Array< string | null > | null,
};

export type UpdateDeviceMutationVariables = {
  input?: SmartTrashDeviceInput | null,
};

export type UpdateDeviceMutation = {
  updateDevice?:  {
    __typename: "SmartTrashDevice",
    id: string,
    orgId?: string | null,
    givenName?: string | null,
    vol?: number | null,
    remaining?: number | null,
    acc?: number | null,
    accThresold?: number | null,
    fallen?: boolean | null,
    dist?: number | null,
    bat?: number | null,
    lat?: number | null,
    lng?: number | null,
    ts?: number | null,
  } | null,
};

export type UpdateDeviceLogMutationVariables = {
  input?: SmartTrashDeviceLogInput | null,
};

export type UpdateDeviceLogMutation = {
  updateDeviceLog?:  {
    __typename: "SmartTrashDeviceLog",
    deviceId: string,
    ts: number,
    acc?: number | null,
    dist?: number | null,
    bat?: number | null,
    ttl?: number | null,
  } | null,
};

export type UpdateOptimizedRouteMutationVariables = {
  input?: OptimizedRouteInput | null,
};

export type UpdateOptimizedRouteMutation = {
  updateOptimizedRoute?:  {
    __typename: "OptimizedRoute",
    orgId: string,
    optimized?: boolean | null,
    distance?: number | null,
    durationInSec?: number | null,
    ts?: number | null,
    routes?: Array< string | null > | null,
  } | null,
};

export type OptimizeRouteMutationVariables = {
  orgId?: string | null,
};

export type OptimizeRouteMutation = {
  optimizeRoute?:  {
    __typename: "OptimizedRoute",
    orgId: string,
    optimized?: boolean | null,
    distance?: number | null,
    durationInSec?: number | null,
    ts?: number | null,
    routes?: Array< string | null > | null,
  } | null,
};

export type GetDeviceQueryVariables = {
  id: string,
};

export type GetDeviceQuery = {
  getDevice?:  {
    __typename: "SmartTrashDevice",
    id: string,
    orgId?: string | null,
    givenName?: string | null,
    vol?: number | null,
    remaining?: number | null,
    acc?: number | null,
    accThresold?: number | null,
    fallen?: boolean | null,
    dist?: number | null,
    bat?: number | null,
    lat?: number | null,
    lng?: number | null,
    ts?: number | null,
  } | null,
};

export type ListDevicesQueryVariables = {
};

export type ListDevicesQuery = {
  listDevices?:  Array< {
    __typename: "SmartTrashDevice",
    id: string,
    orgId?: string | null,
    givenName?: string | null,
    vol?: number | null,
    remaining?: number | null,
    acc?: number | null,
    accThresold?: number | null,
    fallen?: boolean | null,
    dist?: number | null,
    bat?: number | null,
    lat?: number | null,
    lng?: number | null,
    ts?: number | null,
  } | null > | null,
};

export type ListDeviceLogsQueryVariables = {
  deviceId?: string | null,
};

export type ListDeviceLogsQuery = {
  listDeviceLogs?:  Array< {
    __typename: "SmartTrashDeviceLog",
    deviceId: string,
    ts: number,
    acc?: number | null,
    dist?: number | null,
    bat?: number | null,
    ttl?: number | null,
  } | null > | null,
};

export type GetOptimizedRouteQueryVariables = {
  orgId: string,
};

export type GetOptimizedRouteQuery = {
  getOptimizedRoute?:  {
    __typename: "OptimizedRoute",
    orgId: string,
    optimized?: boolean | null,
    distance?: number | null,
    durationInSec?: number | null,
    ts?: number | null,
    routes?: Array< string | null > | null,
  } | null,
};

export type OnUpdateDeviceSubscriptionVariables = {
  id?: string | null,
};

export type OnUpdateDeviceSubscription = {
  onUpdateDevice?:  {
    __typename: "SmartTrashDevice",
    id: string,
    orgId?: string | null,
    givenName?: string | null,
    vol?: number | null,
    remaining?: number | null,
    acc?: number | null,
    accThresold?: number | null,
    fallen?: boolean | null,
    dist?: number | null,
    bat?: number | null,
    lat?: number | null,
    lng?: number | null,
    ts?: number | null,
  } | null,
};

export type OnUpdateOptimizedRouteSubscriptionVariables = {
  orgId?: string | null,
};

export type OnUpdateOptimizedRouteSubscription = {
  onUpdateOptimizedRoute?:  {
    __typename: "OptimizedRoute",
    orgId: string,
    optimized?: boolean | null,
    distance?: number | null,
    durationInSec?: number | null,
    ts?: number | null,
    routes?: Array< string | null > | null,
  } | null,
};
