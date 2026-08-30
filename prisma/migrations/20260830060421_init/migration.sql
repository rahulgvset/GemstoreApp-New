-- CreateTable
CREATE TABLE "ZodiacSign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "dateRange" TEXT NOT NULL,
    "element" TEXT NOT NULL,
    "rulingPlanet" TEXT NOT NULL,
    "traits" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Gemstone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "hex" TEXT NOT NULL,
    "chakra" TEXT NOT NULL,
    "properties" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "compareAtPrice" REAL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "beadSizeMm" INTEGER NOT NULL DEFAULT 8,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductGemstone" (
    "productId" TEXT NOT NULL,
    "gemstoneId" TEXT NOT NULL,

    PRIMARY KEY ("productId", "gemstoneId"),
    CONSTRAINT "ProductGemstone_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductGemstone_gemstoneId_fkey" FOREIGN KEY ("gemstoneId") REFERENCES "Gemstone" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductZodiacSign" (
    "productId" TEXT NOT NULL,
    "signId" TEXT NOT NULL,

    PRIMARY KEY ("productId", "signId"),
    CONSTRAINT "ProductZodiacSign_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductZodiacSign_signId_fkey" FOREIGN KEY ("signId") REFERENCES "ZodiacSign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
