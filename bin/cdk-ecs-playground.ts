#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { CdkEcsPlaygroundStack } from "../lib/cdk-ecs-playground-stack";

const app = new cdk.App();

new CdkEcsPlaygroundStack(app, "CdkEcsPlaygroundStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  cognitoUserPoolArn: app.node.tryGetContext("cognitoUserPoolArn") as string,
  cognitoUserPoolClientId: app.node.tryGetContext(
    "cognitoUserPoolClientId"
  ) as string,
  cognitoUserPoolDomain: app.node.tryGetContext(
    "cognitoUserPoolDomain"
  ) as string,
  domainName: app.node.tryGetContext("domainName") as string,
  hostedZoneDomainName: app.node.tryGetContext("hostedZoneDomainName") as string
});
