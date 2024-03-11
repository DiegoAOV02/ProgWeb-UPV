document.querySelector('.show-winners').addEventListener('click', () => {
    const bestTimes = JSON.parse(localStorage.getItem('ticTacToeBestTimes')) || [];
    const winners = bestTimes.filter(record => record.name !== "" && record.time !== "");
    const winnersList = winners.map(record => record.name).join(", ");
    if (winnersList !== "") {
        alert(`Winners: ${winnersList}`);
    } else {
        alert("No winners yet!");
    }
});
