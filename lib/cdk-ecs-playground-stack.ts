// import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import * as cdk from "@aws-cdk/core";

export class CdkEcsPlaygroundStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const vpc = ec2.Vpc.fromLookup(this, "VPC", { ... });
    // const cluster = new ecs.Cluster(this, "Cluser", { vpc });
    new ecsPatterns.ApplicationLoadBalancedFargateService(this, "Service", {
      // cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("nginx:alpine")
      }
      // publicLoadBalancer: true,
      // certificate: ...
    });
  }
}
