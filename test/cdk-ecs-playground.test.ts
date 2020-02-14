import { expect, haveResourceLike } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import CdkEcsPlayground = require("../lib/cdk-ecs-playground-stack");

test("ECS Service Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkEcsPlayground.CdkEcsPlaygroundStack(app, "MyTestStack");
  // THEN
  expect(stack).to(
    haveResourceLike("AWS::ECS::TaskDefinition", {
      ContainerDefinitions: [{ Image: "nginx:alpine" }]
    })
  );
});
