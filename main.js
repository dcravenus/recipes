const input = document.querySelector('input');
const recipes = document.querySelectorAll('div.recipe');

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

console.log(tags);
Object.keys(tags).forEach((tagKey)=>{
  const tagNode = document.createElement('div');
  tagNode.appendChild(document.createTextNode(tagKey));

  tags[tagKey].forEach((recipe)=>{
    document.getElementById(recipe).appendChild(tagNode.cloneNode(true));
  })

})
recipes.forEach((recipe)=>{

});
