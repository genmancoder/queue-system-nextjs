-- CreateTable
CREATE TABLE "Window" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "windowTitle" TEXT NOT NULL,
    "windowDescription" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME
);
