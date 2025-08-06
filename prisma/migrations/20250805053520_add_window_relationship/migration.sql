-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Queue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "ticketNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "windowId" INTEGER,
    CONSTRAINT "Queue_windowId_fkey" FOREIGN KEY ("windowId") REFERENCES "Window" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Queue" ("createdAt", "deletedAt", "firstName", "id", "lastName", "status", "studentId", "ticketNumber") SELECT "createdAt", "deletedAt", "firstName", "id", "lastName", "status", "studentId", "ticketNumber" FROM "Queue";
DROP TABLE "Queue";
ALTER TABLE "new_Queue" RENAME TO "Queue";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
