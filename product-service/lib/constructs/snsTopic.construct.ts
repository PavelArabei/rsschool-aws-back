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
    this.createProductTopic.addSubscription(new subscriptions.EmailSubscription('ptashkaaaaaa@gmail.com'));

  }
}
