import { defineBackend } from '@aws-amplify/backend'
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';


const backend = defineBackend({});
const authStack = backend.createStack("sealution-amplify-authStack");

const userPool = UserPool.fromUserPoolId(authStack, 'sealution-amplify-userpool',"eu-west-1_HSKEl20aw")
const userPoolClient = UserPoolClient.fromUserPoolClientId(authStack, 'sealution-amplify-userpool-client',"5l53nqgbnc9m5sdpq6jenn3u0j")

backend.addOutput({
    auth: {
        user_pool_id: userPool.userPoolId,
        user_pool_client_id: userPoolClient.userPoolClientId,
        aws_region: authStack.region,
    }
})