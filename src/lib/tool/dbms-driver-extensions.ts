/** Database Manager driver sidecars (landing store + extensions page). */

export type DbmsDriverExtensionMeta = {
	readonly id: string;
	readonly name: string;
	readonly iconSlug: string;
	readonly taglineKey: string;
};

export const DBMS_DRIVER_EXTENSIONS: readonly DbmsDriverExtensionMeta[] = [
	{
		id: 'driver-postgres',
		name: 'PostgreSQL driver',
		iconSlug: 'postgresql',
		taglineKey: 'extensions_driver_postgres_tagline'
	},
	{
		id: 'driver-mysql',
		name: 'MySQL and MariaDB driver',
		iconSlug: 'mysql',
		taglineKey: 'extensions_driver_mysql_tagline'
	},
	{
		id: 'driver-mssql',
		name: 'SQL Server driver',
		iconSlug: 'dotnet',
		taglineKey: 'extensions_driver_mssql_tagline'
	},
	{
		id: 'driver-mongodb',
		name: 'MongoDB driver',
		iconSlug: 'mongodb',
		taglineKey: 'extensions_driver_mongodb_tagline'
	},
	{
		id: 'driver-jdbc',
		name: 'JDBC driver pack',
		iconSlug: 'openjdk',
		taglineKey: 'extensions_driver_jdbc_tagline'
	},
	{
		id: 'driver-cql',
		name: 'Cassandra and Scylla driver',
		iconSlug: 'apache',
		taglineKey: 'extensions_driver_cql_tagline'
	},
	{
		id: 'driver-redis',
		name: 'Redis driver',
		iconSlug: 'redis',
		taglineKey: 'extensions_driver_redis_tagline'
	},
	{
		id: 'driver-warehouse',
		name: 'Snowflake driver',
		iconSlug: 'snowflake',
		taglineKey: 'extensions_driver_warehouse_tagline'
	},
	{
		id: 'driver-dynamodb',
		name: 'DynamoDB driver',
		iconSlug: 'serverless',
		taglineKey: 'extensions_driver_dynamodb_tagline'
	},
	{
		id: 'driver-firebase',
		name: 'Firebase Realtime Database driver',
		iconSlug: 'firebase',
		taglineKey: 'extensions_driver_firebase_tagline'
	},
	{
		id: 'driver-neo4j',
		name: 'Neo4j driver',
		iconSlug: 'neo4j',
		taglineKey: 'extensions_driver_neo4j_tagline'
	},
	{
		id: 'driver-couchbase',
		name: 'Couchbase driver',
		iconSlug: 'couchbase',
		taglineKey: 'extensions_driver_couchbase_tagline'
	}
] as const;

export const DRIVER_EXTENSION_VERSION = '0.1.0';

export function driverExtensionPackagePath(id: string): string {
	return `/extensions/packages/dbms-desktop-menzies/${id}/${DRIVER_EXTENSION_VERSION}/linux-x86_64.zip`;
}
