import { m } from '$lib/paraglide/messages';

export function driverExtensionTagline(id: string, fallback: string): string {
	switch (id) {
		case 'driver-postgres':
			return m.extensions_driver_postgres_tagline();
		case 'driver-mysql':
			return m.extensions_driver_mysql_tagline();
		case 'driver-mssql':
			return m.extensions_driver_mssql_tagline();
		case 'driver-mongodb':
			return m.extensions_driver_mongodb_tagline();
		case 'driver-jdbc':
			return m.extensions_driver_jdbc_tagline();
		case 'driver-cql':
			return m.extensions_driver_cql_tagline();
		case 'driver-redis':
			return m.extensions_driver_redis_tagline();
		case 'driver-warehouse':
			return m.extensions_driver_warehouse_tagline();
		case 'driver-dynamodb':
			return m.extensions_driver_dynamodb_tagline();
		case 'driver-firebase':
			return m.extensions_driver_firebase_tagline();
		case 'driver-neo4j':
			return m.extensions_driver_neo4j_tagline();
		case 'driver-couchbase':
			return m.extensions_driver_couchbase_tagline();
		default:
			return fallback;
	}
}
