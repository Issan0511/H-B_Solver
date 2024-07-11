
let guess = '2806';
let candidates = permutations('0123456789', 4);

document.getElementById('submit-btn').addEventListener('click', () => {
    const hit = parseInt(document.getElementById('hit').value);
    const blow = parseInt(document.getElementById('blow').value);
    if (isNaN(hit) || isNaN(blow) || hit + blow > 4) {
        alert('Please enter valid values for hit and blow.');
        return;
    }
    const output = hitAndBlowSolver(hit, blow);
    document.getElementById('guess-output').innerText = `Guess: ${output.guess}`;
    document.getElementById('status-output').innerText = output.status;
});

function hitAndBlowSolver(hit, blow) {
    if (hit === 4) {
        return { guess, status: `Correct! The answer is ${guess}.` };
    }

    candidates = filterCandidates(candidates, guess, hit, blow);

    if (candidates.length === 1) {
        return { guess: candidates[0].join(''), status: `The answer must be ${candidates[0].join('')}` };
    }

    if (candidates.length === 2) {
        return { guess: candidates[0].join(''), status: `The answer must be ${candidates[0].join('')} or ${candidates[1].join('')}` };
    }

    if (candidates.length <= 8) {
        return { guess: guess, status: `Candidates available are ${candidates.map(c => c.join('')).join(', ')}` };
    }

    const bestGuess = candidates.reduce((best, candidate) => {
        const candidateGuess = candidate.join('');
        const entropy = calculateEntropy(candidates, candidateGuess);
        return entropy > best.entropy ? { guess: candidateGuess, entropy } : best;
    }, { guess: null, entropy: -Infinity });

    guess = bestGuess.guess;
    return { guess, status: `The number of candidates available is ${candidates.length}` };
}

function getHitAndBlow(guess, answer) {
    let hit = 0;
    let blow = 0;

    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === answer[i]) {
            hit++;
        } else if (answer.includes(guess[i])) {
            blow++;
        }
    }

    return [hit, blow];
}

function filterCandidates(candidates, guess, hit, blow) {
    return candidates.filter(cand => {
        const [h, b] = getHitAndBlow(guess, cand);
        return h === hit && b === blow;
    });
}

function calculateEntropy(candidates, guess) {
    const hintDistribution = {};

    candidates.forEach(candidate => {
        const hint = getHitAndBlow(guess, candidate).toString();
        hintDistribution[hint] = (hintDistribution[hint] || 0) + 1;
    });

    const total = candidates.length;
    let entropy = 0;

    Object.values(hintDistribution).forEach(count => {
        const probability = count / total;
        entropy -= probability * Math.log2(probability);
    });

    return entropy;
}

function permutations(str, length) {
    if (length === 1) {
        return str.split('').map(ch => [ch]);
    }

    const result = [];

    str.split('').forEach((ch, idx) => {
        const remaining = str.slice(0, idx) + str.slice(idx + 1);
        const perms = permutations(remaining, length - 1);
        perms.forEach(perm => result.push([ch].concat(perm)));
    });

    return result;
}
