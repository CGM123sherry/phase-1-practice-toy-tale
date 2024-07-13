document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyBtn = document.getElementById('add-toy-btn');
  const toyFormContainer = document.getElementById('toy-form-container');
  const toyForm = document.querySelector('.add-toy-form');

  // Toggle toy form visibility
  if (addToyBtn) {
    addToyBtn.addEventListener('click', () => {
      const isVisible = toyFormContainer.style.display === 'block';
      toyFormContainer.style.display = isVisible ? 'none' : 'block';
    });
  }

  // Fetch toys from JSON Server and render them
  fetch('http://localhost:3001/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        const toyCard = createToyCard(toy);
        toyCollection.appendChild(toyCard);
      });
    });

  // Function to create a toy card
  function createToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;

    const img = document.createElement('img');
    img.src = toy.image;
    img.className = 'toy-avatar';

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement('button');
    button.className = 'like-btn';
    button.id = toy.id;
    button.textContent = 'Like ❤️';
    button.addEventListener('click', () => increaseLikes(toy, p));

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    return card;
  }

  // Function to handle increasing likes
  function increaseLikes(toy, p) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3001/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(response => response.json())
    .then(updatedToy => {
      p.textContent = `${updatedToy.likes} Likes`;
      toy.likes = updatedToy.likes;  // Update the toy object in memory
    });
  }

  // Add new toy
  if (toyForm) {
    toyForm.addEventListener('submit', event => {
      event.preventDefault();

      const toyName = event.target.name.value;
      const toyImage = event.target.image.value;

      const newToy = {
        name: toyName,
        image: toyImage,
        likes: 0  // Assuming new toys start with 0 likes
      };

      fetch('http://localhost:3001/toys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(createdToy => {
        const toyCard = createToyCard(createdToy);
        toyCollection.appendChild(toyCard);
      });

      // Clear the form
      event.target.reset();
      toyFormContainer.style.display = 'none'; // Hide the form after submission
    });
  }
});
