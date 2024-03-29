import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from "path";
import {
    aws_s3 as s3,
    aws_s3_deployment as s3Deployment,
    aws_cloudfront as cf,
    aws_cloudfront_origins as cfOrigin,
    Duration

} from 'aws-cdk-lib';



export interface StaticWebsiteProps {
    assetPath: string;
    bucketName: string;

}

export class StaticWebsite extends Construct {

    public readonly bucket: s3.IBucket;
    public readonly cfDistribution: cf.IDistribution;

    constructor(scope: Construct, id: string, props: StaticWebsiteProps) {
        super(scope, id);

        this.bucket = new s3.Bucket(this, props.bucketName, {
            accessControl: s3.BucketAccessControl.PRIVATE,
        })

        
        const originAccessIdentity = new cf.OriginAccessIdentity(this, 'OriginAccessIdentity');
        this.bucket.grantRead(originAccessIdentity);

        this.cfDistribution = new cf.Distribution(this, `${props.bucketName}-distribution`, {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new cfOrigin.S3Origin(this.bucket, { originAccessIdentity }),
            },
            errorResponses:[
                {httpStatus: 404, responseHttpStatus:200, responsePagePath:'/index.html', ttl: Duration.minutes(5)},
                {httpStatus: 403, responseHttpStatus:200, responsePagePath:'/index.html', ttl: Duration.minutes(5)}]
        })

        new s3Deployment.BucketDeployment(this, `${props.bucketName}-deployment`, {
            destinationBucket: this.bucket,
            sources: [s3Deployment.Source.asset(path.resolve(__dirname, props.assetPath))],
            distribution: this.cfDistribution,
            distributionPaths: ['/*'],
        })

    }
}