import { Stack, StackProps, CfnOutput, aws_cognito, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { IRole, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { IdentityPool, UserPoolAuthenticationProvider } from "@aws-cdk/aws-cognito-identitypool-alpha";
import { NagSuppressions } from "cdk-nag";

interface AuthConstructProps extends StackProps {}

export class AuthConstruct extends Construct {
  unauthRole: IRole;

  constructor(scope: Construct, id: string, _props: AuthConstructProps) {
    super(scope, id);

    const application_name = this.node.tryGetContext("application_name");

    const userPool = new aws_cognito.UserPool(this, `UserPool`, {
      selfSignUpEnabled: true, // Allow users to sign up
      autoVerify: { email: true }, // Verify email addresses by sending a verification code
      //signInAliases: { email: true }, // Set email as an alias
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
        tempPasswordValidity: Duration.days(3),
      },
    });

    const userPoolClient = new aws_cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      generateSecret: false, // Don't need to generate secret for web app running on browsers
    });

    const identityPool = new IdentityPool(this, "IdentityPool", {
      authenticationProviders: {
        userPools: [new UserPoolAuthenticationProvider({ userPool })],
      },
    });
    const { unauthenticatedRole, identityPoolId } = identityPool;

    NagSuppressions.addResourceSuppressions(identityPool, [
      {
        id: "AwsSolutions-COG7",
        reason: "Application uses unauthenticated access (i.e. guest) only, so this setting is needed.",
      },
    ]);

    identityPool.authenticatedRole.attachInlinePolicy(
      new Policy(this, "locationService", {
        statements: [
          new PolicyStatement({
            actions: ["geo:GetMapGlyphs", "geo:GetMapSprites", "geo:GetMapStyleDescriptor", "geo:GetMapTile"],
            resources: [`arn:aws:geo:${Stack.of(this).region}:${Stack.of(this).account}:map/${application_name}Map`],
          }),
          new PolicyStatement({
            actions: ["geo:ListGeofences", "geo:BatchPutGeofence", "geo:BatchDeleteGeofence"],
            resources: [
              `arn:aws:geo:${Stack.of(this).region}:${
                Stack.of(this).account
              }:geofence-collection/${application_name}GeofenceCollection`,
            ],
          }),
          new PolicyStatement({
            actions: ["geo:CalculateRoute"],
            resources: [
              `arn:aws:geo:${Stack.of(this).region}:${
                Stack.of(this).account
              }:route-calculator/${application_name}RouteCalculator`,
            ],
          }),
        ],
      })
    );

    new CfnOutput(this, "IdentityPoolId", {
      value: identityPoolId,
    });

    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new CfnOutput(this, "AppClientId", {
      value: userPoolClient.userPoolClientId,
    });
  }
}
