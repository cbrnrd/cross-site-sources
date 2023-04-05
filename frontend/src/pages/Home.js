import axios from "axios"
import ArticleGrid from "../components/Article/ArticleGrid.js"
import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar"

const Home = async () => {

  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"
  //const articles = await axios.get(`${BACKEND_URL}/articles`)
  const articles = [
    {
      title: "Article 1",
      content: "This is the content of article 1",
      likes: 1
    }
  ]

  return (
    <>
      <NavBar />
      <SearchBar />
      <ArticleGrid articles={articles.data} />
    </>
  )

}

export default Home;
