#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { CdkEcsPlaygroundStack } from "../lib/cdk-ecs-playground-stack";

const app = new cdk.App();
new CdkEcsPlaygroundStack(app, "CdkEcsPlaygroundStack");
