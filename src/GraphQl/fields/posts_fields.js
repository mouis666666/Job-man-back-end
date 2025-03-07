import { add_posts_resolvers,  list_all_post_resolvers } from "../resolvers/posts_resolvers.js";
import { GraphQLBoolean, GraphQLNonNull, GraphQLString } from 'graphql';




export const postFields = {
    query : {
        listPosts : {
            type : GraphQLString ,
            description :  " this is a string type ",
            args : {
                access_token :{ type :  new GraphQLNonNull(GraphQLString) , description :  "access token id " } ,
                title :{ type : new GraphQLNonNull(GraphQLString) ,description :" this is title "  },
                desc :{ type : GraphQLString ,description :" this is desc "  },
                allowComments :{ type :  GraphQLBoolean  ,description :" this is allow comments "  }
            } ,
            resolve : (__, args ) => list_all_post_resolvers(args) // need to send it  in a callback function to be viewed
        }

    },

    mutation :{
        Posts : {
            type : GraphQLString ,
            description :  " this is a string type ",
            resolve : add_posts_resolvers
        }
    }
}










// this is just for the test

// export const commentsFields = {
//     query : {
        
//         listComments : {
//             type : GraphQLString ,
//             description :  " this is a string type 2",
//             resolve : comments_resolvers
//         }

//     },

//     mutation :{
        
//         listComments : {
//             type : GraphQLString ,
//             description :  " this is a string type 2",
//             resolve : comments_resolvers
//         }
//     }
// }