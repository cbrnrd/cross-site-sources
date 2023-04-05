const NavBar = () => {
  return (
    <nav class="bg-red-500 text-white px-4 py-3">
        <div class="flex justify-between items-center">
            <a href="#" class="text-lg font-bold">X.S.S</a>
            <ul class="flex">
                <li><a href="/" class="ml-4">Home</a></li>
                <li><a href="#" class="ml-4">Sign up</a></li>
                <li><a href="#" class="ml-4">Log in</a></li>
            </ul>
        </div>
    </nav>
  )
}

export default NavBar;
