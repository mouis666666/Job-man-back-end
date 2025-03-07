
import { GraphQLSchema ,  GraphQLObjectType , GraphQLString } from 'graphql';
import { postFields } from './fields/posts_fields.js';
// import { commentsFields } from './fields/posts_fields.js';





export const main_schema = new GraphQLSchema({
    query : new GraphQLObjectType({
        name : "mainQuery",
        description : " THIS IS THE MAIN QUERY ",
        fields : { 
            ...postFields.query,
            // ...commentsFields.query
        }
    }),

    mutation : new GraphQLObjectType({
        name : "mutationQuery",
        description : " THIS IS THE MAIN QUERY ",
        fields : {
            ...postFields.mutation,
            // ...commentsFields.mutation
        }
    })
})