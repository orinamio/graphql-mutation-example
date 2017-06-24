const uuidv4 = require('uuid/v4');
const _ = require("lodash");
const { GraphQLID, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType, GraphQLEnumType, GraphQLSchema } = require('graphql');
const Quotes = require('../data/quote.js');

const QuoteType = new GraphQLObjectType({
  name: 'QuoteType',
  description: 'Chuck Norris Quotes',
  fields: {
    id: { type: GraphQLString },
    quote: { type: GraphQLString }
  }
});
const QuoteCreateType = new GraphQLInputObjectType({
  name: 'QuoteCreateType',
  type: QuoteType,
  fields: {
    quote: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const QuoteUpdateType = new GraphQLInputObjectType({
  name: 'QuoteUpdateType',
  type: QuoteType,
  fields: {
    id: {type: new GraphQLNonNull(GraphQLString)},
    quote: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const QuoteDeleteType = new GraphQLInputObjectType({
  name: 'QuoteDeleteType',
  type: QuoteType,
  fields: {
    id: {type: new GraphQLNonNull(GraphQLString)}
  }
});

const ChuckNorrisQueryType = new GraphQLObjectType({
  name: 'ChuckNorrisQuerytype',
  description: 'Chuck Norris Query Schema',
  fields: {
    quotes: {
      type: new GraphQLList(QuoteType),
      resolve: () => Quotes 
    }
  }
});

const ChuckNorrisMutationType = new GraphQLObjectType({
  name: 'ChuckNorrisMutationType',
  description: 'Chuck Norris Query Schema',
  fields: {
    createQuote: {
      type: QuoteType,
      args: {
        quote: { type: new GraphQLNonNull(QuoteCreateType) }
      },
      resolve: (source, { quote }) => {
        quote.id = uuidv4();
        quote.quote = quote.quote;

        Quotes.push(quote);
        return quote;
      }
    },
    updateQuote: {
      type: QuoteType,
      args: {
        quote: { type: new GraphQLNonNull(QuoteUpdateType) }
      },
      resolve: (source, {quote}) => {
        let quoteData = [];
        quoteData.id = quote.id;
        quoteData.quote = quote.quote;

        let index = Quotes.indexOf(quote.id);
        let updateQuote = Quotes.splice(index, 1, quoteData);

        return quote;
      }
    },
    deleteQuote: {
      type: QuoteType,
      args: {
        quote: {type: new GraphQLNonNull(QuoteDeleteType)}
      },
      resolve: (source, {quote}) => {
        let value = _.remove(Quotes, q => q.id == quote.id)
        return quote;
      }
    }
  }
});

const ChockNorrisSchema = new GraphQLSchema({
  query: ChuckNorrisQueryType,
  mutation: ChuckNorrisMutationType
});

module.exports = ChockNorrisSchema;
