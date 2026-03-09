import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

// npx drizzle-kit push             para subir los cambios

// tabla de ejemplo 
export const usersTable = mysqlTable('users_table', {
    id: int().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    age: int().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});
