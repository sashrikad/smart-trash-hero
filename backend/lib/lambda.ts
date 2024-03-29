import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_kms as kms, aws_lambda as lambda, aws_lambda_nodejs as lambdanodejs } from "aws-cdk-lib";
import { ILayerVersion } from "aws-cdk-lib/aws-lambda";

export interface LambdaProps {
  environment?: { [key: string]: string };
  layers?: ILayerVersion[];
}

export class Lambda extends Construct {
  public readonly lambda: lambdanodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    this.lambda = new lambdanodejs.NodejsFunction(this, id, {
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(30),
      entry: `lib/fns/${id}/index.mjs`,
      handler: "handler",
      functionName: `${id}`,
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
        ...props.environment,
      },
      bundling: {
        nodeModules: [],
        externalModules: [],
      },
      layers: props.layers,
      logRetention: cdk.aws_logs.RetentionDays.ONE_WEEK,
    });
  }
}
