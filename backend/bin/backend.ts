#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { Aspects } from "aws-cdk-lib";
import { BackendStack } from "../lib/backend-stack";
import { Tags } from "aws-cdk-lib";

const app = new cdk.App();
const application_name = app.node.tryGetContext("application_name");
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
let stack = new BackendStack(app, "SmartTrashBackendStack", {
  description: "Smart Trash Backend Stack",
});

Tags.of(stack).add("cdk", "true");
Tags.of(stack).add("application", application_name);
Tags.of(stack).add("platform", "Hackster");
