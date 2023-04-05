import ArticleCard from './ArticleCard.js'

const ArticleGrid = ({ articles }) => {
  return (
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      {articles.map((article) => (
        <ArticleCard article={article} />
      ))}
    </div>
  )
}

export default ArticleGrid;
