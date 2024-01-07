class Card {
    constructor(image) {
        this.image = image;

        this.render(this.image);
    }

    render(image) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.name = image;
        card.innerHTML = `
      <img class="face" src="./images/${image}.jpg" alt="${image}"/>
      <div class="back"></div>`;
        this.card = card;
    }

    flip() {
        this.card.classList.remove("flipped");
    }

    hide() {
        this.card.classList.add("hidden")
    }

    checkWithAnotherCard(anotherCard) {
        return this.card.name === anotherCard.card.name;
    }
}

class Game {
    constructor(images, container) {
        this.images = images;
        this.container = container;
        this.cards = [];
        this.cardsCheck = [];
        this.addEventListeners();
    }

    images;
    instancesMap = new Map();

    renderCards() {
        const clone = this.images.slice(0); // duplicate array
        const cards = this.images.concat(clone); // merge to arrays
        const sortedCards = this.sortCards(cards);

        const fragment = document.createDocumentFragment();

        sortedCards.forEach((image, index) => {
            const card = new Card(image);
            const cardContainer = card.card;
            cardContainer.setAttribute('data-index', index);

            // map
            this.instancesMap.set([cardContainer], card);

            fragment.append(cardContainer);
            this.cards.push(card);
        });
        this.container.append(fragment);
        this.cardsLength = this.cards.length;
    }

    addEventListeners () {
        this.container.addEventListener('click', (e) => this.handleCardClick(e));
    }

    handleCardClick(e) {
        const eventTarget = e.target;

        if (!eventTarget.className.includes('card')) {
            return;
        }

        this.cardsCheck.push(eventTarget);

        this.checkCards(eventTarget);
    }

    sortCards = (images) => {
        return [...images].sort(function () {
            return 0.5 - Math.random();
        });
    }

    startGame() {
        this.renderCards();
    }

    checkCards (card) {
        card.classList.add('flipped');

        this.checkMatching();

        this.checkIsWon();
    }

    checkMatching() {
        if (this.cardsCheck.length === 2) {
            const [card1El, card2El] = this.cardsCheck;
            const card1Index = parseInt(card1El.dataset.index);
            const card2Index = parseInt(card2El.dataset.index);
            const card1 = this.cards[card1Index];
            const card2 = this.cards[card2Index];

            if (card1.checkWithAnotherCard(card2)) {
                [card1, card2].forEach(card => {
                    card.hide();
                })
                this.cardsCheck = [];
                this.cardsLength -= 2;
                return;
            }

            [card1, card2].forEach(card => {
                setTimeout(() =>
                    card.flip(), 1500);
            })
            this.cardsCheck = [];
        }
    }

    checkIsWon() {
        if (!this.cardsLength)
        {
            setTimeout(() => window.alert("You are the winner! Congrats!"),  1000);
        }
    }
}

(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const gameContainer = document.querySelector('.game');
        const game = new Game(['301', '400', '402', '403', '450', '522'], gameContainer);
        game.startGame(gameContainer)
    });
})();
