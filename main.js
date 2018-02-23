const input = document.querySelector('input');
const recipes = document.querySelectorAll('h3');

input.addEventListener('input', ()=>{
  const query = input.value;
  const re = new RegExp(query, "i");
  recipes.forEach((recipe)=>{
    if(re.test(recipe.textContent)){
      recipe.style.display = "block";
    } else {
      recipe.style.display = "none";
    }
  });
});
input.style.display = "inline-block";
