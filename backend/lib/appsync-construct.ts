import { StackProps, Expiration, CfnOutput, Duration, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  GraphqlApi,
  SchemaFile,
  AuthorizationType,
  MappingTemplate,
  FieldLogLevel,
  PrimaryKey,
  Values,
  KeyCondition,
} from "aws-cdk-lib/aws-appsync";
import { NagSuppressions } from "cdk-nag";
import { Function } from "aws-cdk-lib/aws-lambda";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";

interface AppSyncConstructProps extends StackProps {
  routeOptimizerFnResolver: Function;
}

export class AppSyncConstruct extends Construct {
  api: GraphqlApi;

  constructor(scope: Construct, id: string, props: AppSyncConstructProps) {
    super(scope, id);

    const { routeOptimizerFnResolver } = props;

    const application_name = this.node.tryGetContext("application_name");

    //create dynamo tables
    const deviceTable = new Table(this, "Device", {
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "id", type: AttributeType.STRING },
    });

    const deviceLogTable = new Table(this, "DeviceLog", {
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "deviceId", type: AttributeType.STRING },
      sortKey: { name: "ts", type: AttributeType.NUMBER },
      timeToLiveAttribute: "ttl",
    });

    const optimizedRouteTable = new Table(this, "OptimizedRoute", {
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "orgId", type: AttributeType.STRING },
    });

    this.api = new GraphqlApi(this, "Api", {
      name: `${application_name}-appsync-api`,
      schema: SchemaFile.fromAsset("./lib/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.IAM,
          },
        ],
      },
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      xrayEnabled: true,
    });

    const deviceTableDS = this.api.addDynamoDbDataSource("DeviceTable", deviceTable);
    deviceTableDS.createResolver("getDevice", {
      typeName: "Query",
      fieldName: "getDevice",
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem("id", "id"),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    deviceTableDS.createResolver("listDevices", {
      typeName: "Query",
      fieldName: "listDevices",
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });

    deviceTableDS.createResolver("updateDevice", {
      typeName: "Mutation",
      fieldName: "updateDevice",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition("id").is("input.id"),
        Values.projecting("input")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    //resolvers for Device Log table
    const deviceLogTableDS = this.api.addDynamoDbDataSource("DeviceTableLog", deviceLogTable);

    deviceLogTableDS.createResolver("updateDeviceLog", {
      typeName: "Mutation",
      fieldName: "updateDeviceLog",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition("deviceId").is("input.deviceId").sort("ts").is("input.ts"),
        Values.projecting("input")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    deviceLogTableDS.createResolver("listDeviceLogs", {
      typeName: "Query",
      fieldName: "listDeviceLogs",
      requestMappingTemplate: MappingTemplate.dynamoDbQuery(KeyCondition.eq("deviceId", "deviceId")),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    });

    //resolvers for Optimized Route table
    const optimizedRouteTableDS = this.api.addDynamoDbDataSource("OptimizedRouteTable", optimizedRouteTable);

    optimizedRouteTableDS.createResolver("getOptimizedRoute", {
      typeName: "Query",
      fieldName: "getOptimizedRoute",
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem("orgId", "orgId"),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    //write resolver for updateOptimizedRoute
    optimizedRouteTableDS.createResolver("updateOptimizedRoute", {
      typeName: "Mutation",
      fieldName: "updateOptimizedRoute",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition("orgId").is("input.orgId"),
        Values.projecting("input")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });

    //write lambda resolver for optimizeRoute
    const lambdaDS = this.api.addLambdaDataSource("LambdaDS", routeOptimizerFnResolver, {
      description: "Lambda Resolver",
    });
    lambdaDS.createResolver("optimizeRoute", {
      typeName: "Mutation",
      fieldName: "optimizeRoute",
      requestMappingTemplate: MappingTemplate.lambdaRequest(),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
    });

    new CfnOutput(this, "ApiUrl", {
      value: this.api.graphqlUrl,
    });

    new CfnOutput(this, "ApiId", {
      value: this.api.apiId,
    });

    new CfnOutput(this, "ApiKey", {
      value: this.api.apiKey as string,
    });
  }
}
