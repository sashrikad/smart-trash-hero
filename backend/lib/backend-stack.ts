import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Lambda } from "./lambda";
import { IotSql, TopicRule } from "@aws-cdk/aws-iot-alpha";
import { RetentionDays, LogGroup } from "aws-cdk-lib/aws-logs";
import { CloudWatchLogsAction, LambdaFunctionAction } from "@aws-cdk/aws-iot-actions-alpha";
import { AppSyncConstruct } from "./appsync-construct";
import { AuthConstruct } from "./auth-construct";
import { aws_location as location } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //get the tag value of application
    const application_name = this.node.tryGetContext("application_name");
    const AWS_ACCOUNT = cdk.Stack.of(this).account;
    const AWS_REGION = cdk.Stack.of(this).region;

    const authConstruct = new AuthConstruct(this, `${application_name}_authConstruct`, {});

    const appsyncResolverFn = new Lambda(this, "appsync-resolver", {
      environment: {
        REGION: AWS_REGION,
        TTL_IN_DAYS: "30",
      },
    });

    //create IoT Rule

    const cfnRouteCalculator = new location.CfnRouteCalculator(this, `${application_name}_route_calculator`, {
      calculatorName: `${application_name}_route_calculator`,
      dataSource: "Esri",
    });

    // CloudWatch Role for IoT Core error logging
    const logGroup = new LogGroup(this, "ErrorLogGroup", {
      retention: RetentionDays.ONE_WEEK,
    });

    const routeOptimizer = new Lambda(this, "route-optimizer", {
      environment: {
        POWERTOOLS_SERVICE_NAME: `${application_name}_route_optimizer`,
      },
    });

    const { api } = new AppSyncConstruct(this, `${application_name}_api_construct`, {
      routeOptimizerFnResolver: routeOptimizer.lambda,
    });

    routeOptimizer.lambda.addEnvironment("GRAPHQL_URL", api.graphqlUrl);
    routeOptimizer.lambda.addEnvironment("GRAPHQL_APIKEY", api.apiKey as string);
    routeOptimizer.lambda.addEnvironment("ROUTE_CALCULATOR_NAME", cfnRouteCalculator.calculatorName);
    routeOptimizer.lambda.addToRolePolicy(
      new PolicyStatement({
        actions: ["geo:CalculateRoute", "geo:CalculateRouteMatrix"],
        resources: [
          `arn:aws:geo:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:route-calculator/${
            cfnRouteCalculator.calculatorName
          }`,
        ],
      })
    );
    const ruleActionLambda = new Lambda(this, "topic-action", {
      environment: {
        TTL_IN_DAYS: "7",
        GRAPHQL_URL: api.graphqlUrl,
        GRAPHQL_APIKEY: api.apiKey as string,
        POWERTOOLS_SERVICE_NAME: `${application_name}_topic_action`,
      },
    });

    new TopicRule(this, `${application_name}_topic_rule`, {
      topicRuleName: `${application_name}_topic_rule`,
      sql: IotSql.fromStringAsVer20160323(`SELECT topic(2) as device_id, * FROM 'smarttrash/#'`),
      actions: [new LambdaFunctionAction(ruleActionLambda.lambda)],
      errorAction: new CloudWatchLogsAction(logGroup),
    });

    const cfnMap = new location.CfnMap(this, `${application_name}_map`, {
      configuration: {
        style: "VectorEsriStreets",
      },
      mapName: `${application_name}_map`,
    });
  }
}
