import { Product, ProductWithoutId, Stock, WholeProduct } from '../../types/product';
import { v4 as uuidv4 } from 'uuid';
import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandOutput,
  TransactWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const client = new DynamoDBClient({});
export const docClient = DynamoDBDocumentClient.from(client);
const productsTableName = process.env.PRODUCTS_TABLE ?? 'PRODUCTS_TABLE';
const stocksTableName = process.env.STOCK_TABLE ?? 'STOCK_TABLE';

export const createProduct = async (product: ProductWithoutId): Promise<Product> => {

  const id = uuidv4();
  const { title, description, price, count } = product;

  const command = new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName: productsTableName,
          Item: {
            id,
            title,
            description,
            price,
          },
        },
      },
      {
        Put: {
          TableName: stocksTableName,
          Item: {
            product_id: id,
            count: count || 1,
          },
        },
      }],
    ReturnConsumedCapacity: 'TOTAL',
  });

  await docClient.send(command);

  return {
    id,
    ...product,
  };
};


export const getProduct = async (id: string): Promise<WholeProduct> => {
  const command = new BatchGetCommand({
    RequestItems: {
      [productsTableName]: {
        Keys: [
          {
            id,
          },
        ],
      },
      [stocksTableName]: {
        Keys: [
          {
            product_id: id,
          },
        ],
      },
    },
  });

  const { Responses } = await docClient.send(command);

  if (!Responses) {
    throw new Error(`Product with id ${id} not found`);
  }

  const products = Responses[productsTableName] as Product[];
  const stocks = Responses[stocksTableName] as Stock[];

  if (!products.length || !stocks.length) {
    throw new Error(`Product with id ${id} not found`);
  }

  const product = products[0];
  const stock = stocks[0];

  if (!product || !stock) {
    throw new Error(`Product with id ${id} not found`);
  }

  return {
    ...product,
    count: stock.count,
  };

};


const scan = async <T>(tableName: string): Promise<ScanCommandOutput> => {
  const command = new ScanCommand({ TableName: tableName });
  return docClient.send(command) as Promise<ScanCommandOutput>;
};

export const getProducts = async (): Promise<WholeProduct[]> => {
  console.log('Products-table-name', productsTableName,
    'Stocks-table-name', stocksTableName);

  const [productsResult, stocksResult] = await Promise.all([
    scan(productsTableName),
    scan(stocksTableName),
  ]);

  const products = productsResult.Items as Product[];
  const stocks = stocksResult.Items as Stock[];

  if (!products || !stocks) {
    throw new Error('Products or stocks not found');
  }

  return products.map(product => {
    const stock = stocks.find(stock => stock.product_id === product.id);
    return {
      ...product,
      count: stock ? stock.count : 0,
    };
  });
};
