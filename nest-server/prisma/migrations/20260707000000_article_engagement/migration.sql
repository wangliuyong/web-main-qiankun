-- CreateTable
CREATE TABLE "ArticleLike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArticleLike_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArticleBookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArticleBookmark_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArticleComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "nickname" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "visitorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArticleComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ArticleLike_articleId_idx" ON "ArticleLike"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleLike_articleId_visitorId_key" ON "ArticleLike"("articleId", "visitorId");

-- CreateIndex
CREATE INDEX "ArticleBookmark_articleId_idx" ON "ArticleBookmark"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleBookmark_articleId_visitorId_key" ON "ArticleBookmark"("articleId", "visitorId");

-- CreateIndex
CREATE INDEX "ArticleComment_articleId_idx" ON "ArticleComment"("articleId");

-- CreateIndex
CREATE INDEX "ArticleComment_createdAt_idx" ON "ArticleComment"("createdAt");
