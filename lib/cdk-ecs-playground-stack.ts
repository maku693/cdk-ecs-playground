import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as route53 from "@aws-cdk/aws-route53";

export interface CdkEcsPlaygroundStackProps extends cdk.StackProps {
  cognitoUserPoolArn: string;
  cognitoUserPoolClientId: string;
  cognitoUserPoolDomain: string;
  domainName: string;
  hostedZoneDomainName: string;
}

export class CdkEcsPlaygroundStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: CdkEcsPlaygroundStackProps) {
    super(scope, id, props);

    const loadBalancedService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      "Service",
      {
        protocol: elbv2.ApplicationProtocol.HTTPS,
        domainName: props.domainName,
        domainZone: route53.HostedZone.fromLookup(this, "HostedZone", {
          domainName: props.hostedZoneDomainName
        }),
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("nginx:alpine")
        }
      }
    );

    // Set target group deregistration delay.
    // cf. https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#target-group-attributes
    loadBalancedService.targetGroup.setAttribute(
      "deregistration_delay.timeout_seconds",
      "120"
    );

    // Allow ALB to connect anyone on HTTPS for Cognito authentication
    // cf. https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-authenticate-users.html#configure-user-authentication
    loadBalancedService.listener.connections.allowToAnyIpv4(
      ec2.Port.tcp(443),
      "Load balancer to anyone on port 443"
    );

    // Register listener rule for authentication
    new elbv2.CfnListenerRule(this, "CognitoAuthenticationListenerRule", {
      actions: [
        {
          authenticateCognitoConfig: {
            userPoolArn: props.cognitoUserPoolArn,
            userPoolClientId: props.cognitoUserPoolClientId,
            userPoolDomain: props.cognitoUserPoolDomain
          },
          type: "authenticate-cognito",
          order: 1
        },
        {
          targetGroupArn: loadBalancedService.targetGroup.targetGroupArn,
          type: "forward",
          order: 2
        }
      ],
      conditions: [
        {
          field: "path-pattern",
          pathPatternConfig: { values: ["/*"] }
        }
      ],
      listenerArn: loadBalancedService.listener.listenerArn,
      priority: 10
    });
  }
}
