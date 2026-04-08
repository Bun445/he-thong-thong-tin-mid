import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ThumbsUp, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { KNOWLEDGE_BASE, type KnowledgeBaseArticle } from "@/lib/data";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Academic: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  Finance: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  Facilities: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "IT Support": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  Wellbeing: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
  Admissions: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400",
};

const KnowledgeBase = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(KNOWLEDGE_BASE.map((a) => a.category))),
    []
  );

  const filtered = useMemo(() => {
    let data = [...KNOWLEDGE_BASE];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== "all") {
      data = data.filter((a) => a.category === selectedCategory);
    }
    return data;
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-display">Knowledge Base</h1>
          </div>
          <p className="mt-1 ml-12 text-muted-foreground text-sm">
            Browse frequently asked questions and self-service guides. Powered by our centralized knowledge system.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="kb-search"
              placeholder="Search articles, topics, or keywords…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Articles */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No articles found</p>
              <p className="text-xs text-muted-foreground mt-1">Try different search terms or category</p>
            </div>
          ) : (
            filtered.map((article) => (
              <div
                key={article.id}
                className="rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  className="w-full text-left p-5 flex items-start justify-between gap-4"
                  onClick={() =>
                    setExpandedId(expandedId === article.id ? null : article.id)
                  }
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Badge
                        variant="secondary"
                        className={cn("text-[10px]", categoryColors[article.category])}
                      >
                        {article.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Eye className="h-3 w-3" /> {article.views}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" /> {article.helpful}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm">{article.title}</h3>
                    {expandedId !== article.id && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {article.content}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {expandedId === article.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {expandedId === article.id && (
                  <div className="px-5 pb-5 border-t pt-4 animate-in slide-in-from-top-1 duration-200">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {article.content}
                    </p>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {article.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[10px] cursor-pointer hover:bg-muted"
                          onClick={() => setSearch(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
                      <span>Was this helpful?</span>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1">
                        <ThumbsUp className="h-3 w-3" /> Yes ({article.helpful})
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBase;
