const ArticleCard = ({ article }) => {
  return (
    <div class="bg-white rounded-lg shadow-md p-4">
            <h2 class="font-bold text-lg mb-2">{article.title}</h2>
            <p class="text-gray-600 text-sm mb-4">{article.content}</p>
            <div class="flex items-center justify-between">
                <p class="text-gray-400 text-xs">{article.likes} likes</p>
                <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"><i
                        class="far fa-thumbs-up"></i> Like</button>
            </div>
        </div>
  )
}

export default ArticleCard;
