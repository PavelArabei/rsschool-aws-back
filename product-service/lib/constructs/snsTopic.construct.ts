import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export class SnsTopicConstruct extends Construct {

  createProductTopic: ITopic;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.createProductTopic = new sns.Topic(this, 'CreateProductTopic', {
      topicName: 'createProductTopic1',
    });

    this.createProductTopic.addSubscription(new subscriptions.EmailSubscription('ptashkaaaaaa@gmail.com', {
        filterPolicy: {
          price: sns.SubscriptionFilter.numericFilter({
            greaterThan: 500,
          }),
        },
      }),
    );

    this.createProductTopic.addSubscription(new subscriptions.EmailSubscription('pavelarabei7788@gmail.com', {
        filterPolicy: {
          price: sns.SubscriptionFilter.numericFilter({
            lessThanOrEqualTo: 500,
          }),
        },
      }),
    );

  }
}
