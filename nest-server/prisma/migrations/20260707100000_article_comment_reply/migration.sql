-- 评论支持回复：parentId 与 replyToNickname
ALTER TABLE "ArticleComment" ADD COLUMN "parentId" INTEGER REFERENCES "ArticleComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ArticleComment" ADD COLUMN "replyToNickname" TEXT;
CREATE INDEX IF NOT EXISTS "ArticleComment_parentId_idx" ON "ArticleComment"("parentId");
