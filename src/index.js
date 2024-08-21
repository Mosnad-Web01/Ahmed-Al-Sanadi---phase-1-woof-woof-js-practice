document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    let isFilterOn = false;


    function fetchDogs() {
        fetch('http://localhost:3000/pups')
            .then(response => response.json())
            .then(dogs => {
                displayDogs(dogs);
            })
            .catch(error => console.error('Error fetching dogs:', error));
    }

    function displayDogs(dogs) {
        dogBar.innerHTML = '';
        if (isFilterOn) {
            dogs = dogs.filter(dog => dog.isGoodDog);
        }
        dogs.forEach(dog => {
            const span = document.createElement('span');
            span.textContent = dog.name;
            span.dataset.id = dog.id;
            span.addEventListener('click', () => displayDogInfo(dog));
            dogBar.appendChild(span);
        });
    }

  
    function displayDogInfo(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}">
            <h2>${dog.name}</h2>
            <button id="good-dog-button">${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
        `;
        document.getElementById('good-dog-button').addEventListener('click', () => toggleDogStatus(dog));
    }

    // Toggle the dog's good/bad status
    function toggleDogStatus(dog) {
        const updatedDog = { ...dog, isGoodDog: !dog.isGoodDog };
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isGoodDog: updatedDog.isGoodDog }),
        })
        .then(response => response.json())
        .then(() => {
            displayDogInfo(updatedDog);
            fetchDogs(); // Refresh dog list to reflect status change
        })
        .catch(error => console.error('Error updating dog status:', error));
    }


    function toggleFilter() {
        isFilterOn = !isFilterOn;
        filterButton.textContent = isFilterOn ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
        fetchDogs(); 
    }

    filterButton.addEventListener('click', toggleFilter);


    fetchDogs();
});
