const { GraphQLID, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLNonNull,
  GraphQLObjectType, GraphQLInputObjectType, GraphQLEnumType, GraphQLSchema } = require('graphql');

const mongoose = require('mongoose'); 
mongoose.connect('mongodb://chucknorris:admin@ds135522.mlab.com:35522/chucknorris');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database Connected!")
});

const Schema = mongoose.Schema;

const quoteSchema = new Schema({
  _id:  String,
  query: String
});

const Quote = mongoose.model('Quotes', quoteSchema);


const QuoteType = new GraphQLObjectType({
  name: 'QuoteType',
  description: 'Chuck Norris Quotes',
  fields: {
    _id: { type: GraphQLString },
    quote: { type: GraphQLString }
  }
})

const ChuckNorrisQueryType = new GraphQLObjectType({
  name: 'ChuckNorrisQuerytype',
  description: 'Chuck Norris Query Schema',
  fields: {
    quotes: {
      type: QuoteType,
      resolve: () => Quote.find((err, quotes) => {
        if(err){
          console.error(err);
        }
        console.log(quotes);
        return quotes;
      })
    }
  }
});

const QuoteInputType = new GraphQLInputObjectType({
  name: 'QuoteInputType',
  fields: {
    quote: { type: new GraphQLNonNull(GraphQLString) }
  }
})


const ChuckNorrisMutationType = new GraphQLObjectType({
  name: 'ChuckNorrisMutationType',
  description: 'Chuck Norris Query Schema',
  fields: {
    createQuote: {
      type: QuoteType,
      args: {
        quote: { type: QuoteInputType }
      },
      resolve: (source, { quote }) => {
        Quote.create((err, quote) => {
          if (err) {
            console.error(err);
          }
          console.log(quote);
        })
      }
    }
    // },
    // updateQuote: {
    //   type: QuoteType,
    //   args: {
    //     _id: {type: new GraphQLNonNull(GraphQLString)}
    //   },
    //   resolve: (source, {_id}) => {
        
    //   }
    // },
    // deleteQuote: {
    //   type: QuoteType,
    //   args: {
    //     _id: {type: new GraphQLNonNull(GraphQLString)}
    //   },
    //   resolve: (source, {_id}) => {
        
    //   }
    }
});

const ChockNorrisSchema = new GraphQLSchema({
  query: ChuckNorrisQueryType,
  mutation: ChuckNorrisMutationType
});

module.exports = ChockNorrisSchema;
